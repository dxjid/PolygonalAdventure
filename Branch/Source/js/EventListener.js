document.addEventListener("keydown", function(event){
	if ( event.keyCode == 37 ){ 	//Left
		camera.position.x -= 10;
	}else if(event.keyCode == 38){ 	//Up
		camera.position.y += 10;
	}else if(event.keyCode == 39){	//Right
		camera.position.x += 10;			
	}else if(event.keyCode == 40){	//Down
		camera.position.y -= 10;
	}else if(event.keyCode == 65){
		camera.position.z -=10;
	}else if(event.keyCode == 90){
		camera.position.z +=10;		
	}else if(event.keyCode == 83){
		meshes[iLightHouse].scale.x +=10;
		meshes[iLightHouse].scale.y +=10;
		meshes[iLightHouse].scale.z +=10;		
	}else if(event.keyCode == 88){
		meshes[iLightHouse].scale.x -=10;
		meshes[iLightHouse].scale.y -=10;
		meshes[iLightHouse].scale.z -=10;			
	}else{
	}
	
	//rotateMesh(meshes[wolf]);
	//action.walk.stop();
});	