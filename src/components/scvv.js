/* global AFRAME, THREE */
const _ = require('lodash')
const LoadSCVVWorker = require('worker-loader!../workers/LoadSCVVWorker.min')
const { downloadBin } = require('./utils')
// Firebase App (the core Firebase SDK) is always required and must be listed first
// Add the Firebase products that you want to use

AFRAME.registerComponent('scvv', {
  schema: {
    scvvUrl: {
      type: 'string',
      default:
        'https://hoxel-streamed-001.s3.amazonaws.com/shrimp_boots/scvv_0-1-0_test_003'
    }
  },

  multiple: true,

  init() {
    this.ddFrameWorkers = []
    this.newFrames = []
    this.bufferedFrames = []
    this.badFrames = []
    this.seenFrames = []
    this.numWorkers = 2
    this.maxBufferedCount = 500
    this.scandyToThreeMat = new THREE.Matrix4()
    this.playbackStarted = false
    this.frameIdx = 0
    this.deltas = 0

    const HOXEL_URL = this.data.scvvUrl
    console.log(`init scvv: ${HOXEL_URL}`)
    var data = this.data
    var el = this.el

    // THREEJS objects to playback the SCVV frames
    this.scvvTextureImage = new Image()
    this.scvvTexture = new THREE.Texture(this.scvvTextureImage)
    // this.scvvTexture = new THREE.Texture()
    // Bind the onload of the image to always update the texture
    this.scvvTextureImage.onload = () => {
      this.scvvTexture.needsUpdate = true
    }
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      // color: 0x00ff00,
      opacity: 0.92,
      transparent: true,
      // map: this.scvvTexture,
      side: THREE.DoubleSide,
    })
    this.geometry = new THREE.BufferGeometry()
    this.mesh = el.getObject3D('mesh')
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    el.setObject3D('mesh', this.mesh)

    this.startPlayback = () => {
      if (!this.playbackStarted) {
        this.playbackStarted = true
        console.log('playbackFrames(0)', this.scvvJSON.HOXEL_URL)
        // playbackFrames(0)
      }
    }

    /**
     * Adds the provided frame to the bufferedFrame array
     * @param {*} frame
     */
    this.addFrameBuffer = frame => {
      // console.log("addFrameBuffer", frame.mesh_path)
      let geometry = new THREE.BufferGeometry()
      // copy over all the attributes
      for (var prop in frame.mesh_geometry) {
        if (prop == 'indices') {
          continue
        }

        geometry.addAttribute(
          prop,
          new THREE.Float32BufferAttribute(
            frame.mesh_geometry[prop].array,
            frame.mesh_geometry[prop].numComponents
          )
        )
      }
      // And the indices
      geometry.setIndex(
        new THREE.BufferAttribute(frame.mesh_geometry.indices, 1)
      )
      // Fix the orientation for THREE from ScandyCore
      geometry.applyMatrix(this.scandyToThreeMat)
      geometry.computeBoundingSphere()
      // Fix the orientation for THREE from ScandyCore
      frame.mesh_geometry = geometry
      // Merge all the mesh frames together keeping them in order
      const newBuffered = this.newFrames.slice()
      newBuffered.push(frame)

      // Sort by mesh_  path and only keep the most recent
      let start = 0
      if (newBuffered.length > this.maxBufferedCount) {
        start = newBuffered.length - this.maxBufferedCount
      }
      this.newFrames = _.sortBy(newBuffered, ['mesh_path']).slice(start)
      this.bufferedFrames = this.newFrames.slice()

      if (this.newFrames.length > this.newFrames.length * 0.2) {
        this.startPlayback()
      }
    }

    /**
     * Calls the hoxel workers with the passed in JSON.
     * @param {*} scvvJSON
     */
    this.callHoxelWorkers = scvvJSON => {
      const gotMessage = msg => {
        const { error, dict } = msg.data
        if (error) {
          console.log('error with ddFrameWorker', error)
          this.badFrames[dict.frame.mesh_path] = dict.frame
          // throttledLoadHoxel();
          // alert(`error: ${error}`)
        } else if (dict && dict.frame) {
          // Copy over the data from the Object to a proper BufferGeometry
          // NOTE: this is a really annoying side of the Worker, it loses the BufferGeometry object
          this.addFrameBuffer(dict.frame)
        }
      }

      if (this.ddFrameWorkers.length < this.numWorkers) {
        for (var w = 0; w < this.numWorkers; w++) {
          const worker = new LoadSCVVWorker()
          worker.onmessage = gotMessage
          this.ddFrameWorkers.push(worker)
        }
      }

      this.newFrames = []
      _.forEach(scvvJSON.frames, frame => {
        // Check to see if we've already got this frame
        if (
          this.seenFrames[frame.mesh_path] ||
          this.badFrames[frame.mesh_path]
        ) {
          // We don't need to get this frame, we've already seen it
        } else {
          // Delete the frame from the buffer since we don't need it anymore
          this.newFrames.push(frame)
        }
      })
      // Only ever keep the latest 200 buffered frames
      // Now we can get all the unbuffered frames

      scvvJSON.frames = this.newFrames

      _.forEach(scvvJSON.frames, f => (this.seenFrames[f.mesh_path] = true))
      console.log(`new frames to buffer: ${this.newFrames.length}`)
      console.log(`seenFrames: ${this.seenFrames.length}`)

      // Use multiple download workers so we can download faster
      for (var w = 0; w < this.ddFrameWorkers.length; w++) {
        const worker = this.ddFrameWorkers[w]
        const offset = w
        worker.postMessage({ scvvJSON, offset, numWorkers: this.numWorkers })
      }
    }

    this.displaySCVVFrame = frame => {
      if (!!frame.mesh_geometry && !!frame.texture_blob) {
        this.mesh.geometry = frame.mesh_geometry
        if( !this.mesh.material.map ) {
          this.mesh.material.map = this.scvvTexture
          this.scvvTexture.needsUpdate = true
          this.mesh.material.map.needsUpdate = true
        }
        this.scvvTextureImage.src = frame.texture_blob
      }
    }

    // Download the scvv json to get this party started
    downloadBin(`${HOXEL_URL}/scvv.json`, 'json')
      .then(json => {
        this.scvvJSON = {
          HOXEL_URL,
          ...json
        }
        this.callHoxelWorkers(this.scvvJSON)
      })
      .catch(err => {
        console.log('error downloading json', err)
      })
  },

  update() {
    // console.log('updating')
  },

  remove() {
    // console.log('removing')
    this.el.removeObject3D('mesh');
    this.mesh = null
    this.geometry = null
    this.material = null
    this.bufferedFrames = []
  },

  tick(time, timeDelta) {
    this.deltas += timeDelta
    if (!!this.bufferedFrames && this.bufferedFrames.length > 0) {
      // const delay_ms = Math.floor(
      //   this.bufferedFrames[this.frameIdx].delay_us * 1e-3
      // ) - 10
      if (this.deltas >= 20) {
        this.displaySCVVFrame(this.bufferedFrames[this.frameIdx])
        this.deltas = 0

        // Check to make sure the requested frameIdx is in the buffer
        if (this.frameIdx < this.bufferedFrames.length - 1) {
          this.frameIdx++
        } else {
          this.frameIdx = 0
        }
      }
    }
  }
})
