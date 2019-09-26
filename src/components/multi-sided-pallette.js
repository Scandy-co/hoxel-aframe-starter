AFRAME.registerComponent("multi-sided-pallette", {
  dependencies: ["geometry"],
  init: function() {
    var mesh = this.el.getObject3D("mesh");
    var geom = mesh.geometry;

    for (var i = 0; i < geom.faces.length / 2; i++) {
      var face = document.createElement("a-plane");
      var cube = this.createCube();
      var sphere = this.createSphere();

      // create the inner cube
      face.className = "selectable";
      face.setAttribute("material", "side: double; color: #CCC");
      face.setAttribute("width", 1.5);
      face.setAttribute("height", 1.5);

      // attached elements to each side (will be replaced by stl models of objects)
      if (i % 2) {
        face.appendChild(cube);
      } else {
        face.appendChild(sphere);
      }

      // add listeners
      face.addEventListener("mousedown", this.onMouseDown);
      face.addEventListener("mouseup", this.onMouseUp);
      face.addEventListener("mouseenter", this.onMouseEnter);
      face.addEventListener("mouseleave", this.onMouseLeave);

      // set roration of each face of cube and assign a number in text
      if (i === 0) {
        face.setAttribute("rotation", "-90 " + "0" + " 0");
        face.setAttribute("position", "0 .75 0");
        this.assignFaceNumber(face, i);
      }

      if (i === 1) {
        face.setAttribute("rotation", "180 " + "-90" + " 90");
        face.setAttribute("position", ".75 0 0");
        this.assignFaceNumber(face, i);
      }

      if (i === 2) {
        face.setAttribute("rotation", "90 " + "0" + " 180");
        face.setAttribute("position", "0 -.75 0");
        this.assignFaceNumber(face, i);
      }

      if (i === 3) {
        face.setAttribute("rotation", "180 " + "90" + " -90");
        face.setAttribute("position", "-.75 0 0");
        this.assignFaceNumber(face, i);
      }

      if (i === 4) {
        face.setAttribute("rotation", "0 " + "0" + " 0");
        face.setAttribute("position", "0 0 .75");
        this.assignFaceNumber(face, i);
      }

      if (i === 5) {
        face.setAttribute("rotation", "180 " + "0" + " 0");
        face.setAttribute("position", "0 0 -.75");
        this.assignFaceNumber(face, i);
      }

      this.el.appendChild(face);
    }
  },
  assignFaceNumber: function(face, num) {
    face.setAttribute(
      "text",
      "value: " +
        (num + 1) +
        "; width: 6; height: 2; lineHeight: 2; align: center; wrapCount: 15"
    );
  },
  onMouseEnter: function(e) {
    e.target.isMouseEnter = true;
    e.target.setAttribute("material", "color", "#24CAFF");
    if (e.target.tagName === "A-PLANE") {
      e.target.firstChild.setAttribute("material", "color", "#24CAFF");
    } else {
      e.target.parentNode.setAttribute("material", "color", "#24CAFF");
    }
  },
  onMouseLeave: function(e) {
    e.target.isMouseEnter = false;
    e.target.setAttribute("material", "color", "#CCC");
    if (e.target.tagName === "A-PLANE") {
      e.target.firstChild.setAttribute("material", "color", "#CCC");
    } else {
      e.target.parentNode.setAttribute("material", "color", "#CCC");
    }
  },
  onMouseDown: function(e) {
    e.target.setAttribute("material", "color", "#EF2D5E");
    if (e.target.tagName === "A-PLANE") {
      e.target.firstChild.dispatchEvent(new Event("rotation-pause"));
      e.target.firstChild.setAttribute("material", "color", "#EF2D5E");
    } else {
      e.target.dispatchEvent(new Event("rotation-pause"));
      e.target.parentNode.setAttribute("material", "color", "#EF2D5E");
    }
  },
  onMouseUp: function(e) {
    var type;

    e.target.setAttribute(
      "material",
      "color",
      e.target.isMouseEnter ? "#24CAFF" : "#CCC"
    );

    if (e.target.tagName === "A-PLANE") {
      e.target.firstChild.dispatchEvent(new Event("rotation-resume"));
      e.target.firstChild.setAttribute(
        "material",
        "color",
        e.target.isMouseEnter ? "#24CAFF" : "#CCC"
      );
    } else {
      type = e.target.getAttribute("data-type");
      e.target.dispatchEvent(new Event("rotation-resume"));
      e.target.parentNode.setAttribute(
        "material",
        "color",
        e.target.isMouseEnter ? "#24CAFF" : "#CCC"
      );
    }

    if (type === "cube") {
      spawnCube();
    } else if (type === "sphere") {
      spawnSphere();
    }
  },
  createCube: function() {
    var cube = document.createElement("a-box");
    cube.setAttribute("height", "0.5");
    cube.setAttribute("width", "0.5");
    cube.setAttribute("depth", "0.5");
    cube.setAttribute("position", "0 0 1.25");
    cube.setAttribute("data-type", "cube");
    cube.setAttribute(
      "animation",
      "property: rotation; to: 0 0 360; dur: 5000; easing: linear; loop: true; pauseEvents: rotation-pause; resumeEvents: rotation-resume"
    );
    cube.className = "selectable";
    return cube;
  },
  createSphere: function() {
    var sphere = document.createElement("a-sphere");
    sphere.setAttribute("radius", "0.25");
    sphere.setAttribute("position", "0 0 1.25");
    sphere.setAttribute("data-type", "sphere");
    sphere.setAttribute(
      "animation",
      "property: rotation; to: 0 0 360; dur: 5000; easing: linear; loop: true; pauseEvents: rotation-pause; resumeEvents: rotation-resume"
    );
    sphere.className = "selectable";
    return sphere;
  }
});

function spawnCube() {
  var cube = document.createElement("a-entity");
  var posX = document.querySelector("#camera").object3D.position.x;
  cube.setAttribute("mixin", "cube");
  cube.setAttribute("position", posX + " 1.5 -2");
  document.querySelector("#scene").appendChild(cube);
}

function spawnSphere() {
  var sphere = document.createElement("a-entity");
  var posX = document.querySelector("#camera").object3D.position.x;
  sphere.setAttribute("mixin", "sphere");
  sphere.setAttribute("position", posX + " 5 -2");
  document.querySelector("#scene").appendChild(sphere);
}
