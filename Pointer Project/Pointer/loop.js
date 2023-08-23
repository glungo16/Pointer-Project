function loop(timestamp) {
	//console.log("bla");
	
	if (!timeoutInProgress){
		exitLock = setTimeout(exitTimeoutF, timeout);
		timeoutInProgress = true;
	}
	
	if (!calibration){
		
		if (!wait){
			var dt = (timestamp - lastRender) / 1000 // sec
			// Time since the beginning
			if (time0 == 0){
				time0 = timestamp;
				time0DateNow = Date.now();
			}
			time = (timestamp - time0)/1000; // time in seconds
			update(dt)
			//console.log("temp:" + dt);
			//console.log("real:" + xS);
			//console.log(x);
			if (!wait) canvasDraw();
			lastRender = timestamp
			//document.getElementById('FPS').innerHTML = "draw rate = " + Math.round(1/dt) + " FPS"
			
			// Keep going the experiment
			if (experiment){
				if (trial <= maxTrials) {
					if (!wait && pointerLock) window.requestAnimationFrame(loop);
				}
				// The experiment is done
				else {
					setTimeout(clearTimeout(exitLock), 700);
					//document.removeEventListener("mousemove", absoluteMouseMoved, false);
					document.removeEventListener("mousemove", mouseMoved, false);
					exitLockF();
					closeFullscreen();
					finishExperiment();
				}
			}
			else if (preExperiment){
				if (trial <= maxTrialsPre) {
					if (!wait && pointerLock) window.requestAnimationFrame(loop);
				}
				// The experiment starts now
				else {
					wait = true;
					//document.removeEventListener("mousemove", mouseMoved, false);
					recordMouse = false;
					document.getElementById("exp").style.display = "block";
					document.getElementById("screen").style.display = "none";
					document.getElementById("preExperiment").style.display = "none";
					closeFullscreen();
					//document.getElementById("pre2").style.display = "block";
					setTimeout(clearTimeout(exitLock), 700);
					//document.removeEventListener("mousemove", absoluteMouseMoved, false);
					document.removeEventListener("mousemove", mouseMoved, false);
					exitLockF();
					
				}
			}
		
		}		
	}
	else{
		
		if (lastRender == 0) lastRender = timestamp - 0.01;
		var dt = (timestamp - lastRender) / 1000 // sec
		
		lastRender = timestamp;
		
		xv = (x-xprev)/dt
		yv = (y-yprev)/dt

		yvf += (yv-yvf) * smoothing;
		xvf += (xv-xvf) * smoothing;
		
		//console.log(yvf + xvf);
		xprev = x
		yprev = y
		
		/*
		// Calibration displayed pointer move
		if (motionDown){
			yPointerCalibration += calibrationSpeed;
			
			// Take coordinate of point B
			if (yPointerCalibration <= 420 && yPointerCalibration >= 410){
				Bx = x;
				By = y;
			}
			
			if (yPointerCalibration >= 460){
				yPointerCalibration = 460;
				motionDown = false;
				
				if (trial%2 == 1) motionRight = true;
				else motionLeft = true;
			}
		}
		if (motionLeft){
			xPointerCalibration -= calibrationSpeed;
			
			if (xPointerCalibration <= 540){
				xPointerCalibration = 540;
				motionLeft = false;
				motionUp = true;
			}
		}
		
		if (motionRight){
			xPointerCalibration += calibrationSpeed;
			
			if (xPointerCalibration >= 790){
				xPointerCalibration = 790;
				motionRight = false;
				motionUp = true;
			}
		}
		
		if (motionUp){
			yPointerCalibration -= calibrationSpeed;
			
			if (yPointerCalibration <= 300){
				yPointerCalibration = 300;
				motionUp = false;
				motionEnd = true;
				endMovement = 0;
			}
		}
		*/
		
		// Calibration displayed pointer move
		if (motionDown){
			yPointerCalibration += calibrationSpeed;
			
			
			if (yPointerCalibration >= 392){
				yPointerCalibration = 392;
				motionDown = false;
				
				motionEnd = true;
				
				endMovement = 0;
			}
		}
		
		if (motionUp){
			yPointerCalibration -= calibrationSpeed;
			
			if (yPointerCalibration <= 100){
				yPointerCalibration = 100;
				motionUp = false;
				motionEnd = true;
				endMovement = 0;
			}
		}
		
		
		if (motionEnd){
			if (Math.abs(xvf + yvf) < endMovementThreshold){
				endMovement += dt;
			}
			else {
				endMovement = 0;
			}
			
			// end trial
			if (endMovement > 1) {
				
				//if (trial > calibrationTrialRecord) calibrationDistance += Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
				
				// Point C coordinates
				Cx = x;
				Cy = y;
				
				let maxVar;
				let temp;
				
				// Calculate calibration distance
				if (!calibration_acceleration){
					calibrationDistanceArr[(trial-1)%3] = getDistance();
					
					// Calculate average velocity
					temp = vCal1.reduce((previous, current) => current += previous);
					vAvgCal1 = temp / vCal1.length;
					
					temp = calibrationDistanceArr.reduce((previous, current) => current += previous);
					calibrationDistance = temp / calibrationDistanceArr.length;
					
					maxVar = 0;
					
					for (i = 0; i< calibrationDistanceArr.length; i++){
						if (Math.abs(calibrationDistanceArr[i] - calibrationDistance) > maxVar) maxVar = Math.abs(calibrationDistanceArr[i] - calibrationDistance);
					}
					maxVar = maxVar/calibrationDistance;
					
					//console.log("calibrationDistanceArr: " + calibrationDistanceArr);
				}
				else{
					
					calibrationDistanceArr2[(trial-1)%3] = getDistance();
					
					// Calculate average velocity
					temp = vCal2.reduce((previous, current) => current += previous);
					vAvgCal2 = temp / vCal2.length;
					
					temp = calibrationDistanceArr2.reduce((previous, current) => current += previous);
					calibrationDistance2 = temp / calibrationDistanceArr2.length;
					
					maxVar = Math.abs(calibrationDistance2 - calibrationDistance)/calibrationDistance;
					
					//console.log("calibrationDistanceArr2: " + calibrationDistanceArr2);
					//console.log("calibrationDistance2: " + calibrationDistance2);
					//console.log("vAvgCal2: " + vAvgCal2/vAvgCal1);
				}
				
				//function myDist(dist,index){
				//	if (Math.abs(dist - calibrationDistance) < maxVar) maxVar = Math.abs(dist - calibrationDistance);
				//}
				//calibrationDistanceArr.forEach(myDist);
				
				
				//console.log("calibrationDistance: " + calibrationDistance);
				//console.log("maxVar: " + maxVar);
				//console.log("vAvgCal1: " + vAvgCal1);
				
				
				//if (calibration_acceleration) calibrationSpeed += 0.7; // increase displayed mouse speed in the calibration_acceleration stage
				trial++;
				motionEnd = false;
				
				// If calibration goes for too long, display every 10 trials to refresh the page (in case some problem has occured)
				//if (trial % 10 == 0 && confirm("A problem may have occured during calibration.\n Would you like to refresh the page and restart the experiment?")){
				//	location.reload(); 
				//}
				
				// Reload the page after 15 trials in the first calibration task (we assume an error occured)
				if (!calibration_acceleration && trial > 15){
					alert("A problem occurred during calibration. Please make sure that the mouse acceleration is turned off. We will refresh the page and restart the experiment.")
					location.reload(); 
				}
				
				// Reload the page after 15 trials in the second calibration task (we assume that mouse acceleration is turned on)
				else if (calibration_acceleration && trial > 10){
					alert("A problem occurred during calibration. Please make sure that the mouse acceleration is turned off and that you match the speed of the displayed mouse. You will not be able to proceed to the main experiment until the acceleration is off and the calibration is repeated. So please turn off your mouse acceleration and we will begin the calibration again.")
					//location.reload(); 
					startCalibration();
				}
				
				// Continue calibration
				else if ((!calibration_acceleration && (maxVar >= calibrationVariation || calibrationDistance < 10)) || (calibration_acceleration && (trial <= 3 || maxVar >= calibrationVariation2 || (vAvgCal2 / vAvgCal1) < 1.5))){
					dingStart.play();
					
					if (trial%2==1) setTimeout(motionDownF,200);
					if (trial%2==0) setTimeout(motionUpF,200);
					//motionDown = true;
				}
				
				// End calibration
				else{
					if (calibration_acceleration) document.getElementById("pre1").style.display = "block";
					else document.getElementById("cal2").style.display = "block";
					//document.removeEventListener("mousemove", mouseMoved, false);
					recordMouse = false;
					//document.removeEventListener("mousemove", absoluteMouseMoved, false);
					document.removeEventListener("mousemove", mouseMoved, false);
					closeFullscreen();
					document.getElementById("screen").style.display = "none";
					document.getElementById("calibration").style.display = "none";
					setTimeout(clearTimeout(exitLock), 700);
					exitLockF();
				}
			}
		}

		canvasDraw();
		
		
		if (pointerLock) cLock = setTimeout(CalibrationLoop,1);
	}
}




// run in the loop function
async function update(dt) {

	xv = (x-xprev)/dt
	yv = (y-yprev)/dt
	
	// in case of unexpected errors, restore the values of xvf and yvf
	if (isNaN(xvf)) xvf = 0;
	if (isNaN(yvf)) yvf = 0;
	
	
	yvf += (yv-yvf) * smoothing;
	xvf += (xv-xvf) * smoothing;
	
	//console.log(yvf + xvf);
	xprev = x
	yprev = y
	
	if (cursorPerturbation == "velocity"){
	
		// velocity magnitude in the direction of the force field
		let mag_force_dir = cartesian_distance(xvf,yvf) * Math.cos(Math.atan2(yvf,xvf) - targetAngle);
		
		// Update the displayed cursor on the screen
		xf = x + g * mag_force_dir * gX;
		yf = y - g * mag_force_dir * gY;
	}
	else if (cursorPerturbation == "rotation"){
		
		// Determine the point around which the rotation is made
		let rotationPoint;
		
		if (rotationPointStartingPoint == true){
			// Make the rotation around the axis of the starting point
			if ((trial+1)%2) rotationPoint = target1;
			else rotationPoint = target2;
		}
		else{
			// Always make the rotation around the axis of target2 (bottom target)
			rotationPoint = target2;
		}
		
		// angle from the rotation point at which the mouse coordinate is found
		let beta = Math.atan2(y - rotationPoint.yCor,x - rotationPoint.xCor);
		
		// Calculate the coordinates of the displayed cursor, which are at angle g from the mouse coordinates around the rotationPoint
		let coords = getCoordinatesAngle(beta - degToRad(g), cartesian_distance(y - rotationPoint.yCor,x - rotationPoint.xCor), rotationPoint.xCor, rotationPoint.yCor);
		
		xf = coords[0];
		yf = coords[1];
	}
	
	// Edge cases
	if (yf > canvas.height) {
		yf = canvas.height;
	}  

	else if (yf < 0) {
		yf = 0;
	}

	if (xf > canvas.width) {
		xf = canvas.width;
	}

	if (xf < 0) {
		xf = 0;
	}
	
	// Update feedback background color
	if (border_present){
		if (shortest_distance_line(xf,yf,target1.xCor,target1.yCor, target2.xCor,target2.yCor) <= midLine.yLen/2 - RADIUS) backgroundColor = "black";
		else backgroundColor = "#f5b7b1"; // Light red
		
		
	}
	
	
	// Check if the targets are reached:
	if (xf > target1.xCor - target1.xLen/2 - RADIUS && xf < target1.xCor + target1.xLen/2 + RADIUS && yf > target1.yCor - target1.yLen/2 - RADIUS && yf < target1.yCor + target1.yLen/2 + RADIUS){
	  target1.reached = true;
	}
	if (xf > target2.xCor - target2.xLen/2 - RADIUS && xf < target2.xCor + target2.xLen/2 + RADIUS && yf > target2.yCor - target2.yLen/2 - RADIUS && yf < target2.yCor + target2.yLen/2 + RADIUS){
	  target2.reached = true;
	}

	//tracker.textContent = "X position: " + xf.toFixed(2) + ", Y position: " + yf.toFixed(2);

	// Track variables to submit:
	
	xST.push(x.toFixed(2));
	yST.push(y.toFixed(2));
	xfST.push(xf.toFixed(2));
	yfST.push(yf.toFixed(2));
	timeST.push(time.toFixed(3));
	if (lastTrial < trial) {
		//startTrial = time.toFixed(3);
		trialTimeST.push(time.toFixed(3));
		
		lastTrial++;
	}
	
	
	
	// Check if the goal has been reached:
	if (target1.reached && target2.reached && !endTrial) {
	  endTrial = true;
	  endMovement = 0;
	  trialTargetReachedT.push(time.toFixed(3));
	  
	  if (time - startTrial < durMin/1000) targetColor = "#0000ff"; // blue
	  else if (time - startTrial > durMax/1000) targetColor = "#ff0000"; // red
	  else targetColor = "#00ff00"; // green
	  
	  canvasDraw();
	}
	
	// Consider end of movement
	if (endTrial){
		
		// Update time from which movement ended
		if (Math.abs(xvf + yvf) < endMovementThreshold){
			endMovement += dt;
		}
		else {
			endMovement = 0;
		}
		
		// end trial
		if (endMovement > 0.5) {
			endTrial = false;
			trial++;
			
			if (direction == "1way") startingTarget = 2; // always start from the bottom target
			else if (direction == "2way") startingTarget = 3 - startingTarget; // alternate between targets 1 and 2
			
			// Update the position of the targets
			target1.xCor = target1XCorS[trial-1];
			target1.yCor = target1YCorS[trial-1];
			target2.xCor = target2XCorS[trial-1];
			target2.yCor = target2YCorS[trial-1];
			updateMidLine();
			updateTargetAngle();
			backgroundColor = "black";
			
			trialEndST.push(time.toFixed(3));
			
			// increase g
			if (experiment && trial >= trialIncreaseG && trial <= trialStopIncreaseG) g += (gIncreased-g0)/(trialStopIncreaseG - trialIncreaseG + 1);
			
			// washout trials
			if (experiment && trial >= trialWashout) g = 0;
			
			if (rotationPointStartingPoint == false && cursorPerturbation == "rotation"){
				if (startingTarget == 1){
				
				  xf = target1.xCor;
				  yf = target1.yCor;
				  target2.reached = false;
				  target1.visible = false;
				  target2.visible = true;
				}
				else{
				  xf = target2.xCor;
				  yf = target2.yCor;
				  target1.reached = false;
				  target2.visible = false;
				  target1.visible = true;
				}
				// Always make the rotation around the axis of target2 (bottom target)
				rotationPoint = target2;
				
				// angle from the rotation point at which the mouse coordinate is found
				let beta = Math.atan2(yf - rotationPoint.yCor,xf - rotationPoint.xCor);
				
				// Calculate the coordinates of the displayed cursor, which are at angle g from the mouse coordinates around the rotationPoint
				let coords = getCoordinatesAngle(beta + degToRad(g), cartesian_distance(yf - rotationPoint.yCor,xf - rotationPoint.xCor), rotationPoint.xCor, rotationPoint.yCor);
				
				x = Math.round(coords[0]);
				y = Math.round(coords[1]);
			
			
			}
			else{
				if (startingTarget == 1){
				
				  x = target1.xCor;
				  xf = x;
				  y = target1.yCor;
				  yf = y;
				  target2.reached = false;
				  target1.visible = false;
				  target2.visible = true;
				}
				else{
				  x = target2.xCor;
				  xf = x;
				  y = target2.yCor;
				  yf = y;
				  target1.reached = false;
				  target2.visible = false;
				  target1.visible = true;
				}
			}
			wait = true;
			//document.removeEventListener("mousemove", mouseMoved, false);
			recordMouse = false;
			
			// Add to all subbission variables the temporary variables from the precedent trial
			xS = xS.concat(xST);
			yS = yS.concat(yST);
			xfS = xfS.concat(xfST);
			yfS = yfS.concat(yfST);
			timeS = timeS.concat(timeST);
			trialTimeS = trialTimeS.concat(trialTimeST);
			startMovementS = startMovementS.concat(startMovementST);
			trialTargetReached = trialTargetReached.concat(trialTargetReachedT);
			trialEndS = trialEndS.concat(trialEndST);
			startingXPositionS.push(startingXPositionST);
			startingYPositionS.push(startingYPositionST);
			stoppingXPositionS.push(xAbs.toFixed(3));
			stoppingYPositionS.push(yAbs.toFixed(3));
			//console.log(startingXPositionST + " , " + startingYPositionST);
			// Reinitialize the temporary variables for the next trial
			xST = []; 
			yST = [];
			xfST = [];
			yfST = [];
			timeST = [];
			trialTimeST = [];
			startMovementST = [];
			trialTargetReachedT =[];
			trialEndST = [];
			startingXPositionST = "";
			startingYPositionST = "";
			
			//wait = false;
			
			// continue if experiment is not over
			if (((experiment && trial <= maxTrials) || (preExperiment && trial <= maxTrialsPre)) && pointerLock) {
				if (direction == "2way"){
					if ((experiment && trial <= maxTrials) || (preExperiment && trial <= maxTrialsPre)){
						considerStartingPosition = true;
						startingXPositionST = xAbs.toFixed(3);
						startingYPositionST = yAbs.toFixed(3);
						//console.log(3);
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
					//console.log(0);
					window.requestAnimationFrame(loop);
				}
				else if (direction == "1way"){
					/*
					// Check if the distance traveled from the end position back to the starting position is less than 50% than the distance traveled towards the target
					// (Check if the participant lifted the mouse when he returned the mouse)
					if (trial > 2 && cartesian_distance(stoppingXPositionS[stoppingXPositionS.length - 2] - startingXPositionS[startingXPositionS.length - 1] , stoppingYPositionS[stoppingYPositionS.length - 2] - startingYPositionS[startingYPositionS.length - 1]) < 
						0.8 * cartesian_distance(stoppingXPositionS[stoppingXPositionS.length - 1] - startingXPositionS[startingXPositionS.length - 1] , stoppingYPositionS[stoppingYPositionS.length - 1] - startingYPositionS[startingYPositionS.length - 1])){
							
							// Record the trials in which the participant lifted the mouse
							if (preExperiment) mouseLiftedTrials.push(trial - 2);
							else if (experiment) mouseLiftedTrials.push(maxTrialsPre + trial - 2);
							
							// Display warning message;
							warningDontLiftMouse();
							
							setTimeout(returnMouseF, 2000);
						}
					else returnMouseF();
					*/
					
					returnMouseF();
				}
			}
			
			
		}
	}
}

// Timeout the participant from the experiment after "timeout" time has passed without moving
function timeoutLoop(){
	if (!timeoutInProgress){
		exitLock = setTimeout(exitTimeoutF, timeout);
		timeoutInProgress = true;
	}
	if (mouseToReturn) setTimeout(timeoutLoop, 500);
}

// Display the mouse return screen when direction == "1way"
function returnMouseF(){
	
	canvasReturnMouse();
	//clearTimeout(exitLock);
	
	mouseToReturn = true; // make the next trial start when canvas is clicked
	
	timeoutLoop();
}
