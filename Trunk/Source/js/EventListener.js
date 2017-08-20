document.addEventListener("keydown", function(event){
	var iFollowers = 0;
	
	if(bFollowCabbage) iFollowers++;
	if(bFollowSheep) iFollowers++;
	if(bFollowWolf) iFollowers++;
	
	if( event.keyCode == 87 && bStart && !bGameOver && !bInRaft && !bComplete){ 		//key W - Move Foward
		
		meshes[iHuman].translateZ(-0.5);
		
		if(detectCollision(meshes[iHuman])){
			meshes[iHuman].translateZ(0.5);
		}else{
			bHumanWalking = true;
			updateCamera();
		}
		
	}else if( event.keyCode == 65 && bStart && !bGameOver && !bInRaft && !bComplete){ //key A - Turn Left

		meshes[iHuman].rotateOnAxis( new THREE.Vector3(0,1,0),0.1);
		
		if(detectCollision(meshes[iHuman])){
			meshes[iHuman].rotateOnAxis( new THREE.Vector3(0,1,0),-0.1);
		}else{
			bHumanWalking = true;
			updateCamera();
		}
		
	}else if( event.keyCode == 83 && bStart && !bGameOver && !bInRaft && !bComplete){ //key S - Move Backwards
		
		meshes[iHuman].translateZ(0.5);
		
		if(detectCollision(meshes[iHuman])){
			meshes[iHuman].translateZ(-0.5);
		}else{
			bHumanWalking = true;
			updateCamera();
		}
		
	}else if( event.keyCode == 68 && bStart && !bGameOver && !bInRaft && !bComplete){ //key D - Turn Right
		
		meshes[iHuman].rotateOnAxis( new THREE.Vector3(0,1,0),-0.1);
		
		if(detectCollision(meshes[iHuman])){
			meshes[iHuman].rotateOnAxis( new THREE.Vector3(0,1,0),0.1);
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
		
	}else if( event.keyCode == 90 && calculateDistance(meshes[iSheep],meshes[iHuman]) < 30 && !bInRaft){   //key Z
	
		bFollowSheep = !bFollowSheep;
		
	}else if( event.keyCode == 88 && calculateDistance(meshes[iWolf],meshes[iHuman]) < 30 && !bInRaft){    //key X
	
		bFollowWolf = !bFollowWolf;
		
	}else if( event.keyCode == 67 && calculateDistance(meshes[iCabbage],meshes[iHuman]) < 30 && !bInRaft){ //key C
	
		bFollowCabbage = !bFollowCabbage;
		
	}else if( event.keyCode == 66 && calculateDistance(meshes[iHuman],meshes[iRaft]) < 30 && !bInRaft && iFollowers <= 1){	//key B
		bInRaft = true;
		updateCharacterPositionsOnBoat();
		updateCamera();
	}else if(event.keyCode == 87 && bStart && !bGameOver && bInRaft && !bComplete){
		if(meshes[iRaft].position.z > -85){
			meshes[iRaft].translateZ(-0.5);
			updateCharacterPositionsOnBoat();
			updateCamera();
		}
	}else if(event.keyCode == 83 && bStart && !bGameOver && bInRaft && !bComplete){
		if(meshes[iRaft].position.z < -40){
			meshes[iRaft].translateZ(0.5);
			updateCharacterPositionsOnBoat();
			updateCamera();
		}
	}else if( event.keyCode == 66 && (meshes[iRaft].position.z >= -40 || meshes[iRaft].position.z <= -85) && bInRaft){	//key B
		bInRaft = false;
		
		if(meshes[iRaft].position.z >= -40){
			bRaftLeft = true;
		}else if(meshes[iRaft].position.z <= -85){
			bRaftLeft = false;	
		}
		
		updateCharacterPositionsOnLand();
		updateCamera();
	}
	
	
	if( bHumanWalking ){
		MeshActions[HUMAN][0].play();
		
		if( bFollowSheep ){
			MeshActions[SHEEP][0].play();
		}
		
		if( bFollowWolf ){
			MeshActions[WOLF][0].play();
		}

		if( bFollowCabbage ){
			MeshActions[CABBAGE][0].play();
		}			
	}
	
	if( bFollowSheep && !bInRaft){
		followMesh(meshes[iSheep]);
		//MeshActions[SHEEP][0].play();
	}
	
	if( bFollowWolf && !bInRaft){
		followMesh(meshes[iWolf]);
		//MeshActions[WOLF][0].play();
	}

	if( bFollowCabbage && !bInRaft){
		followMesh(meshes[iCabbage]);
		//MeshActions[CABBAGE][0].play();
	}	
});	

document.addEventListener("keyup", function(event){
	if( event.keyCode == 87 || event.keyCode == 65 || event.keyCode == 83 || event.keyCode == 68 ){ 		//key W - key A - key S - key D
		bHumanWalking = false;
	}else{

	}
	
	if( !bHumanWalking && bStart){
		MeshActions[HUMAN][0].stop();
		
		if( bFollowSheep ){
			MeshActions[SHEEP][0].stop();
		}
		
		if( bFollowWolf ){
			MeshActions[WOLF][0].stop();
		}

		if( bFollowCabbage ){
			MeshActions[CABBAGE][0].stop();
		}		
	}
	
});	