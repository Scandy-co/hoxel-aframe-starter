function requireAll (req) { req.keys().forEach(req); }

// Require all components.
requireAll(require.context('./components/', true, /\.js$/));

require('aframe-event-set-component');
require('aframe-particle-system-component');
require('aframe-physics-system');
require('aframe-physics-extras');
require('super-hands');
require('aframe-extras');

const firebase = require('firebase')
// const auth = require('firebase/auth');
// const storage =  require('firebase/firestore');
// const database = require('firebase/database')
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


require('./scene.html');