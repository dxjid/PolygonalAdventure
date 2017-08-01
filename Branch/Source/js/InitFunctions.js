function loadMesh(json){
	var material = [];
	var loader = new THREE.JSONLoader();
	
	loader.load(json,function (geometry, materials) {

		for(iChild = 0; iChild < materials.length; iChild++){
			material.push(materials[iChild]);
			material[iChild].skinning = true;
		}	
			
		mesh = new THREE.SkinnedMesh(geometry, material);
		scene.add(mesh);
		
		mixer = new THREE.AnimationMixer(mesh);
		action.walk = mixer.clipAction(mesh.geometry.animations[ 0 ]);
		action.walk.setEffectiveWeight(1);
		action.walk.enabled = true;	
		action.walk.play();
    });	
}

function render(){
	requestAnimationFrame(render);
	
	var delta = clock.getDelta();
	mixer.update(delta);
	
	renderer.render(scene,camera);
};

function rotateMesh(mesh) {
	SPEED = 0.005; 
	if (!mesh) {
		return;
	}

	mesh.rotation.x -= SPEED * 2;
	mesh.rotation.y -= SPEED;
	mesh.rotation.z -= SPEED * 3;
}		

function initLights() {
	var light = new THREE.AmbientLight(0xffffff);
	scene.add(light);
}	