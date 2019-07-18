/* eslint-disable no-undef */
/* eslint-disable no-redeclare */

const firebase = require('firebase')
const auth = require('firebase/auth');
const storage =  require('firebase/firestore');
const database = require('firebase/database')

const obj =  require('../public/cassete/CasseteTape.obj')
const mtl =  require('../public/cassete/CasseteTape.mtl')
const png = require('../public/cassete/CasseteTape_BaseColor.png')

require('aframe')
require('aframe-physics-system')
require('aframe-teleport-controls')
const _ = require('lodash');

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCW2AbQkdg8SEBJeSTo_D0MlWaUuG6teD4",
  authDomain: "hoxel-xr.firebaseapp.com",
  databaseURL: "https://hoxel-xr.firebaseio.com",
  projectId: "hoxel-xr",
  storageBucket: "hoxel-xr.appspot.com",
  messagingSenderId: "408632776811",
  appId: "1:408632776811:web:edccebf388ca30f3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// var fileRef = firebase.database().ref('ZBEq3iXDu7R277BVo6MCFbp6CK13/photos');
// fileRef.on('value', function(snapshot) {
//   const files = snapshot.val()
//   console.log(files)
//   let scene = document.getElementsByTagName('a-scene')[0]
//   let list = Object.values(files)
//   list.map((file, i) => {
//     let box = document.createElement('a-obj-model')
//     box.setAttribute('position', `-1 0.5 ${i * -3}`)
//     box.setAttribute('rotation', `0 ${i * 5} 0`)
//     box.setAttribute('color', '#ffffff')
//     box.setAttribute('scale', '0.2 0.2 0.2')
//     box.setAttribute('src', '#cassette-obj')
//     box.setAttribute('mtl', '#cassette-mtl')
    
//     scene.appendChild(box)
//   })

// });

const LoadSCVVWorker = require('worker-loader!./LoadSCVVWorker.min');
const { playbackFrames, setBufferedFrames, setThreeScene, scvvMesh } = require('./scvvPlayback');
const {downloadBin} = require('./utils');
// Firebase App (the core Firebase SDK) is always required and must be listed first
// Add the Firebase products that you want to use

const ddFrameWorkers = [];
let newFrames = [];
let bufferedFrames = [];
const badFrames = [];
const seenFrames = [];
const numWorkers = 1;
const maxBufferedCount = 500;

const scandyToThreeMat = new THREE.Matrix4()
scandyToThreeMat.set(
  -0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  0.0,
  0.0,
  1
)

let playbackStarted = false
const startPlayback = () => {
  if( !playbackStarted ){
    playbackStarted = true
    console.log('playbackFrames(0)')
    playbackFrames(0)
  }
}

/**
 * Adds the provided frame to the bufferedFrame array
 * @param {*} frame
 */
const addFrameBuffer = (frame) => {
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
  geometry.setIndex(new THREE.BufferAttribute(frame.mesh_geometry.indices, 1))
  // Fix the orientation for THREE from ScandyCore
  geometry.applyMatrix(scandyToThreeMat)
  // Fix the orientation for THREE from ScandyCore
  frame.mesh_geometry = geometry;
  // Merge all the mesh frames together keeping them in order
  const newBuffered = bufferedFrames.slice();
  newBuffered.push(frame);

  // Sort by mesh_  path and only keep the most recent
  let start = 0;
  if (newBuffered.length > maxBufferedCount) {
    start = newBuffered.length - maxBufferedCount;
  }
  bufferedFrames = _.sortBy(newBuffered, ['mesh_path']).slice(start);
  setBufferedFrames(bufferedFrames)

  if( bufferedFrames.length > newFrames.length * 0.2 ){
    startPlayback()
  }
};

/**
 * Calls the hoxel workers with the passed in JSON.
 * @param {*} scvvJSON
 */
const callHoxelWorkers = (scvvJSON) => {
  const gotMessage = (msg) => {
    const { error, dict } = msg.data;
    if (error) {
      console.log('error with ddFrameWorker', error);
      badFrames[dict.frame.mesh_path] = dict.frame;
      // throttledLoadHoxel();
      // alert(`error: ${error}`)
    } else if (dict && dict.frame) {
      // Copy over the data from the Object to a proper BufferGeometry
      // NOTE: this is a really annoying side of the Worker, it loses the BufferGeometry object
      addFrameBuffer(dict.frame);
    }
  };

  if (ddFrameWorkers.length < numWorkers) {
    for (var w = 0; w < numWorkers; w++) {
      const worker = new LoadSCVVWorker();
      worker.onmessage = gotMessage;
      ddFrameWorkers.push(worker);
    }
  }

  newFrames = [];
  _.forEach(scvvJSON.frames, (frame) => {
    // Check to see if we've already got this frame
    if (seenFrames[frame.mesh_path] || badFrames[frame.mesh_path]) {
      // We don't need to get this frame, we've already seen it
    } else {
      // Delete the frame from the buffer since we don't need it anymore
      newFrames.push(frame);
    }
  });
  // Only ever keep the latest 200 buffered frames
  // Now we can get all the unbuffered frames
  scvvJSON.frames = newFrames;

  _.forEach(scvvJSON.frames, f => (seenFrames[f.mesh_path] = true));
  // console.log(`new frames to buffer: ${newFrames.length}`)
  // console.log(`seenFrames: ${seenFrames.length}`)

  // Use multiple download workers so we can download faster
  for (var w = 0; w < ddFrameWorkers.length; w++) {
    const worker = ddFrameWorkers[w];
    const offset = w;
    worker.postMessage({ scvvJSON, offset, numWorkers });
  }
};


AFRAME.registerComponent('scvv', {
  init() {
    
    console.log('init scvv')
    const scene = document.querySelector('a-entity').sceneEl.object3D;
    setThreeScene(scene)
    
    const group = document.querySelector('a-entity').object3D;
    group.add(scvvMesh)
    
    downloadBin('/hoxelCardHelloWorld/scvv_animation.json', 'json').then((json) => {
      const scvvJSON = {
        HOXEL_URL: '/hoxelCardHelloWorld',
        ...json,
      };
      callHoxelWorkers(scvvJSON);
    });
  },
});

