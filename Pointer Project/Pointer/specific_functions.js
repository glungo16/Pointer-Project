//////////////// Specific Helper Functions ////////////////////////////////////////////////////////////////////////////////////////////////

// Prepare experiment if "runExperiment checkbox is checked"
function runExperiment(){
	
	document.getElementById("pre2").style.display = "none";
	document.getElementById("nextC").style.display = "none";
	
}


// Update the midline coordinates and size
function updateMidLine(){
	midLine.xCor = Math.abs((target1.xCor + target2.xCor)/2);
	midLine.yCor = Math.abs((target1.yCor + target2.yCor)/2);	
	midLine.xLen = Math.sqrt(Math.pow(target1.yCor - target2.yCor,2) + Math.pow(target1.xCor - target2.xCor,2));
	
	borderLine.xCor = Math.abs((target1.xCor + target2.xCor)/2);
	borderLine.yCor = Math.abs((target1.yCor + target2.yCor)/2);	
	borderLine.xLen = Math.sqrt(Math.pow(target1.yCor - target2.yCor,2) + Math.pow(target1.xCor - target2.xCor,2));
}

// Update the angle between the targets with respect to the targets being positioned horizontally (target1 on the left and target2 on the right)
function updateTargetAngle(){
	targetAngle = Math.atan2(target1.yCor - target2.yCor,target1.xCor - target2.xCor);
	
	//gX = Math.abs(Math.sin(targetAngle));
	//gY = Math.abs(Math.cos(targetAngle));
	
	gX = Math.sin(targetAngle);
	gY = Math.cos(targetAngle);
}


// Fill the target coordinates arrays depending on the experiment type
function fillTargetCoordinates(maxElements){
	
	target1XCorS = [];
	target1YCorS = [];
	target2XCorS = [];
	target2YCorS = [];
	
	// target coordinates are fixed on each trial (only 1 direction of movement)
	if (targetPositions == "1dir") {
		for (var i=0;i<maxElements;i++){
			target1XCorS.push(670);
			target1YCorS.push(100);
			target2XCorS.push(670);
			target2YCorS.push(480);
		}
	}
	
	// target 2 coordinates are fixed, while the target 1 coordinates change between three values (at 45, 90, 135 degrees) from the target 2 (3 directions of movement)
	else if (targetPositions == "3dir") {
		
		let target1Cords = [];
		let angles = [45,90,135]; // the 3 direction angles in degrees
		for (let i=0;i<3;i++){
			target1Cords.push([]);
			target1Cords[i] = getCoordinatesAngle(-degToRad(angles[i]), midLineLen, t2X, t2Y);
			
			// Round the target coordinates
			target1Cords[i][0] = Math.round(target1Cords[i][0]);
			target1Cords[i][1] = Math.round(target1Cords[i][1]);
		}
		
		
		for (let i=0;i<maxElements;i++){
			// Each direction lasts 1 trial
			if (direction == "1way"){
				target1XCorS.push(target1Cords[i%3][0]);
				target1YCorS.push(target1Cords[i%3][1]);
			}
			// Each direction lasts 2 trials so that the same direction is kept when moving from target 2 to target 1 and from target 1 back to target 2
			else if (direction == "2way"){
				target1XCorS.push(target1Cords[Math.floor(i/2)%3][0]);
				target1YCorS.push(target1Cords[Math.floor(i/2)%3][1]);
			}
			target2XCorS.push(t2X);
			target2YCorS.push(t2Y);
		}
		
		// Shuffle the target coordinates
		let order;
		if (direction == "1way"){
			order = shuffleBlocks(maxElements, 15, 1);
		}
		// for 2way, always make 2 consecutive trials on the same path
		else if (direction == "2way"){
			order = shuffleBlocks(maxElements, 30, 2);
		}
		
		target1XCorS = sortSpecificOrder(target1XCorS,order);
		target1YCorS = sortSpecificOrder(target1YCorS,order);
		target2XCorS = sortSpecificOrder(target2XCorS,order);
		target2YCorS = sortSpecificOrder(target2YCorS,order);
	}
}

// start next trial when the canvas is clicked when direction == "1way"
async function startNextTrial1Way(){
	if ((experiment && trial <= maxTrials) || (preExperiment && trial <= maxTrialsPre)){
		considerStartingPosition = true;
		startingXPositionST = xAbs.toFixed(3);
		startingYPositionST = yAbs.toFixed(3);
		canvasDraw();
		await sleep(500);
	}
	targetColor = "#ffffff"; // white
	//canvasDraw();
	//x = 50;
	//y = 50;
	
	
	// auditory feedback in the pre-experiment
	if (preExperiment && trial <= maxTrialsPre) {
		
		dingStart.play();
		await sleep(150);
		startTimerPre = true;
		
	}
	if (experiment && trial <= maxTrials) startTimerExp = true;
	wait = false;
	//document.addEventListener("mousemove", mouseMoved, false);
	recordMouse = true;
	considerStartingPosition = false;
	
	window.requestAnimationFrame(loop);
}


// Determine the experiment type
function updateCheckboxValues(){
	// Obtain selected target positions
	if (document.getElementById("1dir").checked == true) targetPositions = "1dir";
	else if (document.getElementById("3dir").checked == true) targetPositions = "3dir";
	else targetPositions = "1dir"; // default if some unexpected problem appeared
	
	// Obtain selected cursor perturbation
	if (document.getElementById("velocity").checked == true) cursorPerturbation = "velocity";
	else if (document.getElementById("rotation").checked == true) cursorPerturbation = "rotation";
	else cursorPerturbation = "velocity"; // default if some unexpected problem appeared
	
	// Obtain selected rotation point
	if (document.getElementById("startingPoint").checked == true) rotationPointStartingPoint = true;
	else if (document.getElementById("bottomPoint").checked == true) rotationPointStartingPoint = false;
	else rotationPointStartingPoint = false; // default if some unexpected problem appeared
	
	// Determine the direction of movement
	if (document.getElementById("1way").checked == true) direction = "1way";
	else if (document.getElementById("2way").checked == true) direction = "2way";
	else direction = "1way"; // default if some unexpected problem appeared
	
	// Timeout Type
	if (document.getElementById("pauseExp").checked == true) timeoutType = "pauseExp";
	else if (document.getElementById("exitExp").checked == true) timeoutType = "exitExp";
	else timeoutType = "pauseExp"; // default if some unexpected problem appeared
	
}

// Sound feedback functions
function dingStop(){
	dingEnd.play();
}
function dingBegin(){
	dingStart.play();
}



//////////////////////////////////////////////////Calibration related functions /////////////////////////////////////////

// Prepares the displayed mouse to move downwards 
function motionDownF(){
	motionDown = true;
	motionEnd = false;
	
	x = 0;
	y = 0;
	Ax = x;
	Ay = y;
	
	yPointerCalibration = 100;
	xPointerCalibration = 590;
	
}

// Prepares the displayed mouse to move upwards
function motionUpF(){
	motionUp = true;
	motionEnd = false;
	
	x = 0;
	y = 0;
	Ax = x;
	Ay = y;
	
	yPointerCalibration = 392;
	xPointerCalibration = 590;
	
}

// Prepares the displayed mouse to move upwards
function initializeTrial(){
	if (startingTarget == 2){
		xf = target2.xCor;
		yf = target2.yCor;
		
		target1.reached = false;
		target2.visible = false;
		target1.visible = true;
		target2.reached = true;
	}
	else{
		xf = target1.xCor;
		yf = target1.yCor;
		
		target1.reached = true;
		target2.visible = true;
		target1.visible = false;
		target2.reached = false;
	}
	x = xf;
	y = yf;
	xvf = 0;
	yvf = 0;
	xAbs = x;
	yAbs = y;
	endTrial = false; // in case ESC was pressed after target is reached
	
	backgroundColor = "black";
	targetColor = "#00ff00"; // green
	canvasDraw();
}

// Calibration distance (currently in use)
function getDistance(){
		
	return Math.sqrt(Math.pow(Cy - Ay, 2) + Math.pow(Cx - Ax, 2));
}

// Old Calibration distance calculation; no longer used (older calibration procedure)
function getDistanceTriangle(){
	var a = Math.sqrt(Math.pow(Cy - By, 2) + Math.pow(Cx - Bx, 2));
	var b = Math.sqrt(Math.pow(Cy - Ay, 2) + Math.pow(Cx - Ax, 2));
	var c = Math.sqrt(Math.pow(By - Ay, 2) + Math.pow(Bx - Ax, 2));
	
	var p = (a+b+c)/2;
	
	
	if (isNaN(2*Math.sqrt(p*(p-a)*(p-b)*(p-c))/c)){
		return 0;
	}
		
	
	return 2*Math.sqrt(p*(p-a)*(p-b)*(p-c))/c;
}

function CalibrationLoop(){
	window.requestAnimationFrame(loop);
}

// sound feedback for when to start movement during calibration
async function startTimerCalibration(){
	await sleep(500);
	dingStart.play();
}