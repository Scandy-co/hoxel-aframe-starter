//color randomizer
AFRAME.registerComponent("color-randomizer", {
  play: function() {
    this.el.addEventListener("drag-drop", function(evt) {
      evt.detail.dropped.setAttribute(
        "material",
        "color",
        "#" + ((Math.random() * 0xffffff) << 0).toString(16)
      );
      // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
    });
  }
});
