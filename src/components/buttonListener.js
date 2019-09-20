AFRAME.registerComponent("button-listener", {
  init: function() {
    var el = this.el;
    var rotationCountX = 1;
    var rotationY = 1;
    var x = 0;
    var y = 0;
    var z = 0;

    // 90 = right
    // -90 = left
    var directionDeg;
    var directionDegUD;
    var direction;

    el.addEventListener("axismove", function(evt) {
      console.log(evt.detail.axis);

      var thumbStickDirectionX = evt.detail.axis[0];
      var thumbStickDirectionY = evt.detail.axis[1];
      var thumbStickHasStopped =
        thumbStickDirectionX === 0 && thumbStickDirectionY === 0;

      // retrieve last active X + Y directional data from
      // thumbstick controls

      // LEFT Rotation === 0.75 > x < 1.00
      // RIGHT Rotation ===  -1.0 > x < -0.75
      // UP Rotation  ===
      // Down Rotation ===

      if (!thumbStickHasStopped) {
        if (thumbStickDirectionX > 0.75 && thumbStickDirectionX < 1) {
          direction = "right";
          directionDeg = -90;
        } else if (thumbStickDirectionX < -0.75 && thumbStickDirectionX > -1) {
          direction = "left";
          directionDeg = 90;
        } else if (thumbStickDirectionY < -0.75 && thumbStickDirectionY > -1) {
          direction = "up";
          directionDegUD = -90;
        } else if (thumbStickDirectionY > 0.75 && thumbStickDirectionY < 1) {
          direction = "down";
          directionDegUD = 90;
        }
      }

      if (
        thumbStickHasStopped &&
        (direction === "left" || direction === "right")
      ) {
        var currentZ = evt.target.firstElementChild.getAttribute("rotation").z;
        z = directionDeg + currentZ;

        evt.target.firstElementChild.setAttribute(
          "animation",
          "property: rotation; to: " +
            x +
            " " +
            y +
            " " +
            z +
            "; loop: false; dur: 100"
        );

        rotationCountX++;
      } else if (
        thumbStickHasStopped &&
        (direction === "up" || direction === "down")
      ) {
        var currentY = evt.target.firstElementChild.getAttribute("rotation").x;
        x = directionDegUD + currentY;

        evt.target.firstElementChild.setAttribute(
          "animation",
          "property: rotation; to: " +
            x +
            " " +
            y +
            " " +
            z +
            "; loop: false; dur: 100"
        );

        rotationCountY++;
      }
    });
  }
});
