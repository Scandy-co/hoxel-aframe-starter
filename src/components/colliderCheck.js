AFRAME.registerComponent("collider-check", {
  dependencies: ["raycaster"],

  init: function() {
    this.el.addEventListener("raycaster-intersection", function() {
      console.log("Player hit something!");
    });
  }
});
