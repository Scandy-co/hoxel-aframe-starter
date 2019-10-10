// AFRAME first!
require("aframe");
require("aframe-physics-system");
require("aframe-physics-extras");
require("super-hands");
require("aframe-state-component");

function requireAll(req) {
  req.keys().forEach(req);
}

// Require all components.
requireAll(require.context("./components/", true, /\.js$/));

// Bring in the scene.  Modify this file or create a new html file and link here.
require("./scene.html");

window.addEventListener("load", function() {
  console.log("All assets are loaded");
});
