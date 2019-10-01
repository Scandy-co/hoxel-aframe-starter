AFRAME.registerComponent("collision-detected", {
  init: function() {
    this.originalRotation = this.el.object3D.rotation.y;
    var el = this.el;
    this.el.addEventListener("collisions", function(e) {
      if (e.detail.els && e.detail.els.length) {
        var collider = e.detail.els[0].id;
        var collided = el.id;
        console.log(`${collided} is being hit by ${collider} `);
      }
    });
  }
});
