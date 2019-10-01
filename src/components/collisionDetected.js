AFRAME.registerComponent("collision-detected", {
  init: function() {
    this.originalRotation = this.el.object3D.rotation.y;
    let el = this.el;
    this.el.addEventListener("collisions", function(e) {
      if (e.detail.els && e.detail.els.length) {
        let collider = e.detail.els[0].id;
        let collided = el.id;
        if (el.parentEl.getAttribute("ishittable")) {
          console.log(`${collided} is being hit by ${collider} `);
          AFRAME.scenes[0].emit("increaseScore", { points: 1 });
        }
      }
    });
  }
});
