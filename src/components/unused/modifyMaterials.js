const firebase = require("firebase");

AFRAME.registerComponent("modify-materials", {
  init: function() {
    // Wait for model to load.
    debugger;
    this.el.addEventListener("model-loaded", () => {
      console.log("model loaded");
      // Grab the mesh / scene.
      const obj = this.el.getObject3D("mesh");
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
        // If the node in the one with the texture map, then use that
        if (node.material && node.material.map) {
          var fileRef = firebase
            .database()
            .ref("ZBEq3iXDu7R277BVo6MCFbp6CK13/photos");
          fileRef.once("value", function(snapshot) {
            const files = snapshot.val();
            // console.log(files)
            let list = Object.values(files);
            list.map((file, i) => {
              let textureLoader = new THREE.TextureLoader();
              textureLoader.crossOrigin = "Anonymous";
              textureLoader.load(
                file.downloadURL,
                texture => {
                  node.material.map = texture;
                  texture.onload = () => {
                    texture.needsUpdate = true;
                  };
                },
                event => {
                  // console.log('load event: ', event)
                },
                event => {
                  // console.log('error loading', event)
                  // node.material.color.set('red')
                }
              );
            });
          });
          // }
        }
      });
    });
  }
});
