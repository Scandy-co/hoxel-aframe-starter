# Intro

A starter project for creating awesome hoxel-filled VR scenes using just HTML and Javascript!

Check out a live demo [here](http://whack-a-hoxel.surge.sh/) (especially on a headset) and read more about getting started on our blog post.

## Setup

```
git clone https://github.com/Scandy-co/hoxel-aframe-starter.git
cd hoxel-aframe
yarn
yarn start
```

Now you should be running! Open your browser to `localhost:3000` to view the experience. Once open, press `ctrl + option + i` to open the A-Frame inspector.

## Usage

By default, a game that we have built using A-Frame called "Whack-a-Hoxel" is loaded via WebVR into the browser. The hoxels are introduced via what is known as a `component` in A-Frame land. Contained in this repo is a component called `scvv`. Simply pass this component either a local path or a url to your hoxel directory and that's it. Check it out:

```html
<a-scene environment="preset: tron">
  <a-entity
    position="0 2 -2"
    scvv="src: ../assets/hoxels/neilson_01"
  ></a-entity>
</a-scene>
```

For more information on A-Frame and how to build your own VR experiences, we encourage you to peruse the docs and check out our blog post. To get started on your own scene, simply build off of our default `scene.html` or start a new `html` from scratch and update `./src/index.js`.
