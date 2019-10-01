/* global AFRAME, THREE */
const _ = require("lodash");
const LoadSCVVWorker = require("worker-loader!../workers/LoadSCVVWorker.min");
const { downloadBin, downloadAudioBuffer } = require("./utils");
// Firebase App (the core Firebase SDK) is always required and must be listed first
// Add the Firebase products that you want to use

AFRAME.registerComponent("scvv", {
  schema: {
    autoplay: { default: true },
    loop: { default: true },
    maxDistance: { default: 10000 },
    distanceModel: {
      default: "inverse",
      oneOf: ["linear", "inverse", "exponential"]
    },
    refDistance: { default: 1 },
    rolloffFactor: { default: 1 },
    volume: { default: 1 },
    src: {
      type: "string"
    }
  },

  multiple: true,

  init() {
    this.listener = null;

    this.setupBuffers();
    this.setupMesh();
    this.setupAudio();
  },

  update(oldData) {
    var data = this.data;
    const HOXEL_URL = data.src;
    console.log(`updating scvv: ${HOXEL_URL}`);

    var srcChanged = data.src !== oldData.src;

    // Reset all the things
    if (srcChanged && HOXEL_URL && HOXEL_URL.length > 5) {
      this.setupBuffers();
      this.setupMesh();
      this.setupAudio();

      // Download the scvv json to get this party started
      downloadBin(`${HOXEL_URL}/scvv.json`, "json")
        .then(json => {
          this.scvvJSON = {
            HOXEL_URL,
            ...json
          };
          this.getAudioBuffer();
          this.callHoxelWorkers();
        })
        .catch(err => {
          console.log("error downloading json", err);
        });
    }
  },

  remove() {
    var el = this.el;
    // console.log('removing')
    this.el.removeObject3D("mesh");
    this.mesh = null;
    this.material = null;
    if (this.positionalAudio.isPlaying) this.positionalAudio.stop();
    this.audioPlaying = false;
    this.positionalAudio = null;
    this.group = null;
    this.setupBuffers();
  },

  setupBuffers() {
    this.ddFrameWorkers = [];
    this.newFrames = [];
    this.bufferedFrames = [];
    this.badFrames = [];
    this.seenFrames = [];
    this.numWorkers = 2;
    this.maxBufferedCount = 500;
    this.isPlaying = false;
    this.frameIdx = 0;
    this.deltas = 0;
    this.vv_frame_ms = 0;

    this.audioBuffer = null;
    this.downloadingAudioBuffer = false;
  },

  setupMesh() {
    var el = this.el;

    this.scandyToThreeMat = new THREE.Matrix4();

    // THREEJS objects to playback the SCVV frames
    this.scvvTextureImage = new Image();
    this.scvvTexture = new THREE.Texture(this.scvvTextureImage);
    // Bind the onload of the image to always update the texture
    this.scvvTextureImage.onload = () => {
      // console.log('text')
      this.scvvTexture.needsUpdate = true;
    };
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      // color: 0x00ff00,
      // opacity: 0.92,
      // transparent: true,
      side: THREE.DoubleSide
    });
    let geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    this.mesh = new THREE.Mesh(geometry, this.material);

    this.group = new THREE.Group();
    this.group.add(this.mesh);

    el.setObject3D("mesh", this.group);
  },

  setupAudio() {
    const { el, data } = this;
    const { sceneEl } = el;
    const listener = (this.listener =
      sceneEl.audioListener || new THREE.AudioListener());
    sceneEl.audioListener = listener;
    this.positionalAudio = new THREE.PositionalAudio(listener);
    this.positionalAudio.setDistanceModel(data.distanceModel);
    this.positionalAudio.setMaxDistance(data.maxDistance);
    this.positionalAudio.setRefDistance(data.refDistance);
    this.positionalAudio.setRolloffFactor(data.rolloffFactor);
    this.positionalAudio.setLoop(data.loop);
    this.positionalAudio.setVolume(data.volume);
    this.group.add(this.positionalAudio);
  },

  /**
   * Calls the hoxel workers with the passed in JSON.
   * @param {*} scvvJSON
   */
  callHoxelWorkers() {
    const { scvvJSON } = this;
    const gotMessage = msg => {
      const { error, dict } = msg.data;
      if (error) {
        console.log("error with ddFrameWorker", error);
        this.badFrames[dict.frame.mesh_path] = dict.frame;
        // throttledLoadHoxel();
        // alert(`error: ${error}`)
      } else if (dict && dict.frame) {
        // Copy over the data from the Object to a proper BufferGeometry
        // NOTE: this is a really annoying side of the Worker, it loses the BufferGeometry object
        this.addFrameBuffer(dict.frame);
      }
    };

    if (this.ddFrameWorkers.length < this.numWorkers) {
      for (var w = 0; w < this.numWorkers; w++) {
        const worker = new LoadSCVVWorker();
        worker.onmessage = gotMessage;
        this.ddFrameWorkers.push(worker);
      }
    }

    this.newFrames = [];
    _.forEach(scvvJSON.frames, frame => {
      // Check to see if we've already got this frame
      if (this.seenFrames[frame.mesh_path] || this.badFrames[frame.mesh_path]) {
        // We don't need to get this frame, we've already seen it
      } else {
        // Delete the frame from the buffer since we don't need it anymore
        this.newFrames.push(frame);
      }
    });
    // Only ever keep the latest 200 buffered frames
    // Now we can get all the unbuffered frames

    scvvJSON.frames = this.newFrames;

    _.forEach(scvvJSON.frames, f => (this.seenFrames[f.mesh_path] = true));
    console.log(`new frames to buffer: ${this.newFrames.length}`);
    console.log(`seenFrames: ${this.seenFrames.length}`);

    // Use multiple download workers so we can download faster
    for (var w = 0; w < this.ddFrameWorkers.length; w++) {
      const worker = this.ddFrameWorkers[w];
      const offset = w;
      worker.postMessage({ scvvJSON, offset, numWorkers: this.numWorkers });
    }
  },

  /**
   * Adds the provided frame to the bufferedFrame array
   * @param {*} frame
   */
  addFrameBuffer(frame) {
    // console.log("addFrameBuffer", frame.mesh_path)
    let geometry = new THREE.BufferGeometry();
    // copy over all the attributes
    for (var prop in frame.mesh_geometry) {
      if (prop == "indices") {
        continue;
      }

      geometry.addAttribute(
        prop,
        new THREE.Float32BufferAttribute(
          frame.mesh_geometry[prop].array,
          frame.mesh_geometry[prop].numComponents
        )
      );
    }
    // And the indices
    geometry.setIndex(
      new THREE.BufferAttribute(frame.mesh_geometry.indices, 1)
    );
    // Fix the orientation for THREE from ScandyCore
    geometry.applyMatrix(this.scandyToThreeMat);
    geometry.computeBoundingSphere();
    // Fix the orientation for THREE from ScandyCore
    frame.mesh_geometry = geometry;
    // Merge all the mesh frames together keeping them in order
    const newBuffered = this.newFrames.slice();
    newBuffered.push(frame);

    // Sort by mesh_  path and only keep the most recent
    let start = 0;
    if (newBuffered.length > this.maxBufferedCount) {
      start = newBuffered.length - this.maxBufferedCount;
    }
    this.newFrames = _.sortBy(newBuffered, ["mesh_path"]).slice(start);
    this.bufferedFrames = this.newFrames.slice();

    if (this.newFrames.length > this.newFrames.length * 0.2) {
      this.startPlayback();
    }
  },

  /**
   * Starts playing back the scvv if its not already
   */
  startPlayback() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      console.log("startPlayback()", this.scvvJSON.HOXEL_URL);
    }
  },

  /**
   * Store the audio buffer for reuse
   */
  getAudioBuffer() {
    const { scvvJSON } = this;
    // Audio context and source global vars
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!audioCtx) {
      console.log("No AudioContext available");
    }

    return new Promise((resolve, reject) => {
      if (this.audioBuffer) {
        resolve(this.audioBuffer);
      } else if (!this.downloadingAudioBuffer) {
        let src = `${scvvJSON.HOXEL_URL}/${scvvJSON.audio}`;
        this.downloadingAudioBuffer = true;
        downloadAudioBuffer(audioCtx, src)
          .then(buffer => {
            this.audioBuffer = buffer;
            resolve(this.audioBuffer);
          })
          .catch(reject)
          .finally(() => {
            this.downloadingAudioBuffer = false;
          });
      }
    });
  },

  /**
   * Starts playing audio given a scvv json file
   * @param {*} scvvJSON the scvvJSON object with SCVV info
   */
  playbackAudio() {
    const { scvvJSON } = this;

    const doPlay = () => {
      this.audioPlaying = true;
      const start_sec = this.vv_frame_ms * 1e-3;
      const offset_msec = scvvJSON.audio_us_offset * 1e-3;
      if (offset_msec > 0) {
        setTimeout(() => {
          this.positionalAudio.play();
        }, offset_msec);
      } else {
        this.positionalAudio.play();
      }
    };

    // Download the audio buffer
    this.getAudioBuffer(scvvJSON).then(buffer => {
      this.positionalAudio.setBuffer(buffer);
      doPlay();
    });
  },

  /**
   * Displays a single scvv frame
   * @param {*} frame
   */
  displaySCVVFrame(frame) {
    if (!!frame.mesh_geometry && !!frame.texture_blob) {
      this.scvvTextureImage.src = frame.texture_blob;
      this.mesh.geometry = frame.mesh_geometry;
      if (!this.mesh.material.map) {
        this.mesh.material.map = this.scvvTexture;
        this.mesh.material.needsUpdate = true;
        this.scvvTexture.needsUpdate = true;
      }
    }
  },

  /**
   * Part of the aframe component lifecycle. Gets called at ~60fps
   * @param {*} time total ms of time
   * @param {*} timeDelta ms since last tick()
   */
  tick(time, timeDelta) {
    this.deltas += timeDelta;
    if (
      this.isPlaying &&
      !!this.bufferedFrames &&
      this.bufferedFrames.length > 0
    ) {
      // Start the audio on the first frame
      if (this.frameIdx == 0 && !this.audioPlaying) {
        this.playbackAudio();
      }
      // const delay_ms = Math.floor(
      //   this.bufferedFrames[this.frameIdx].delay_us * 1e-3
      // ) - 10
      if (this.deltas >= 20) {
        this.displaySCVVFrame(this.bufferedFrames[this.frameIdx]);
        this.vv_frame_ms += this.deltas;
        this.deltas = 0;

        // Check to make sure the requested frameIdx is in the buffer
        if (this.frameIdx < this.bufferedFrames.length - 1) {
          this.frameIdx++;
        } else if (this.data.loop) {
          // Check to see if we need to stop the audio
          if (this.positionalAudio.isPlaying) {
            this.positionalAudio.stop();
            this.audioPlaying = false;
          }
          this.frameIdx = 0;
        }
      }
    }
  }
});
