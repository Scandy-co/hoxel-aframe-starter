// Create boxes.
AFRAME.registerComponent("boxes", {
  init: function() {
    var box;
    var columns = 20;
    var el = this.el;
    var i;
    var j;
    var rows = 15;
    if (el.sceneEl.isMobile) {
      columns = 10;
      rows = 5;
    }
    for (x = columns / -2; x < columns / 2; x++) {
      for (y = 0.5; y < rows; y++) {
        box = document.createElement("a-entity");
        box.setAttribute("mixin", "box");
        box.setAttribute("position", { x: x * 0.6, y: y * 0.6, z: 1.5 });
        el.appendChild(box);
      }
    }
  }
});
