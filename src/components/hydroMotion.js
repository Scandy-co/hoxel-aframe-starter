AFRAME.registerComponent("hydro-motion", {
  schema: {
    isMoving: { default: false },
    direction: { default: "up" },
    valueY: { default: 1 }
  },
  init: function() {
    this.originalRotation = this.el.object3D.rotation.y;
  },

  remove: function() {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function() {
    var data = this.data;

    if (!data.isMoving && Math.random() > 0.995) {
      data.isMoving = true;
    } else if (data.isMoving) {
      if (data.direction === "up") {
        data.valueY += 0.02;
        this.el.object3D.position.y = data.valueY;
        if (data.valueY.toFixed(2) <= 1.15 && data.valueY.toFixed(2) >= 1.1) {
          data.direction = "down";
        }
      } else if (data.direction === "down") {
        data.valueY -= 0.02;
        this.el.object3D.position.y = data.valueY;
        if (data.valueY.toFixed(2) >= -0.1 && data.valueY.toFixed(2) <= 0) {
          data.direction = "up";
          data.isMoving = false;
        }
      }
    }
  }
});
