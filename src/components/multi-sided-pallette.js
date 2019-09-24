var clonedNode;

AFRAME.registerComponent("multi-sided-pallette", {
  dependencies: ["geometry"],
  init: function() {
    var mesh = this.el.getObject3D("mesh");
    var geom = mesh.geometry;

    for (var i = 0; i < geom.faces.length / 2; i++) {
      var face = document.createElement("a-plane");
      var cone = this.createCone();
      // var cube = this.createCube();

      // create the inner cube
      face.className = "selectable";
      face.setAttribute("material", "side: double; color: #CCC");
      face.setAttribute("width", 1.5);
      face.setAttribute("height", 1.5);

      // attached elements to each side (will be replaced by stl models of objects)
      face.appendChild(cone);

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
      clonedNode = e.target.firstChild.cloneNode(true);
    } else {
      e.target.dispatchEvent(new Event("rotation-pause"));
      e.target.parentNode.setAttribute("material", "color", "#EF2D5E");
      clonedNode = e.target.cloneNode(true);
    }
    transferObject();
  },
  onMouseUp: function(e) {
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
      e.target.dispatchEvent(new Event("rotation-resume"));
      e.target.parentNode.setAttribute(
        "material",
        "color",
        e.target.isMouseEnter ? "#24CAFF" : "#CCC"
      );
    }
    releaseObject();
  },
  createCone: function() {
    var cone = document.createElement("a-cone");
    cone.setAttribute("radius-bottom", "0.25");
    cone.setAttribute("radius-top", "0");
    cone.setAttribute("height", "1.5");
    cone.setAttribute("position", "0 0 1.5");
    cone.setAttribute(
      "animation",
      "property: rotation; to: 0 0 360; dur: 5000; easing: linear; loop: true; pauseEvents: rotation-pause; resumeEvents: rotation-resume"
    );
    cone.className = "selectable";
    return cone;
  }
  // createCube: function() {
  //   var cube = document.createElement("a-entity");
  //   cube.setAttribute("mixin", "cube");
  //   cube.setAttribute("position", "0 0 1.0");
  //   cube.setAttribute(
  //     "animation",
  //     "property: rotation; to: 0 0 360; dur: 5000; easing: linear; loop: true; pauseEvents: rotation-pause; resumeEvents: rotation-resume"
  //   );
  //   cube.classList.add("cube");
  //   cube.classList.add("selectable");
  //   return cube;
  // }
});

function transferObject() {
  clonedNode.setAttribute("radius-bottom", "0.1");
  clonedNode.setAttribute("radius-top", "0");
  clonedNode.setAttribute("height", ".5");
  clonedNode.setAttribute("grabbable");
  clonedNode.setAttribute("draggable");
  clonedNode.setAttribute("hoverable");
  clonedNode.setAttribute("shadow");
  document.querySelector("#rHand").appendChild(clonedNode);
}

function releaseObject() {
  clonedNode.setAttribute("body", { type: "dynamic" });
}
