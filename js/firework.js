var MAX_HEIGHT = 200;
var MAX_VELOCITY = 20;
var ROCKET_LIFESPAN = 50;
var SPARK_LIFESPAN = 50;
var NUM_SPARKS = 20;
var COLORS = [0xF0FFFF, 0x00FFFF, 0xCCFFFF, 0xF2CEFF, 0xFF5C33];
var exploded;

class Firework {
	constructor(scene, position) {
		this.x = position.x;
		this.y = position.y; 
		this.z = position.z;

		//this.velocity = Math.random() % 21 + 20;
		this.velocity = 3;

		this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
		//this.color = 0xFF5C33;
		var geometry = new THREE.SphereGeometry(1);
		var material = new THREE.MeshPhongMaterial( {color: this.color} );
		//material.color.set = this.color;

		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(this.x, this.y, this.z);

		this.rocket_life = ROCKET_LIFESPAN;
		this.spark_life = SPARK_LIFESPAN;

		this.sparks = [];

		this.exploded = false;
		this.isDead = false;

		//scene.add(this.mesh);

	}

	get fireworkMesh () { return this.mesh }


	explode() {

		// create sparks
		for (var i = 0; i < NUM_SPARKS; i++) {
			var spark = new THREE.SphereGeometry(1);
			var sparkMaterial = new THREE.MeshPhongMaterial( {color: this.color} );
			//sparkMaterial.color.set = this.color;
			var sparkMesh = new THREE.Mesh(spark, sparkMaterial);
			sparkMesh.position.set(this.x, this.y, this.z);

			this.sparks.push(sparkMesh);
			scene.add(sparkMesh);

		}
	}

    update() {

  		// if not yet exploded, update rocket
  		if (!this.exploded) {
			this.mesh.position.y += this.velocity;
			this.y = this.mesh.position.y;
			this.rocket_life -= 1; 				
  		}

  		// if rocket is dead and not yet exploded, explode and create sparks
    	if (this.rocket_life == 0 && !this.exploded) {
    		this.exploded = true;

    		// remove rocket from scene
    		scene.remove(this.mesh);

    		this.explode();
    	}

    	// if exploded, update position of sparks
    	if (this.exploded) {
    		for (var i = 0; i < NUM_SPARKS; i++) {
    			var currSpark = this.sparks[i];
    			var direction = 360 / (NUM_SPARKS - 3) * i;
				var v0_x = this.velocity * Math.cos(direction * Math.PI / 180.0);
				var v0_y = this.velocity * Math.sin(direction * Math.PI / 180.0);
				var v0_z = Math.random() - Math.random();

				currSpark.position.x += v0_x;
				currSpark.position.y += v0_y;
				currSpark.position.z += v0_z;
    		}

    		this.spark_life -= 1;

		}

		if (this.spark_life == 0) {
			this.isDead = true;
			for (var i = 0; i < this.sparks.length; i++) {
				scene.remove(this.sparks[i]);
			}
		}

	}
}