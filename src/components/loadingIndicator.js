AFRAME.registerComponent("loading-indicator", {
  init: function() {
    setTimeout(function() {
      document
        .querySelector("#loadingIndicator")
        .setAttribute("visible", false);
      document.querySelector("#gameScene").setAttribute("visible", true);
    }, 30000);
  }
});
