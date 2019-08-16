# hoxel-aframe

AFrame project to view hoxel in WebXR

## Setup

```
git clone https://github.com/Scandy-co/hoxel-aframe.git
cd hoxel-aframe
yarn
yarn start
```

Now you should be running!

Open your browser to 0.0.0.0:3000 to view the experience.

Once open, press `ctrl + option + i` to open the AFrame inspector. This allows you to move any objects arounc the scene.


<hr>


dir structure

- src (all the client side code)
 	- `scene.html` (the main aframe scene)
		- This is main the playground to create content in.
	- `index.js` (entry to all client code)
		- Requires lots of stuff and connects and sets things up
	- templates (this is where view markup is)
		- `mixins.html`
			- cluttered code being attached to different components
			- will have things like 6 DOF controller managers
		- `player.html`
			- this represents the player (person, living human) who is playing with the hoxel
