AFRAME.registerComponent("hydro-motion", {
  schema: {
    isMoving: { default: false },
    direction: { default: "up" },
    valueY: { default: 0 }
  },
  init: function() {
    this.originalRotation = this.el.object3D.rotation.y;
  },

  remove: function() {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function() {
    var data = this.data;

    if (!data.isMoving && Math.random() > 0.9) {
      data.isMoving = true;
      if (Math.random() > 0.75) {
        this.el.setAttribute("visible", "true");
      } else {
        this.el.setAttribute("visible", "false");
      }
    } else if (data.isMoving) {
      if (data.direction === "up") {
        data.valueY += 0.04;
        this.el.object3D.position.y = data.valueY;
        if (data.valueY.toFixed(2) <= 0.8 && data.valueY.toFixed(2) >= 0.7) {
          data.direction = "down";
        }
      } else if (data.direction === "down") {
        data.valueY -= 0.01;
        this.el.object3D.position.y = data.valueY;
        if (data.valueY.toFixed(2) >= 0 && data.valueY.toFixed(2) <= 0.15) {
          data.direction = "up";
          data.isMoving = false;
        }
      }
    }
  }
});
