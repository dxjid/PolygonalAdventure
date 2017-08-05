function loadMesh(json){
	
		var loader = new THREE.JSONLoader();
		loader.load(json,createMesh);
	
}

function createMesh(geometry, materials){
	var material = [];
	
	for(iChild = 0; iChild < materials.length; iChild++){
		material.push(materials[iChild]);
		
		if (bSkinning == true){
			material[iChild].skinning = true;
		}
	}	
		
	meshes.push(new THREE.SkinnedMesh(geometry, material));
	scene.add(meshes[meshes.length - 1]);
	/*
	mixer = new THREE.AnimationMixer(meshes[meshes.length - 1]);
	action.walk = mixer.clipAction(meshes[meshes.length - 1].geometry.animations[ 0 ]);
	action.walk.setEffectiveWeight(1);
	action.walk.enabled = true;	
	action.walk.play();	*/
}

function render(){
	requestAnimationFrame(render);
	

	//var delta = clock.getDelta();
	//mixer.update(delta);
	
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
	var light = new THREE.AmbientLight(0xffffff,0.4);
	scene.add(light);
	
	//Create a DirectionalLight and turn on shadows for the light
	var light = new THREE.DirectionalLight( 0xffffff, .6 );
	light.position.set( 100, 100, -100 ); 			//default; light shining from top
	scene.add( light );


}





