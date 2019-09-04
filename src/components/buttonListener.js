AFRAME.registerComponent("button-listener", {
  init: function() {
    var el = this.el;
    var rotationCount = 1;

    el.addEventListener("triggerdown", function(evt) {
      // var currentRotatison = evt.target.firstElementChild.attributes["rotation"];
      var x = 0;
      var y = 0;
      var z = rotationCount * 90;

      evt.target.firstElementChild.setAttribute(
        "rotation",
        x + " " + y + " " + z
      );
      rotationCount++;
    });
  }
});
