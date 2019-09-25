AFRAME.registerComponent("rotation-reader", {
  schema: {
    y: { type: "number", default: 0 }
  },
  tick: function() {
    // `this.el` is the element.
    // `object3D` is the three.js object.
    // `rotation` is a three.js Euler using radians. `quaternion` also available.
    // console.log(this.el.object3D.rotation._y);
    // this.data.y.value = this.el.object3D.rotation._y;
    // `position` is a three.js Vector3.
    // console.log(this.el.object3D.position);
  }
});
