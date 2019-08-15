AFRAME.registerComponent('modify-materials', {
  init: function () {
    // Wait for model to load.
    this.el.addEventListener('model-loaded', () => {
      console.log('hey!')
      // Grab the mesh / scene.
      const obj = this.el.getObject3D('mesh');
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
          if (node.material) {
            let sum = Object.values(node.material.color).reduce((a, b) => a + b, 0)
            if (sum != 3) {
              node.material.color.set('red')
            }
          }
      });
    });
  }
});