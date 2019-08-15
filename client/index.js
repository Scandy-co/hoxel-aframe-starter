/* eslint-disable no-undef */
/* eslint-disable no-redeclare */

// const firebase = require('firebase')
// const auth = require('firebase/auth');
// const storage =  require('firebase/firestore');
// const database = require('firebase/database')

function requireAll (req) { req.keys().forEach(req); }
requireAll(require.context('./components/', true, /\.js$/));

require('aframe-physics-system')
require('aframe-state-component')
require('aframe-particle-system-component');
require('aframe-extras')

require('./scene.html');

const LoadSCVVWorker = require('worker-loader!./LoadSCVVWorker.min');
const { playbackFrames, setBufferedFrames, setThreeScene, scvvMesh } = require('./scvvPlayback');
const {downloadBin} = require('./utils');

// const _ = require('lodash');

// Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyCW2AbQkdg8SEBJeSTo_D0MlWaUuG6teD4",
//   authDomain: "hoxel-xr.firebaseapp.com",
//   databaseURL: "https://hoxel-xr.firebaseio.com",
//   projectId: "hoxel-xr",
//   storageBucket: "hoxel-xr.appspot.com",
//   messagingSenderId: "408632776811",
//   appId: "1:408632776811:web:edccebf388ca30f3"
// };
// Initialize Firebase

// firebase.initializeApp(firebaseConfig);

// Firebase App (the core Firebase SDK) is always required and must be listed first
// Add the Firebase products that you want to use


AFRAME.registerComponent("modify-materials", {
  init: function() {
    // Wait for model to load.
    this.el.addEventListener("model-loaded", () => {
      // Grab the mesh / scene.
      const obj = this.el.getObject3D("mesh");
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
        if (node.material && node.material.name == 'mat23') {
          debugger
            var fileRef = firebase.database().ref('ZBEq3iXDu7R277BVo6MCFbp6CK13/photos');
            fileRef.once('value', function(snapshot) {
              const files = snapshot.val()
              console.log(files)
              let list = Object.values(files)
              list.map((file, i) => {
                let textureLoader = new THREE.TextureLoader()
                textureLoader.crossOrigin = "Anonymous"
                const myTexture = textureLoader.load(file.downloadURL)
                node.material.map = myTexture
                // node.material.color.set("red");
                // let box = document.createElement('a-image')
                // box.setAttribute('position', `-1 0.5 ${i * -1}`)
                // box.setAttribute('rotation', `0 ${i * 5} 0`)
                // box.setAttribute('mixin', `cube`)
                // box.setAttribute('color', '#ffffff')
                // console.log(file)box.setAttribute('src', `src: url(${file.downloadURL});`)
                // box.setAttribute('sound', `src: url(${file.downloadURL}});`)
                // box.setAttribute('src', `${file.downloadURL}.jpg`)
                // box.setAttribute('type', "audio/caf")
                // box.setAttribute('autoplay', `true`)

                // box.setAttribute

                // box.setAttribute('scale', '0.2 0.2 0.2')
                // box.setAttribute('src', '#cassette-obj')
                // box.setAttribute('mtl', '#cassette-mtl')    
                // scene.appendChild(box)
              })
            });
          }
      });
    });
  }
});