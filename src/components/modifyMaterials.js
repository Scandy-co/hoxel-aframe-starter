const firebase = require('firebase')

AFRAME.registerComponent('modify-materials', {
  init: function() {
    // Wait for model to load.
    this.el.addEventListener('model-loaded', () => {
      // Grab the mesh / scene.
      const obj = this.el.getObject3D('mesh')
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
        if (node.material) {
          let sum = Object.values(node.material.color).reduce(
            (a, b) => a + b,
            0
          )
          if (sum != 3) {
            node.material.color.set('blue')
            var fileRef = firebase
              .database()
              .ref('ZBEq3iXDu7R277BVo6MCFbp6CK13/photos')
            fileRef.once('value', function(snapshot) {
              const files = snapshot.val()
              console.log(files)
              let list = Object.values(files)
              list.map((file, i) => {
                let textureLoader = new THREE.TextureLoader()
                textureLoader.crossOrigin = 'Anonymous'
                textureLoader.load(
                  file.downloadURL,
                  texture => {
                    console.log('loaded texture: ', texture)
                    // debugger
                    // node.material.color.set('green')
                    node.material = new THREE.MeshBasicMaterial({
                      color: 0xffffff,
                      // opacity: 0.92,
                      // transparent: true,
                      // map: texture,
                      side: THREE.DoubleSide,
                    })
                    node.material.map = texture
                    texture.onload = () => {
                      texture.needsUpdate = true
                    }
                  },
                  event => {
                    console.log('load event: ', event)
                  },
                  event => {
                    console.log('error loading', event)
                    node.material.color.set('red')
                  }
                )
              })
            })
          }
        }
      })
    })
  }
})
