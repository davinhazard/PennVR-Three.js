class Terrain {

	constructor(dimension, scene) {


		//PlaneGeometry(width, height, widthSegments, heightSegments)
		// pass in width and height? use for fireworks? 
		var geometry = new THREE.PlaneGeometry( dimension, dimension, 100, 100 );
		geometry.rotateX( - Math.PI / 2.0 );

		var n = new Noise();
		// apply perlin noise to y-height of plane
		geometry.vertices.forEach(function (v) {
			v.y = (n.perlin(v.x /100, v.y/100, v.z/100)) * 100 - 100;
		})
		var texture = new THREE.TextureLoader().load('js/images/galaxy.jpg');
		var material = new THREE.MeshBasicMaterial({map: texture});
		floor = new THREE.Mesh( geometry, material );
		scene.add( floor );
	}
}