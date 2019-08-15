function requireAll (req) { req.keys().forEach(req); }

// Require all components.
requireAll(require.context('./components/', true, /\.js$/));

require('aframe-particle-system-component');
require('aframe-event-set-component');
require('aframe-physics-system');
require('super-hands');
require('aframe-extras');

require('./scene.html');