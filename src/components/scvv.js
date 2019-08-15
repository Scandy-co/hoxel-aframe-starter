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
    const {
      playbackFrames,
      setBufferedFrames,
      setThreeScene,
      setSCVVMesh,
    } = require('./scvvPlayback')

    const HOXEL_URL = this.data.scvvUrl
    console.log(`init scvv: ${HOXEL_URL}`)
    var data = this.data;
    var el = this.el;
    const scene = document.querySelector('a-entity').sceneEl.object3D
    setThreeScene(scene)
    const group = document.getElementById('my-file').object3D
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    el.setObject3D('mesh', this.mesh);
    this.mesh.scale.set(5, 5, 5)
    setSCVVMesh(this.mesh)

    let ddFrameWorkers = []
    let newFrames = []
    let bufferedFrames = []
    let badFrames = []
    let seenFrames = []
    let numWorkers = 2
    let maxBufferedCount = 500
    let scandyToThreeMat = new THREE.Matrix4()
    let playbackStarted = false

    this.startPlayback = () => {
      if (!playbackStarted) {
        playbackStarted = true
        console.log('playbackFrames(0)', this.scvvJSON.HOXEL_URL)
        playbackFrames(0)
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
      geometry.applyMatrix(scandyToThreeMat)
      // Fix the orientation for THREE from ScandyCore
      frame.mesh_geometry = geometry
      // Merge all the mesh frames together keeping them in order
      const newBuffered = bufferedFrames.slice()
      newBuffered.push(frame)

      // Sort by mesh_  path and only keep the most recent
      let start = 0
      if (newBuffered.length > maxBufferedCount) {
        start = newBuffered.length - maxBufferedCount
      }
      bufferedFrames = _.sortBy(newBuffered, ['mesh_path']).slice(start)
      setBufferedFrames(bufferedFrames)

      if (bufferedFrames.length > newFrames.length * 0.2) {
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
          badFrames[dict.frame.mesh_path] = dict.frame
          // throttledLoadHoxel();
          // alert(`error: ${error}`)
        } else if (dict && dict.frame) {
          // Copy over the data from the Object to a proper BufferGeometry
          // NOTE: this is a really annoying side of the Worker, it loses the BufferGeometry object
          this.addFrameBuffer(dict.frame)
        }
      }

      if (ddFrameWorkers.length < numWorkers) {
        for (var w = 0; w < numWorkers; w++) {
          const worker = new LoadSCVVWorker()
          worker.onmessage = gotMessage
          ddFrameWorkers.push(worker)
        }
      }

      newFrames = []
      _.forEach(scvvJSON.frames, frame => {
        // Check to see if we've already got this frame
        if (seenFrames[frame.mesh_path] || badFrames[frame.mesh_path]) {
          // We don't need to get this frame, we've already seen it
        } else {
          // Delete the frame from the buffer since we don't need it anymore
          newFrames.push(frame)
        }
      })
      // Only ever keep the latest 200 buffered frames
      // Now we can get all the unbuffered frames

      scvvJSON.frames = newFrames

      _.forEach(scvvJSON.frames, f => (seenFrames[f.mesh_path] = true))
      console.log(`new frames to buffer: ${newFrames.length}`)
      console.log(`seenFrames: ${seenFrames.length}`)

      // Use multiple download workers so we can download faster
      for (var w = 0; w < ddFrameWorkers.length; w++) {
        const worker = ddFrameWorkers[w]
        const offset = w
        worker.postMessage({ scvvJSON, offset, numWorkers })
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
  }
})
