function loadMesh(json){
	var sName = json;
	var bSkinning = false;
	var loader = new THREE.JSONLoader();
	
	if(sName == "Wolf" || sName == "Human" || sName == "Cabbage" || sName == "Sheep"){
		bSkinning = true;
	}else{
		bSkinning = false;
	}	
	
	loader.load(sJSONFolder + sName + ".json",function(geometry,materials){
		createMesh(geometry,materials,sName,bSkinning);
	});
	
}

function createMesh(geometry, materials,sName,bSkinning){
	var material = [];
	var actions = []
	var mesh;
	var iPos = -1;
	
	for(iChild = 0; iChild < materials.length; iChild++){
		material.push(materials[iChild]);
		material[iChild].skinning = bSkinning;

	}	
	
	mesh = new THREE.SkinnedMesh(geometry, material);
	mesh.name = sName;
	meshes.push(mesh);
	scene.add(meshes[meshes.length - 1]);
	
	if(sName == "Wolf"){
		iPos = WOLF;
	}else if(sName == "Human"){
		iPos = HUMAN;
	}else if(sName == "Cabbage"){
		iPos = CABBAGE;
	}else if(sName == "Sheep"){
		iPos = SHEEP;
	}
	
	
	if(mesh.geometry.animations != null){
		for(i = 0; i < mesh.geometry.animations.length; i++){
			mixers.push(new THREE.AnimationMixer(mesh));
			MeshActions[iPos].push(mixers[mixers.length-1].clipAction(meshes[meshes.length - 1].geometry.animations[ i ]));
			MeshActions[iPos][MeshActions[iPos].length-1].setEffectiveWeight(1);
			MeshActions[iPos][MeshActions[iPos].length-1].enabled = true;
			
		}
	}
}

function render(){
	var delta = clock.getDelta();
	
	requestAnimationFrame(render);
	

	for(i=0;i<mixers.length;i++){
		mixers[i].update(delta);
	}

	if(bStart){
		checkCouples();
		
		if(bGameOver){
			createTexts("end");
			assignId();
			if(meshes[iEnd] != null){
				updateCamera();
				updateGameOverCam();
			}
		}
	}
	
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
	scene.add( light,camera);


}

function updateCamera(){
	var relativeCameraOffset = new THREE.Vector3(0,5,10);
	var cameraOffset = relativeCameraOffset.applyMatrix4( meshes[iHuman].matrixWorld );
	camera.position.x = cameraOffset.x;
	camera.position.y = cameraOffset.y;
	camera.position.z = cameraOffset.z;
	camera.lookAt( meshes[iHuman].position );
}

function updateGameOverCam(){
		var relativeOffset = new THREE.Vector3(-7,4,3);
		var MeshOffset = relativeOffset.applyMatrix4( meshes[iHuman].matrixWorld );
		
		//Position
		meshes[iEnd].position.x = MeshOffset.x;
		meshes[iEnd].position.y = MeshOffset.y;
		meshes[iEnd].position.z = MeshOffset.z;	
		
		meshes[iEnd].rotation.copy(meshes[iHuman].rotation);
}

function assignId(){
	for(i = 0; i< meshes.length; i++){
		if( meshes[i].name == "Wolf" ){
			iWolf = i;
		}else if( meshes[i].name == "Human"	){
			iHuman = i;	
		}else if( meshes[i].name == "Cabbage"	){
			iCabbage = i;	
		}else if( meshes[i].name == "Sheep"	){
			iSheep = i;	
		}else if( meshes[i].name == "Title"	){
			iTitle = i;				
		}else if( meshes[i].name == "End"	){
			iEnd = i;				
		}else if( meshes[i].name == "Hit"	){
			iHit = i;				
		}
	}
}

function setInitialPositions(){
	
	meshes[iWolf].position.set(0,0,0);
	meshes[iHuman].position.set(-134.52,-28.99,40.60);
	meshes[iCabbage].position.set(100,-10,-178);
	meshes[iSheep].position.set(212.64261,-16.81784,43.47626);
	
}

function followMesh(Follower){
		var relativeOffset = new THREE.Vector3(0,0,2);
		var MeshOffset = relativeOffset.applyMatrix4( meshes[iHuman].matrixWorld );
		
		//Position
		meshes[Follower].position.x = MeshOffset.x;
		meshes[Follower].position.y = MeshOffset.y;
		meshes[Follower].position.z = MeshOffset.z;
		
		//Rotation
		meshes[Follower].rotation.copy(meshes[iHuman].rotation);

		
}

function calculateDistance(ToMesh,FromMesh){
	var distX = FromMesh.position.x - ToMesh.position.x;
	var distY = FromMesh.position.y - ToMesh.position.y;
	var distZ = FromMesh.position.z - ToMesh.position.z;
	
	return Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2) + Math.pow(distZ,2));
}

function checkCouples(){
	var distHW = calculateDistance(meshes[iWolf],meshes[iHuman]);
	var distHC = calculateDistance(meshes[iCabbage],meshes[iHuman]);
	var distHS = calculateDistance(meshes[iSheep],meshes[iHuman]);
	var distWS = calculateDistance(meshes[iSheep],meshes[iWolf]);
	var distSC = calculateDistance(meshes[iSheep],meshes[iCabbage]);
	
	if(distWS < 20 && distHW > 30 && distHS > 30){
		bGameOver = true;
		return;
	}
	
	if(distSC < 20 && distHC > 30 && distHS > 30){
		bGameOver = true;
		return;		
	}
	
}

function createTexts(sTime){
	var loader = new THREE.FontLoader();
	
	if(sTime == "start"){
		loader.load("..\\fonts\\gentilis_bold.typeface.json", function(font){
			createTextMesh("Title","Polygonal Adventure",font);
			createTextMesh("Hit","Press Enter to start.",font);
		});
	}else{
		loader.load("..\\fonts\\gentilis_bold.typeface.json", function(font){
			createTextMesh("End","Game Over!",font);
		});		
	}
}

function createTextMesh(name,text,font){
		var size,
			height;
			
		if(name == "Title"){
			size = 40;
			height = 2;
		}else if(name == "Hit"){
			size = 10;
			height = 2;			
		}else{
			size = 2;
			height = 1;		
		}
		
		if(name == "Title"){
			materials = [	new THREE.MeshPhongMaterial( { color: 0x094DB3, shading: THREE.FlatShading } ), // front
							new THREE.MeshPhongMaterial( { color: 0x134795, shading: THREE.SmoothShading } ) // side
						];			
		}else if(name == "End"){
			materials = [	new THREE.MeshPhongMaterial( { color: 0xF91212, shading: THREE.FlatShading } ), // front
							new THREE.MeshPhongMaterial( { color: 0xD72323, shading: THREE.SmoothShading } ) // side
						];			
		}else{
			materials = [	new THREE.MeshPhongMaterial( { color: 0x2A88CB, shading: THREE.FlatShading } ), // front
							new THREE.MeshPhongMaterial( { color: 0x2971A4, shading: THREE.SmoothShading } ) // side
						];			
		}

	
        var textGeo = new THREE.TextBufferGeometry(text, {
			font: font,
			size: size,
			height: height,
			curveSegments: 10,
			bevelEnabled: false,
			bevelThickness: 2,
			bevelSize: 3,
			bevelSegments: 5
        });
		
		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();
		

	
					
		textMesh = new THREE.Mesh( textGeo, materials );
		textMesh.name = name;
		
		var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
		textMesh.position.x = centerOffset;
		textMesh.position.z = 100;
		
		if(name == "Hit"){
			textMesh.position.y = 60;
		}else if(name == "Title"){
			textMesh.position.y = 80;		
		}else{
			textMesh.position.z = 0;
			textMesh.position.y = 0;
			textMesh.position.x = 0;			
		}
		
		meshes.push(textMesh)
		
		scene.add(meshes[meshes.length - 1]);		
}
