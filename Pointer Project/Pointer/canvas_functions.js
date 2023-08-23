function canvasDraw() {
	// Draw background
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	
	if (!calibration){
		

		/*
		// Draw targets
		ctx.fillStyle = targetColor;
		if (target1.visible) {
		  ctx.fillRect(target1.xCor, target1.yCor, target1.size, target1.size);
		}
		if (target2.visible) {
		  ctx.fillRect(target2.xCor, target2.yCor, target2.size, target2.size);
		}
			
		// Draw line
		ctx.fillStyle = "#ccffcc";
		ctx.fillRect(target1.xCor + (target1.size/2) - (verticalLineSize/2), target1.yCor + target1.size, verticalLineSize, target2.yCor - target1.yCor - target2.size);
		*/
		
		// Draw mid-line
		//updateTargetAngle();
		//updateMidLine();
		if (border_present){
			ctx.fillStyle = "#ccffcc"; // Cyan
			drawRect(borderLine,targetAngle, true);
			
			ctx.fillStyle = "#800080"; // Purple
			drawRect(midLine,targetAngle, true);
			
		}
		else{
			ctx.fillStyle = "#ccffcc"; // Cyan
			drawRect(midLine,targetAngle, true);
		}
		
		// Draw targets
		ctx.fillStyle = targetColor;
		if (target1.visible) {
		  drawRect(target1,targetAngle, true);
		}
		if (target2.visible) {
		  drawRect(target2,targetAngle, true);
		}
		
		// Draw cursor
		ctx.fillStyle = "#f00"; // Red
		ctx.beginPath();
		ctx.arc(xf, yf, RADIUS, 0, degToRad(360), true);
		ctx.fill();
		
		// draw text
		ctx.fillStyle = "#ffffff"; // white color
		ctx.font = "30px Verdana";
		
		// Don't display the trial number
		//if (preExperiment) ctx.fillText("Trial " + Math.min(trial, maxTrialsPre), 600, 50);
		//if (experiment) ctx.fillText("Trial " + Math.min(trial, maxTrials), 600, 50);
		
		
		
	}
	else{
		// draw text
		ctx.fillStyle = "#ffffff"; // white color
		ctx.font = "30px Verdana";
		// Don't display the trial number
		//ctx.fillText("Trial " + trial, 620, 50);
		
		// Draw dotted lines
		ctx.strokeStyle = '#FF0000'; // red color
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.lineDashOffset = 5;
		ctx.setLineDash([5, 15]);
		ctx.moveTo(450, 100);
		ctx.lineTo(750, 100);
		ctx.stroke();
		
		ctx.moveTo(450, 392);
		ctx.lineTo(750, 392);
		ctx.stroke();
		
		// Draw mouse 
		ctx.drawImage(mousePic, xPointerCalibration, yPointerCalibration - 10, 200, 220);
		
		// Draw credit card
		ctx.drawImage(creditCard, 450, 100, 185, 292);
	}
	
	if (fullscreenPromptClick){
		ctx.fillStyle = '#FF0000'; // red color
		ctx.fillText('When you are ready, press "click" on the mouse.', 280, 550);
		
		fullscreenPromptClick = false;
	}
		
}

// Draw a rotated rectangle (shortened version)
function drawRect(rectangle,alpha, center){
	drawRct(rectangle.xCor,rectangle.yCor,rectangle.xLen,rectangle.yLen,alpha, center)
}

// Draw a rotated rectangle
function drawRct(xCor,yCor,xLen,yLen,alpha, center){
	
	// Angle of the rectangle corner compared to +x axis (0 angle)
    var beta = Math.atan2(yCor,xCor);
    
	// Radius from canvas coordinates (0,0) to rectangle corner
    var r = Math.sqrt(Math.pow(xCor,2) + Math.pow(yCor,2));
    
	// Coordinates where rectangle should actually be plotted at 
	// in order to be display at the desired coordinates
    xReal = r*Math.cos(beta-alpha);
    yReal = r*Math.sin(beta-alpha);
	
    ctx.rotate(alpha);
	// Plot from the corner of the rectangle
	if (center == false) ctx.fillRect(xReal, yReal, xLen, yLen);
	// Plot from the center of the rectangle
	else ctx.fillRect(xReal-xLen/2, yReal-yLen/2, xLen, yLen);
    ctx.rotate(-alpha);
    return;
}

// Canvas drawing promting the participant to return the mouse to the starting point when direction == "1way"
function canvasReturnMouse(){
	// draw background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// draw text
	ctx.fillStyle = "#ffffff"; // white color
	ctx.font = "30px Verdana";
	//ctx.fillText("Trial " + Math.min(trial, maxTrials) + ", g = " + g.toFixed(4), 550, 50);
	ctx.fillText('Return the mouse to the starting point.', 350, 50);
	//ctx.fillText('Please make sure to always keep the mouse in contact with the table.', 140, 100);
	ctx.fillText('When you are ready, press "click" on the mouse.', 280, 150);
	
	// draw the starting point
	ctx.fillStyle = "#f00"; // Red
	ctx.beginPath();
	ctx.arc(target2.xCor, target2.yCor, 30, 0, degToRad(360), true);
	ctx.fill();
}

function warningDontLiftMouse(){
	// draw background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// draw text
	ctx.fillStyle = "#f00"; // Red
	ctx.font = "30px Verdana";
	ctx.fillText('Please make sure to always keep the mouse in contact with the table.', 140, 100);
}


////////////////////////////////////////////////Pointer related functions ////////////////////////////////////////////////////////

// Running when the pointer gets locked/unlocked on/from the canvas
async function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
		  
	if (!pointerLock) {
		//openFullscreen();
		console.log('The pointer lock status is now locked');
		pointerLock = true;
		
		if (firstTime){
			targetColor = "#00ff00"; // green
			canvasDraw();
			//document.addEventListener("mousemove", absoluteMouseMoved, false);
			document.addEventListener("mousemove", mouseMoved, false);
			await sleep(500);
			targetColor = "#ffffff"; // white
			dingStart.play();
			await sleep(150);
			
			//setTimeout(dingStop, durMin - 200);
			startTimerPre = true;
			
			
			firstTime = false;
		}
		if (firstTimeExp){
			targetColor = "#00ff00"; // green
			canvasDraw();
			//document.addEventListener("mousemove", absoluteMouseMoved, false);
			document.addEventListener("mousemove", mouseMoved, false);
			await sleep(500);
			targetColor = "#ffffff"; // white
			//dingStart.play();
			await sleep(150);
			
			//setTimeout(dingStop, durMin - 200);
			startTimerExp = true;
			
			firstTimeExp = false;
		}
		
		if (calibration) {
			/*
			if (trial % 2 == 1) {
				xPointerCalibration = 590;
				yPointerCalibration = 392;
			}
			else{
				xPointerCalibration = 590;
				yPointerCalibration = 100;
			}
			*/
			//document.addEventListener("mousemove", absoluteMouseMoved, false);
			document.addEventListener("mousemove", mouseMoved, false);
			if (trial%2==1) setTimeout(motionDownF,200);
			if (trial%2==0) setTimeout(motionUpF,200);
			
			canvasDraw();
			await sleep(500);
			dingStart.play();
			await sleep(150);
			
			//startTimerCal = true;
			//motionDown = true;
			//motionUp = false;
			
		}
		
		wait = false;
		endMovement = 0;
		recordMouse = true;
		window.requestAnimationFrame(loop);
		//document.addEventListener("mousemove", mouseMoved, false);
	}
	
  } 
  
	else {
		
		// exit experiment if participant tries pausing during experiment
		if (timeoutType == "exitExp" && doNotExitExp == false) exitTimeoutF();
		
		doNotExitExp = false;
		pointerLock = false;
		//closeFullscreen();
		clearTimeout(exitLock);
		clearTimeout(cLock);
		//timeoutInProgress = false;
		setTimeout(setTimeoutInProgress, 30)
		console.log('The pointer lock status is now unlocked'); 
		//document.removeEventListener("mousemove", mouseMoved, false);
		recordMouse = false;
		
		///// Render environment to the beginning of the trial
		
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
		
		// Reinitialize positions:
		initializeTrial();
		
		// When trial is resumed, do the initial routine (sounds, color change, etc.)
		if (preExperiment) firstTime = true;
		if (experiment) firstTimeExp = true;
		if (calibration){
			if (trial%2==1) motionDownF();
			if (trial%2==0) motionUpF();
		}
	}
}

// exit pointer lock after a certain period of inactivity
function setTimeoutInProgress(){
	clearTimeout(exitLock);
	timeoutInProgress = false;
}


function mouseMoved(e) {
	
	timeoutInProgress = false;
	clearTimeout(exitLock);
	
	yAbs += mouseSpeed*e.movementY;
	xAbs += mouseSpeed*e.movementX;
	
	if (considerStartingPosition){
		let currentMouseMovedStartingPosition = Date.now();
		let elapsedTime = currentMouseMovedStartingPosition - lastMouseMovedStartingPosition;
		
		if (elapsedTime > 50){
			startingXPositionST = xAbs.toFixed(3);
			startingYPositionST = yAbs.toFixed(3);
		}
		
		lastMouseMovedStartingPosition = currentMouseMovedStartingPosition;
	}
	
	if (recordMouse){
		
		if (!calibration){
			y += mouseSpeed*e.movementY;
			x += mouseSpeed*e.movementX;
			
			// Edge cases
			if (y > canvas.height) {
				y = canvas.height;
			}  
			
			else if (y < 0) {
				y = 0;
			}
			
			if (x > canvas.width) {
				x = canvas.width;
			}

			if (x < 0) {
				x = 0;
			}
			
			if (startTimerPre || startTimerExp){
				if (startTimerPre) setTimeout(dingStop, (durMin + durMax)/2 - 150);
				startTrial = (Date.now() - time0DateNow)/1000;
				startMovementST.push(time.toFixed(3));
				let currentMouseMovedStartingPosition = Date.now();
				let elapsedTime = currentMouseMovedStartingPosition - lastMouseMovedStartingPosition;
				if (elapsedTime > 50){
					startingXPositionST = xAbs.toFixed(3);
					startingYPositionST = yAbs.toFixed(3);
				}
				
				//startingXPositionST.push(xAbs.toFixed(3));
				//startingYPositionST.push(yAbs.toFixed(3));
				startTimerPre = false;
				startTimerExp = false;
			}
			//if (startTimerExp){
			//	startTrial = (Date.now() - time0DateNow)/1000;
			//	startMovementST.push(time.toFixed(3));
				//startingXPositionST.push(xAbs.toFixed(3));
				//startingYPositionST.push(yAbs.toFixed(3));
			//	startTimerExp = false;
			//}
		}
		// Executed during calibration
		else {
			let xOld = x;
			let yOld = y;
			y += mouseSpeed*e.movementY;
			x += mouseSpeed*e.movementX;
			let tNowCal = Date.now();
			
			// Record the instant velocity during calibration
			if (!calibration_acceleration) vCal1.push(cartesian_distance(x-xOld,y-yOld) / (tNowCal - t0Cal));
			else vCal2.push(cartesian_distance(x-xOld,y-yOld) / (tNowCal - t0Cal));
			
			/*
			if (startTimerCal){
				setTimeout(dingStop, durMin - 200);
				startTimerCal = false;
				x = 0;
				y = 0;
				endMovement = 0;
			}
			*/
		}
	}
}

/*
// always active; used to record the starting and stopping positions of the mouse
function absoluteMouseMoved(e) {
	timeoutInProgress = false;
	clearTimeout(exitLock);
	
	yAbs += mouseSpeed*e.movementY;
	xAbs += mouseSpeed*e.movementX;
}
*/

function exitLockF(){
	doNotExitExp = true;
	document.exitPointerLock();
}

function exitTimeoutF(){
	document.exitPointerLock();
	if (timeoutType == "exitExp" && !calibration) location.replace("./disqualified.html");
}