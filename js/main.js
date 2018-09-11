if ( WEBVR.isAvailable() === false ) {
	document.body.appendChild( WEBVR.getMessage() );
}

var scene, camera, renderer;
var controls, effect;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var floor;
var TERRAIN_DIM = 2000;

var fireworks = [];

var VRMode;

// Create the scene and set the scene size.
scene = new THREE.Scene();
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

// Create a camera, zoom it out from the model a bit, and add it to the scene.
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,25,0);
scene.add(camera);


var mouse_lock = new THREE.PointerLockControls( camera );
scene.add( mouse_lock.getObject() );

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
  var element = document.body;
  var pointerlockchange = function ( event ) {
    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
      mouse_lock.enabled = true;
      blocker.style.display = 'none';
    } else {
      mouse_lock.enabled = false;
      blocker.style.display = '-webkit-box';
      blocker.style.display = '-moz-box';
      blocker.style.display = 'box';
      instructions.style.display = '';
    }
  };
  var pointerlockerror = function ( event ) {
    instructions.style.display = '';
  };
  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
  instructions.style.display = 'none';
  
  // Ask the browser to lock the pointer
  element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
  element.requestPointerLock();
  instructions.addEventListener( 'click', function ( event ) {
    instructions.style.display = 'none';
    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();
  }, false );
} else {
  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}
// Create a renderer and add it to the DOM.
//renderer = new THREE.WebGLRenderer();
//renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0x0a0a2c );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
selecting = false;



controls = new THREE.VRControls( camera );
effect = new THREE.VREffect( renderer );   

if ( navigator.getVRDisplays ) {
	VRMode = true;
	//controls = new THREE.VRControls(camera);  
	//effect = new THREE.VREffect( renderer );
	navigator.getVRDisplays()
		.then( function ( displays ) {
			effect.setVRDisplay( displays[ 0 ] );
			controls.setVRDisplay( displays[ 0 ] );
		} )
		.catch( function () {
			// no displays
			VRMode = false; 
		} );
	document.body.appendChild( WEBVR.getButton( effect ) );
	} else {  
		VRMode = false;
		controls = new THREE.OrbitControls( camera, renderer.domElement);
		controls.enableZoom = false;
	}


// Create an event listener that resizes the renderer with the browser window.
window.addEventListener('resize', function() {
	var WIDTH = window.innerWidth,
	    HEIGHT = window.innerHeight;
	//renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
	if (VRMode) {
		effect.setSize(WIDTH, HEIGHT);
	}
	else {
		renderer.setSize(WIDTH, HEIGHT);
	}
});


init();
animate(); 

function init() {


	// Create a light, set its position, and add it to the scene
	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );

	// Generate terrain and add to scene
	var floor = new Terrain(TERRAIN_DIM, scene);


	// Add OrbitControls so that we can pan around with the mouse.
	//controls = new THREE.PointerLockControls( camera );
	//scene.add( controls.getObject() );
	
}

function makeFirework(){
	var position = new THREE.Vector3(Math.random() * 2000 - 1000, 0, Math.random() * 2000 - 1000);
	var f = new Firework(scene, position);
	scene.add(f.mesh);
	fireworks.push(f);
}

function animate() {

	//requestAnimationFrame( animate );
	//if (VRMode) {
		//effect.requestAnimationFrame( animate );
	//}
    //else {
    	//requestAnimationFrame( animate ); 
    //}

    // Create fireworks
    if (Math.random() < 0.1) {
    	makeFirework();
    }

	// Render the scene.
	for (var i = 0; i < fireworks.length; i++) {
		if (fireworks[i].isDead) {
			fireworks.splice(i, 1);
		}
		else {
			fireworks[i].update();
		}
	}

	requestAnimationFrame( animate );
	controls.update();

	if (!VRMode) {
		renderer.render( scene, camera );
	}
	else {
		effect.render( scene, camera ); 
	}

}