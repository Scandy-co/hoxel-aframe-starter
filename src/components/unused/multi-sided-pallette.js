AFRAME.registerComponent("multi-sided-pallette", {
  dependencies: ["geometry"],
  init: function() {
    var mesh = this.el.getObject3D("mesh");
    var geom = mesh.geometry;

    for (var i = 0; i < geom.faces.length / 2; i++) {
      var face = document.createElement("a-plane");
      var club = this.createClub();
      var sphere = this.createSphere();

      // create the inner cube
      face.className = "selectable";
      face.setAttribute("material", "side: double; color: #CCC");
      face.setAttribute("width", 1.5);
      face.setAttribute("height", 1.5);

      // attached elements to each side (will be replaced by stl models of objects)
      if (i % 2) {
        face.appendChild(club);
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
      type = e.target.firstChild.getAttribute("data-type");
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

    if (type === "club") {
      spawnClub();
    } else if (type === "sphere") {
      spawnSphere();
    }
  },
  createClub: function() {
    var club = document.createElement("a-box");
    club.setAttribute("height", "1.2");
    club.setAttribute("width", "0.1");
    club.setAttribute("depth", "0.1");
    club.setAttribute("position", "0 0 1.25");
    club.setAttribute("data-type", "club");
    club.setAttribute(
      "animation",
      "property: rotation; to: 0 0 360; dur: 5000; easing: linear; loop: true; pauseEvents: rotation-pause; resumeEvents: rotation-resume"
    );
    club.className = "selectable";
    return club;
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

function spawnSphere() {
  var sphere = document.createElement("a-entity");
  sphere.setAttribute("mixin", "sphere");
  sphere.setAttribute("position", -1.5 + " 2 0");
  document.querySelector("#scene").appendChild(sphere);
}

function spawnClub() {
  var cylinder = document.createElement("a-entity");
  cylinder.setAttribute("mixin", "club");
  cylinder.setAttribute("rotation", "-20 0 0");
  cylinder.setAttribute("position", -1.5 + " 2 0");
  document.querySelector("#scene").appendChild(cylinder);
}
