// AFRAME first!
require("aframe");

require("aframe-event-set-component");
require("aframe-particle-system-component");
require("aframe-physics-system");
require("aframe-physics-extras");
require("super-hands");
require("aframe-extras");

function requireAll(req) {
  req.keys().forEach(req);
}

// Require all components.
requireAll(require.context("./components/", true, /\.js$/));

require("./firebase");
// require('./scene.html');
require("./scene_ng.html");

window.addEventListener("load", function() {
  console.log("All assets are loaded");
  // var leftHand = document.getElementById("lhand");
  // var rightHand = document.getElementById("rhand");
  // leftHand.addEventListener("collide", function(e) {
  //   console.log("Left hand has collided with body #" + e.detail.body.id);

  //   e.detail.target.el; // Original entity (playerEl).
  //   e.detail.body.el; // Other entity, which playerEl touched.
  //   e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
  //   e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
  // });

  // rightHand.addEventListener("collide", function(e) {
  //   console.log("Right hand has collided with body #" + e.detail.body.id);

  //   e.detail.target.el; // Original entity (playerEl).
  //   e.detail.body.el; // Other entity, which playerEl touched.
  //   e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
  //   e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
  // });
});
