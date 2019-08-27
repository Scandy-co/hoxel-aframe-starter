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
        face.setAttribute("rotation", "0 " + "0" + " 0");
        face.setAttribute("position", "0 0 1");
      }

      if (i === 1) {
        face.setAttribute("rotation", "0 " + "90" + " 0");
        face.setAttribute("position", "-1 0 0");
      }

      if (i === 2) {
        face.setAttribute("rotation", "0 " + "-90" + " 0");
        face.setAttribute("position", "1 0 0");
      }

      if (i === 3) {
        face.setAttribute("rotation", "0 " + "0" + " 0");
        face.setAttribute("position", "0 0 -1");
      }

      if (i === 4) {
        face.setAttribute("rotation", "90 " + "0" + " 0");
        face.setAttribute("position", "0 1 0");
      }

      if (i === 5) {
        face.setAttribute("rotation", "-90 " + "0" + " 0");
        face.setAttribute("position", "0 -1 0");
      }

      face.addEventListener("mousedown", function(e) {
        e.target.setAttribute("material", "color", "#EF2D5E");
      });

      face.addEventListener("mouseup", function(e) {
        face.setAttribute(
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
        e.target.isMouseEnter = true;
      });

      this.el.appendChild(face);
    }
  }
});
