AFRAME.registerComponent("multi-sided-pallette", {
  dependencies: ["geometry"],
  init: function() {
    var mesh = this.el.getObject3D("mesh");
    var geom = mesh.geometry;

    for (var i = 0; i < geom.faces.length / 2; i++) {
      var face = document.createElement("a-plane");

      face.className = "palletteSide";
      face.setAttribute("material", "side: double; color: #CCC");
      face.setAttribute("width", 2);
      face.setAttribute("height", 2);

      if (i === 0) {
        face.setAttribute("rotation", "-90 " + "0" + " 0");
        face.setAttribute("position", "0 1 0");
        face.setAttribute(
          "text",
          "value: 1; width: 6; height: 2; lineHeight: 2; align: center; wrapCount: 15"
        );
      }

      if (i === 1) {
        face.setAttribute("rotation", "180 " + "-90" + " 90");
        face.setAttribute("position", "1 0 0");
        face.setAttribute(
          "text",
          "value: 2; width: 6; height: 2; lineHeight: 2; align: center; wrapCount: 15"
        );
      }

      if (i === 2) {
        face.setAttribute("rotation", "90 " + "0" + " 180");
        face.setAttribute("position", "0 -1 0");
        face.setAttribute(
          "text",
          "value: 3; width: 6; height: 2; lineHeight: 2; align: center; wrapCount: 15"
        );
      }

      if (i === 3) {
        face.setAttribute("rotation", "180 " + "90" + " -90");
        face.setAttribute("position", "-1 0 0");
        face.setAttribute(
          "text",
          "value: 4; width: 6; height: 2; lineHeight: 2; align: center; wrapCount: 15"
        );
      }

      if (i === 4) {
        face.setAttribute("rotation", "0 " + "0" + " 0");
        face.setAttribute("position", "0 0 1");
        face.setAttribute(
          "text",
          "value: 5; width: 6; height: 2; lineHeight: 2; align: center; wrapCount: 15"
        );
      }

      if (i === 5) {
        face.setAttribute("rotation", "180 " + "0" + " 0");
        face.setAttribute("position", "0 0 -1");
        face.setAttribute(
          "text",
          "value: 6; width: 6; height: 2; lineHeight: 2; align: center; wrapCount: 15"
        );
      }

      face.addEventListener("mousedown", function(e) {
        e.target.setAttribute("material", "color", "#EF2D5E");
      });

      face.addEventListener("mouseup", function(e) {
        e.target.setAttribute(
          "material",
          "color",
          e.target.isMouseEnter ? "#24CAFF" : "#CCC"
        );
      });

      face.addEventListener("mouseenter", function(e) {
        e.target.setAttribute("material", "color", "#24CAFF");
        e.target.isMouseEnter = true;
      });

      face.addEventListener("mouseleave", function(e) {
        e.target.setAttribute("material", "color", "#CCC");
        e.target.isMouseEnter = false;
      });

      this.el.appendChild(face);
    }
  }
});
