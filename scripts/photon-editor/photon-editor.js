import * as THREE from '../three/src/Three.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';

let HEIGHT, WIDTH;

// three.js variables
let container, controls, mixer, model, renderer, texture;

// configuration objects
const ModelConfig = {
	// model path 
	path: "./assets/glb/Wizard__Bored.glb",

	// model scale
	scaleX: 10,
	scaleY: 10,
	scaleZ: 10,
	
	// model placement
	positionX: 0,
	positionY: -10,
	positionZ: -5
}

const SceneConfig = {
	// camera perspective
	fieldOfView: 60,
	nearPlane: 0.5,
	farPlane: 1000,

	// camera position
	cameraX: 0,
	cameraY: 30,
	cameraZ: 20,
}

let modelFlag = false;

// interactive variables
let neck, waist;
let interactivity = false;

var loaderAnim = document.getElementById('js-loader');


export class PhotonEditor {

	constructor() {

		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;

		this.scene = new THREE.Scene();
		// Add a fog effect to the scene; same color as the
		// background color used in the style sheet
		this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

		// Create the camera			
		this.camera = new THREE.PerspectiveCamera(
			ModelConfig.fieldOfView,
			WIDTH / HEIGHT,
			ModelConfig.nearPlane,
			ModelConfig.farPlane
		);
		// Set the position of the camera
		this.camera.position.x = SceneConfig.cameraX;
		this.camera.position.z = SceneConfig.cameraY;
		this.camera.position.y = SceneConfig.cameraZ;
		
		// A hemisphere light is a gradient colored light; 
		// the first parameter is the sky color, the second parameter is the ground color, 
		// the third parameter is the intensity of the light
		this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
		
		// A directional light shines from a specific direction. 
		// It acts like the sun, that means that all the rays produced are parallel. 
		this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);

		// Set the direction of the light  
		this.shadowLight.position.set(150, 350, 350);
		
		// Allow shadow casting 
		this.shadowLight.castShadow = true;

		// Define the visible area of the projected shadow
		this.shadowLight.shadow.camera.left = -400;
		this.shadowLight.shadow.camera.right = 400;
		this.shadowLight.shadow.camera.top = 400;
		this.shadowLight.shadow.camera.bottom = -400;
		this.shadowLight.shadow.camera.near = 1;
		this.shadowLight.shadow.camera.far = 1000;

		// Define the resolution of the shadow; the higher the better, 
		// but also the more expensive and less performant
		this.shadowLight.shadow.mapSize.width = 2048;
		this.shadowLight.shadow.mapSize.height = 2048;
		
		// To activate the lights, just add them to the scene
		this.scene.add(this.hemisphereLight);  
		this.scene.add(this.shadowLight);
		

		this.gltfLoader = new GLTFLoader();

		this.clock = new THREE.Clock();
	}
	
	configureScene() {
		
		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;

		// Create the renderer
		renderer = new THREE.WebGLRenderer({ 
			// Allow transparency to show the gradient background
			// we defined in the CSS
			alpha: true, 

			// Activate the anti-aliasing; this is less performant,
			// but, as our project is low-poly based, it should be fine :)
			antialias: true 
		});
		// Define the size of the renderer; in this case,
		// it will fill the entire screen
		renderer.setSize(WIDTH, HEIGHT);
		// Enable shadow rendering
		renderer.shadowMap.enabled = true;
		//Unless you need post-processing in linear colorspace, 
		//always configure WebGLRenderer as follows when using glTF
		renderer.outputEncoding = THREE.sRGBEncoding;
		// Add the DOM element of the renderer to the 
		// container we created in the HTML
		container = document.getElementById('world');
		container.appendChild(renderer.domElement);
		// Listen to the screen: if the user resizes it
		// we have to update the camera and the renderer size
		window.addEventListener('resize', this.handleWindowResize, false);

		// Orbital controls
		controls = new OrbitControls(this.camera, renderer.domElement);
		controls.screenSpacePanning = true;
		controls.target.set(0, 1, 0);
	}

	loadModel = () => {

		document.body.appendChild(loaderAnim);
		
		this.gltfLoader.load(ModelConfig.path, 
			// called when the resource is loaded
			(gltf) => {
				// console.log(gltf);
				model = gltf.scene;
			    let fileAnimations = gltf.animations;


			    // For adding interactivity
				model.traverse(o => {

					if (o.isMesh) {
						o.castShadow = true;
					    o.receiveShadow = true;
					    o.material.opacity = 1;
					}
					// Reference the neck and waist bones
					if (o.isBone && o.name === 'mixamorigNeck') { 
					    neck = o;
					}
					if (o.isBone && o.name === 'mixamorigSpine') { 
					    waist = o;
					}
				});

				// Set the models initial scale
				let sX = ModelConfig.scaleX;
				let sY = ModelConfig.scaleY;
				let sZ = ModelConfig.scaleZ;

				model.scale.set(sX, sY, sZ);

				// Set the models initial position
				let pX = ModelConfig.positionX;
				let pY = ModelConfig.positionY;
				let pZ = ModelConfig.positionZ;

				model.position.set(pX, pY, pZ );

			    this.scene.add(model);
			    loaderAnim.remove();

			    // Animate 
			    mixer = new THREE.AnimationMixer(model);


			    // Play Specific Animation
			    let motion = THREE.AnimationClip.findByName(fileAnimations, "mixamo.com");

			    
			    // Add these for interactivity:
				motion.tracks.splice(2, 1);
				motion.tracks.splice(4, 1);
			    

			    let animation = mixer.clipAction(motion);
				animation.play();

			}, 
			undefined,
			// called when loading has errors
			(error) => console.log('An error happened while creating the model: ', error)
		);
	}

	handleWindowResize = () => {
		// update height and width of the renderer and the camera
		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;
		renderer.setSize(WIDTH, HEIGHT);
		this.camera.aspect = WIDTH / HEIGHT;
		this.camera.updateProjectionMatrix();
	}

	animate = () => {
		if (mixer) {
		  mixer.update(this.clock.getDelta());
		}

		controls.update();
		renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.animate);
	}

	render = () => {
		// configure the editor and render graphic
		this.configureScene();
		// add model to the editor
		this.loadModel();

		if(interactivity) {

		}

		// start animation
		this.animate();
	}

	export = () => {
	// generate downloable .zip export
	}

	refresh = () => {
		// remove model from the scene and update flag
		if (modelFlag) {
			this.scene.remove(model);
			modelFlag = !modelFlag;
		}
		// remove renderer
		container.removeChild(renderer.domElement);
		// re render
		this.render();
	}

	perspective = vector => {
		// extract field and offset
		let field = vector.field;
		let offset = vector.offset;

		switch(field) {
	  
		  case "fov-input":
		    this.camera.fieldOfView = offset;
		    this.camera.updateProjectionMatrix();
		    break;
		  
		  case "np-input":
		    this.camera.nearPlane = offset;
		    this.camera.updateProjectionMatrix();
		    break;
		  
		  case "fp-input":
		  	this.camera.farPlane = offset;
		  	this.camera.updateProjectionMatrix();
		  	break;

		  default:
		  	console.log("default");
		    this.camera.fieldOfView = 60;
			this.camera.nearPlane = 0.5;
			this.camera.farPlane = 1000;
			this.camera.updateProjectionMatrix();
		}

		
		// console.log(this.camera.updateProjectionMatrix());
		// this.refresh();
		console.log("done.")
	}

	cameraPosition = vector => {
		// extract field and offset
		let field = vector.field;
		let offset = vector.offset;

		switch(field) {
	  
		  case "camera-x":
		    this.camera.position.x = offset;
		    this.camera.updateProjectionMatrix();
		    break;
		  
		  case "camera-y":
		    this.camera.position.y = offset;
		    this.camera.updateProjectionMatrix();
		    break;
		  
		  case "camera-z":
		  	this.camera.position.z = offset;
		  	this.camera.updateProjectionMatrix();
		  	break;

		  default:
		  	console.log("default");
		    this.camera.position.x = 60;
			this.camera.position.y = 0.5;
			this.camera.position.z = 1000;
			this.camera.updateProjectionMatrix();
		}

		console.log("done.")
	}

	set path(ref) {
		// update model path
		switch(ref) {
		  case "Wizard__Bored":
		    ModelConfig.path = "./assets/glb/Wizard__Bored.glb"
		    break;

		  case "Wizard__Taichi":
		    ModelConfig.path = "./assets/glb/Wizard__Taichi.glb"
		    break;

		  case "Wizard__Twerk":
		    ModelConfig.path = "./assets/glb/Wizard__Twerk.glb"
		    break;

		  case "Malcolm__Bored":
		    ModelConfig.path = "./assets/glb/Malcolm__Bored.glb"
		    break;

		  case "Malcolm__Talking":
		    ModelConfig.path = "./assets/glb/Malcolm__Talking.glb"
		    break;

		  case "Malcolm__Searching":
		    ModelConfig.path = "./assets/glb/Malcolm__Searching.glb"
		    break;

		  case "Michelle__Bored":
		    ModelConfig.path = "./assets/glb/Michelle__Bored.glb"
		    break;

		  case "Michelle__Greeting":
		    ModelConfig.path = "./assets/glb/Michelle__Greeting.glb"
		    break;

		  case "Michelle__Party":
		    ModelConfig.path = "./assets/glb/Michelle__Party.glb"
		    break;

		  default:
		    ModelConfig.path = "./assets/glb/Michelle__Greeting.glb";
		}
		
		modelFlag = !modelFlag;
		this.refresh();
	}
	
	toggleInteractivity = () => {
		interactivity = !interactivity;
		console.log("Active: ", interactivity);
		if(interactivity) {
			document.addEventListener('mousemove', enableInteractivity);
			return;
		} 
		document.removeEventListener('mousemove', enableInteractivity);
		return;
	}

}

function enableInteractivity(e) {
	var mousecoords = getMousePos(e);
	if (neck && waist) {
		moveJoint(mousecoords, neck, 50);
		moveJoint(mousecoords, waist, 30);
	}
}

function getMousePos(e) {
  
  return { x: e.clientX, y: e.clientY };
}

function moveJoint(mouse, joint, degreeLimit) {
  let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
  joint.rotation.y = THREE.Math.degToRad(degrees.x);
  joint.rotation.x = THREE.Math.degToRad(degrees.y);
}

function getMouseDegrees(x, y, degreeLimit) {
  let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;

  let w = { x: window.innerWidth, y: window.innerHeight };

  // Left (Rotates neck left between 0 and -degreeLimit)
  
   // 1. If cursor is in the left half of screen
  if (x <= w.x / 2) {
    // 2. Get the difference between middle of screen and cursor position
    xdiff = w.x / 2 - x;  
    // 3. Find the percentage of that difference (percentage toward edge of screen)
    xPercentage = (xdiff / (w.x / 2)) * 100;
    // 4. Convert that to a percentage of the maximum rotation we allow for the neck
    dx = ((degreeLimit * xPercentage) / 100) * -1; }
// Right (Rotates neck right between 0 and degreeLimit)
  if (x >= w.x / 2) {
    xdiff = x - w.x / 2;
    xPercentage = (xdiff / (w.x / 2)) * 100;
    dx = (degreeLimit * xPercentage) / 100;
  }
  // Up (Rotates neck up between 0 and -degreeLimit)
  if (y <= w.y / 2) {
    ydiff = w.y / 2 - y;
    yPercentage = (ydiff / (w.y / 2)) * 100;
    // Note that I cut degreeLimit in half when she looks up
    dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
    }
  
  // Down (Rotates neck down between 0 and degreeLimit)
  if (y >= w.y / 2) {
    ydiff = y - w.y / 2;
    yPercentage = (ydiff / (w.y / 2)) * 100;
    dy = (degreeLimit * yPercentage) / 100;
  }
  return { x: dx, y: dy };
}
