
// Define custom schema for syncing avatar color, set by random-color
NAF.schemas.add({
  template: "#head-template",
  components: [
    "position",
    "rotation",
    {
      selector: ".head",
      component: "material"
    }
  ]
});
NAF.schemas.add({
  template: "#player-template",
  components: ["position", "rotation"]
});
NAF.schemas.add({
  template: "#hand-template",
  components: ["position", "rotation"]
});
// Called by Networked-Aframe when connected to server
function onConnect() {
  console.log("onConnect");
}