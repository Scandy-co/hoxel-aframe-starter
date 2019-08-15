// AFRAME first!
require('aframe');

require('aframe-event-set-component');
require('aframe-particle-system-component');
require('aframe-physics-system');
require('aframe-physics-extras');
require('super-hands');
require('aframe-extras');

function requireAll (req) { req.keys().forEach(req); }

// Require all components.
requireAll(require.context('./components/', true, /\.js$/));

require('./firebase');

require('./scene.html');