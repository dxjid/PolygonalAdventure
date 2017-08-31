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
	
	if( materials != null ){
		for(iChild = 0; iChild < materials.length; iChild++){
			material.push(materials[iChild]);
			material[iChild].skinning = bSkinning;

		}	
	}
	
	mesh = new THREE.SkinnedMesh(geometry, material);
	mesh.name = sName;
	meshes.push(mesh);

	
	if(  !sName.includes("Human") && !sName.includes("Wolf") && !sName.includes("Cabbage") && !sName.includes("Sheep")  &&
	   !sName.includes("Land") && !sName.includes("YellowBalloon") && !sName.includes("PurpleBalloon") && !sName.includes("River")){
		
		if(sName.includes("Plane")){
			CollideablePlane.push(new THREE.Plane().setFromCoplanarPoints(mesh.geometry.vertices[0],mesh.geometry.vertices[1],mesh.geometry.vertices[2]).normalize());
		}else{
			CollideableBox.push(new THREE.Box3().setFromObject(mesh));	
		}
		
	}	
	
	
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
		reachGoal();
	
		if(bGameOver){
			createTexts("end");
			assignId();
			if(meshes[iEnd] != null){
				updateCamera();
				updateGameOverCam(iEnd);
			}
		}
		
		if(bComplete){
			createTexts("Complete");
			assignId();
			if(meshes[iComplete] != null){
				updateCamera();
				updateGameOverCam(iComplete);
			}			
		}
	}
	
	
	renderer.render(scene,camera);
}

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
	
	// Create a DirectionalLight and turn on shadows for the light
	var light = new THREE.DirectionalLight( 0xffffff, .6 );
	light.position.set( 100, 100, -100 ); 			//default; light shining from top
	scene.add( light,camera);
	
	var spotLight = new THREE.SpotLight( 0xffffff,1.0,20.0,3.14/8,0.0,0.5 ); //SpotLight( color, intensity, distance, angle, penumbra, decay )
	spotLight.position.set(220.0,32.0,40.0);
	spotLight.target.position.set(0.0,0.0,0.0);
	spotLight.castShadow = true;
	
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	
	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 30;
	
	scene.add( spotLight );
	
	


}

function updateCamera(){
	var relativeCameraOffset = new THREE.Vector3(0,5,10);
	var cameraOffset = relativeCameraOffset.applyMatrix4( meshes[iHuman].matrixWorld );
	camera.position.x = cameraOffset.x;
	camera.position.y = cameraOffset.y;
	camera.position.z = cameraOffset.z;
	camera.lookAt( meshes[iHuman].position );
}

function updateGameOverCam(iPos){
		var relativeOffset = new THREE.Vector3(-7,4,3);
		var MeshOffset = relativeOffset.applyMatrix4( meshes[iHuman].matrixWorld );
		
		//Position
		meshes[iPos].position.x = MeshOffset.x;
		meshes[iPos].position.y = MeshOffset.y;
		meshes[iPos].position.z = MeshOffset.z;	
		
		meshes[iPos].rotation.copy(meshes[iHuman].rotation);
}

function assignId(){
	for(i = 0; i< meshes.length; i++){
		if( meshes[i].name == "Wolf" ){
			iWolf = i;
		}else if( meshes[i].name == "Human" ){
			iHuman = i;	
		}else if( meshes[i].name == "Cabbage" ){
			iCabbage = i;	
		}else if( meshes[i].name == "Sheep"	){
			iSheep = i;	
		}else if( meshes[i].name == "Title"	){
			iTitle = i;				
		}else if( meshes[i].name == "End" ){
			iEnd = i;				
		}else if( meshes[i].name == "Hit" ){
			iHit = i;				
		}else if( meshes[i].name == "Raft" ){
			iRaft = i;
		}else if( meshes[i].name == "Complete" ){
			iComplete = i;
		}
	
	}
}

function setInitialPositions(){
	
	meshes[iWolf].position.set(0.0,-13.0,0.0);
	//meshes[iHuman].position.set(-120.52,-13.0,40.60);
	meshes[iHuman].position.set(200.64261,-13.0,43.47626);
	meshes[iCabbage].position.set(15,-13.0,118);
	meshes[iSheep].position.set(212.64261,-13.0,43.47626);
	meshes[iRaft].position.set(0,-14,-40);
	
}

function followMesh(MeshFollower){
		var relativeOffset;

		if(MeshFollower.name == "Wolf"){ 				//WOLF
			relativeOffset = new THREE.Vector3(4,0,5);
		}else if(MeshFollower.name == "Sheep"){			//SHEEP
			relativeOffset = new THREE.Vector3(0,0,7);
		}else{											//CABBAGE
			relativeOffset = new THREE.Vector3(-4,0,5);
		}
		
		
		
		var MeshOffset = relativeOffset.applyMatrix4( meshes[iHuman].matrixWorld );
		
		//Position
		MeshFollower.position.x = MeshOffset.x;
		MeshFollower.position.y = MeshOffset.y;
		MeshFollower.position.z = MeshOffset.z;
		
		//Rotation
		MeshFollower.rotation.copy(meshes[iHuman].rotation);

		
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
	}else if(sTime == "Complete"){
		loader.load("..\\fonts\\gentilis_bold.typeface.json", function(font){
			createTextMesh("Complete","Mision Complete!",font);
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
		}else if(name == "Complete"){
			size = 1;
			height = 1;				
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
		}else if(name == "Complete"){
			materials = [	new THREE.MeshPhongMaterial( { color: 0x20E942, shading: THREE.FlatShading } ), // front
							new THREE.MeshPhongMaterial( { color: 0x33AB47, shading: THREE.SmoothShading } ) // side
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

function detectCollision(mesh){
	
	var BoundingBox = new THREE.Box3().setFromObject( mesh );
	var BoundingBoxW = new THREE.Box3().setFromObject( meshes[iWolf] );
	var BoundingBoxS = new THREE.Box3().setFromObject( meshes[iSheep] );
	var BoundingBoxC = new THREE.Box3().setFromObject( meshes[iCabbage] );
	
	//Collisions with Planes
	for(var i = 0; i < CollideablePlane.length ; i++){
		var BoundingPlane = CollideablePlane[i];
		var bVertexMin = isInFront(BoundingBox.min,BoundingPlane);
		var bVertexMax = isInFront(BoundingBox.max,BoundingPlane);
		
		if(( bVertexMin || bVertexMax ) && !( bVertexMin && bVertexMax ) ){
			return true;
		}		
	}

	//Collisions with Trees and Houses
	for(var i = 0; i < CollideableBox.length ; i++){		
		if(BoundingBox.intersectsBox(CollideableBox[i])){
			return true;
		}		
	}		

	if(BoundingBox.intersectsBox(BoundingBoxW) && !bFollowWolf){
		return true;
	}	

	if(BoundingBox.intersectsBox(BoundingBoxS) && !bFollowSheep){
		return true;
	}	

	if(BoundingBox.intersectsBox(BoundingBoxC) && !bFollowCabbage){
		return true;
	}			

	return false;
}

function isInFront(vertex,Plane){
	var VertexToPlane = new THREE.Vector3( );
	var PlaneNormal = new THREE.Vector3( );
	
	VertexToPlane.copy(vertex);
	PlaneNormal.copy(Plane.normal);
	
	VertexToPlane = VertexToPlane.sub(Plane.coplanarPoint()).normalize();
	var CosAngle = PlaneNormal.dot(VertexToPlane);
	
	if( CosAngle < 0 ){
		return false;
	}else{
		return true;
	}
	
}

function updateCharacterPositionsOnBoat(){
		var relativeOffsetHuman;
		var relativeOffsetCompanion;
		var iPos = -1;

		relativeOffsetHuman = new THREE.Vector3(3,3,0);
		relativeOffsetCompanion = new THREE.Vector3(-3,3,0);
		
		var MeshOffsetH = relativeOffsetHuman.applyMatrix4( meshes[iRaft].matrixWorld );
		var MeshOffsetC = relativeOffsetCompanion.applyMatrix4( meshes[iRaft].matrixWorld );
		
		//Position
		meshes[iHuman].position.copy(MeshOffsetH);
		
		if(bFollowWolf){
			iPos = iWolf;
		}else if(bFollowSheep){
			iPos = iSheep;		
		}else if(bFollowCabbage){
			iPos = iCabbage;		
		}
	
		if( iPos != -1){
			meshes[iPos].position.copy(MeshOffsetC);
			meshes[iPos].rotation.copy(meshes[iHuman].rotation);
		}
		
		scene.updateMatrixWorld();
}

function updateCharacterPositionsOnLand(){
	
	if(meshes[iRaft].position.z >= -40){
		meshes[iHuman].position.z = -25;
		meshes[iHuman].position.y = -13.0;
		meshes[iHuman].rotation.y = Math.PI / 180 * 0;
	}else{
		meshes[iHuman].position.z = -106;
		meshes[iHuman].position.y = -13.0;
		meshes[iHuman].rotation.y = Math.PI / 180 * 180;
	}
	
	scene.updateMatrixWorld();
	
	if( bFollowSheep ){
		followMesh(meshes[iSheep]);
	}
	
	if( bFollowWolf ){
		followMesh(meshes[iWolf]);
	}

	if( bFollowCabbage ){
		followMesh(meshes[iCabbage]);
	}

	if( calculateDistance(meshes[iSheep],meshes[iHuman]) < 30 && !bFollowSheep ){
		followMesh(meshes[iSheep]);
	}
	
	if( calculateDistance(meshes[iWolf],meshes[iHuman]) < 30 && !bFollowWolf ){
		followMesh(meshes[iWolf]);
	}

	if( calculateDistance(meshes[iCabbage],meshes[iHuman]) < 30 && !bFollowCabbage ){
		followMesh(meshes[iCabbage]);
	}	
}

function calculateDistancePoints(FromProint,ToPoint){
	var distX = FromProint.x - ToPoint.x;
	var distY = FromProint.y - ToPoint.y;
	var distZ = FromProint.z - ToPoint.z;
	
	return Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2) + Math.pow(distZ,2));	
}

function reachGoal(){
	var DistSheep = calculateDistancePoints(meshes[iSheep].position,PointGoal);
	var DistWolf = calculateDistancePoints(meshes[iWolf].position,PointGoal);
	var DistCabbage= calculateDistancePoints(meshes[iCabbage].position,PointGoal);	
	
	bComplete = (DistSheep < 20) && (DistWolf < 20) && (DistCabbage < 20);
}