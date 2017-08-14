document.addEventListener("keydown", function(event){
	if( event.keyCode == 87 && bStart && !bGameOver){ 		//key W - Move Foward
		
		meshes[iHuman].translateZ(-0.5);
		//cube.position.copy(meshes[iHuman].position);
		
		if(detectCollision(meshes[iHuman])){
			meshes[iHuman].translateZ(0.5);
			//cube.position.copy(meshes[iHuman].position);
		}else{
			bHumanWalking = true;
			updateCamera();
		}
		
	}else if( event.keyCode == 65 && bStart && !bGameOver){ //key A - Turn Left

		meshes[iHuman].rotateOnAxis( new THREE.Vector3(0,1,0),0.1);
		//cube.rotation.copy(meshes[iHuman].rotation);
		
		if(detectCollision(meshes[iHuman])){
			meshes[iHuman].rotateOnAxis( new THREE.Vector3(0,1,0),-0.1);
			//cube.rotation.copy(meshes[iHuman].rotation);
		}else{
			bHumanWalking = true;
			updateCamera();
		}
		
	}else if( event.keyCode == 83 && bStart && !bGameOver){ //key S - Move Backwards
		
		meshes[iHuman].translateZ(0.5);
		//cube.position.copy(meshes[iHuman].position);
		
		if(detectCollision(meshes[iHuman])){
			meshes[iHuman].translateZ(-0.5);
			//cube.position.copy(meshes[iHuman].position);
		}else{
			bHumanWalking = true;
			updateCamera();
		}
		
	}else if( event.keyCode == 68 && bStart && !bGameOver){ //key D - Turn Right
		
		meshes[iHuman].rotateOnAxis( new THREE.Vector3(0,1,0),-0.1);
		//cube.rotation.copy(meshes[iHuman].rotation);
		
		if(detectCollision(meshes[iHuman])){
			meshes[iHuman].rotateOnAxis( new THREE.Vector3(0,1,0),0.1);
			//cube.rotation.copy(meshes[iHuman].rotation);
		}else{
			bHumanWalking = true;
			updateCamera();
		}
		
	}else if( event.keyCode == 13 ){ //key Enter
	
		assignId();
		setInitialPositions();
		bStart = true;
		meshes[iTitle].traverse( function ( object ) { object.visible = false; } );
		meshes[iHit].traverse( function ( object ) { object.visible = false; } );
		
	}else if( event.keyCode == 90 && calculateDistance(meshes[iSheep],meshes[iHuman]) < 30){   //key Z
	
		bFollowSheep = !bFollowSheep;
		
	}else if( event.keyCode == 88 && calculateDistance(meshes[iWolf],meshes[iHuman]) < 30){    //key X
	
		bFollowWolf = !bFollowWolf;
		
	}else if( event.keyCode == 67 && calculateDistance(meshes[iCabbage],meshes[iHuman]) < 30){ //key C
	
		bFollowCabbage = !bFollowCabbage;
		
	}
	
	if( bHumanWalking ){
		MeshActions[HUMAN][0].play();
	}
	
	if( bFollowSheep ){
		followMesh(iSheep);
	}
	
	if( bFollowWolf ){
		followMesh(iWolf);
	}

	if( bFollowCabbage ){
		followMesh(iCabbage);
	}	
});	

document.addEventListener("keyup", function(event){
	if( event.keyCode == 87 || event.keyCode == 65 || event.keyCode == 83 || event.keyCode == 68 ){ 		//key W - key A - key S - key D
		bHumanWalking = false;
	}else{

	}
	
	if( !bHumanWalking && bStart){
		MeshActions[HUMAN][0].stop();
	}
	
});	