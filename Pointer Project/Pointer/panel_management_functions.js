///////////////////////////////////////Experimental phases //////////////////////////////////////////////////////


function showInfo(){
	document.getElementById("consent_form").style.display = "none";
	document.getElementById("pre-general").style.display = "block";
}


// Move from the intro screen to the general screen (where you can set up parameters)
function startGeneral(){
	document.getElementById("pre-general").style.display = "none";
	
	if (document.getElementById("runExperiment").checked) infoCalibration();
	else document.getElementById("general").style.display = "block";
	
}

// Used especially for debugging (skip calibration phase and go directly in the training/experiment)
function start(){
	g0 = parseFloat(document.getElementById("g0").value);
	gIncreased = parseFloat(document.getElementById("gMax").value);
	maxTrials = parseInt(document.getElementById("numTrials").value, 10);
	maxTrialsPre = parseInt(document.getElementById("numPreTrials").value, 10);
	//maxCalibration = parseInt(document.getElementById("numCalibration").value, 10);
	//calibrationTrialRecord = parseInt(document.getElementById("calibrationTrialRecord").value, 10);
	trialIncreaseG = parseInt(document.getElementById("startIncreaseG").value, 10);
	trialWashout = parseInt(document.getElementById("trialWashout").value, 10);
	trialStopIncreaseG = parseInt(document.getElementById("stopIncreaseG").value, 10);
	durMin = parseInt(document.getElementById("minTime").value, 10);
	durMax = parseInt(document.getElementById("maxTime").value, 10);
	mouseSpeed = parseFloat(document.getElementById("mouseSpeed").value);
	desired_displacement = parseFloat(document.getElementById("desired_displacement").value); //cm
	timeout = parseInt(document.getElementById("timeout").value, 10);
	RADIUS = parseFloat(document.getElementById("RADIUS").value);
	targetSize = parseFloat(document.getElementById("targetSize").value);
	verticalLineSize = parseFloat(document.getElementById("verticalLineSize").value);
	smoothing = parseFloat(document.getElementById("smoothing").value); // between 0 and 1 ; lower values means more smoothing
	calibrationVariation = parseFloat(document.getElementById("calVar").value);
	calibrationVariation2 = parseFloat(document.getElementById("calVar2").value);
	border_present = document.getElementById("border_present").checked;
	
	g = g0;
	target1.xLen = targetSize;
	target1.yLen = targetSize;
	target2.xLen = targetSize;
	target2.yLen = targetSize;
	midLine.yLen = verticalLineSize;
	borderLine.yLen = verticalLineSize + border_dimension;
	//target1.xCor = 670 - targetSize/2;
	//target2.xCor = 670 - targetSize/2;
	if (maxTrialsPre == 0) startExperiment();
	else startPreExperiment();
}

// Display instructions for calibration
function infoCalibration() {
	document.getElementById("general").style.display = "none";
	document.getElementById("cal").style.display = "block";

}	

// Display the calibration window
function startCalibration() {
	calibration = true;
	calibration_acceleration = false;
	
	document.getElementById("general").style.display = "none";
	document.getElementById("cal").style.display = "none";
	//document.getElementById("pre1").style.display = "none";
	document.getElementById("calibration").style.display = "block";
	document.getElementById("screen").style.display = "block";
	
	g0 = parseFloat(document.getElementById("g0").value);
	gIncreased = parseFloat(document.getElementById("gMax").value);
	maxTrials = parseInt(document.getElementById("numTrials").value, 10);
	maxTrialsPre = parseInt(document.getElementById("numPreTrials").value, 10);
	//maxCalibration = parseInt(document.getElementById("numCalibration").value, 10);
	//calibrationTrialRecord = parseInt(document.getElementById("calibrationTrialRecord").value, 10);
	trialIncreaseG = parseInt(document.getElementById("startIncreaseG").value, 10);
	trialWashout = parseInt(document.getElementById("trialWashout").value, 10);
	trialStopIncreaseG = parseInt(document.getElementById("stopIncreaseG").value, 10);
	durMin = parseInt(document.getElementById("minTime").value, 10);
	durMax = parseInt(document.getElementById("maxTime").value, 10);
	desired_displacement = parseFloat(document.getElementById("desired_displacement").value); //cm
	timeout = parseInt(document.getElementById("timeout").value, 10);
	RADIUS = parseFloat(document.getElementById("RADIUS").value);
	targetSize = parseFloat(document.getElementById("targetSize").value);
	verticalLineSize = parseFloat(document.getElementById("verticalLineSize").value);
	smoothing = parseFloat(document.getElementById("smoothing").value); // between 0 and 1 ; lower values means more smoothing
	calibrationVariation = parseFloat(document.getElementById("calVar").value);
	calibrationVariation2 = parseFloat(document.getElementById("calVar2").value);
	border_present = document.getElementById("border_present").checked;
	
	updateCheckboxValues(); // Select experiment type (target positions)
	//fillTargetCoordinates(); // depending on the experiment type, fill target coordinates
	
	
	g = g0;
	target1.xLen = targetSize;
	target1.yLen = targetSize;
	target2.xLen = targetSize;
	target2.yLen = targetSize;
	midLine.yLen = verticalLineSize;
	borderLine.yLen = verticalLineSize + border_dimension;
	//target1.xCor = 670 - targetSize/2;
	//target2.xCor = 670 - targetSize/2;
	//mouseSpeed = parseFloat(document.getElementById("mouseSpeed").value);
	
	calibrationDistance = 0;
	x=0;
	y=0;
	trial = 1;
	// Update the position of the targets
	target1.xCor = target1XCorS[trial-1];
	target1.yCor = target1YCorS[trial-1];
	target2.xCor = target2XCorS[trial-1];
	target2.yCor = target2YCorS[trial-1];
	updateMidLine();
	updateTargetAngle();
	
	
	vCal1 = [];
	vCal2 = [];
	vAvgCal1 = 0;
	vAvgCal2 = 0;
	targetColor = "#00ff00"; // green
	//yPointerCalibration = 100;
	//xPointerCalibration = 590;
	motionDownF();
	canvasDraw();
	calibrationDistanceArr = [0,0,0];
	calibrationSpeed = 2.3;
}

function startCalibrationAcceleration(){
	calibration = true;
	calibration_acceleration = true;
	
	document.getElementById("cal2").style.display = "none";
	document.getElementById("general").style.display = "none";
	document.getElementById("calibration").style.display = "block";
	document.getElementById("screen").style.display = "block";
	
	x=0;
	y=0;
	trial = 1;
	motionDownF();
	vCal2 = [];
	vAvgCal2 = 0;
	canvasDraw();
	calibrationDistanceArr2 = [0,0,0];
	calibrationSpeed = 6;
}

// Display the training window
function startPreExperiment() {
	document.getElementById("pre1").style.display = "none";
	document.getElementById("general").style.display = "none";
	document.getElementById("calibration").style.display = "none";
	document.getElementById("preExperiment").style.display = "block";
	document.getElementById("screen").style.display = "block";
	
	
	updateCheckboxValues(); // Select experiment type (target positions)
	fillTargetCoordinates(maxTrialsPre); // depending on the experiment type, fill target coordinates
	document.getElementById("target1XCor").value = target1XCorS;
	document.getElementById("target1YCor").value = target1YCorS;
	document.getElementById("target2XCor").value = target2XCorS;
	document.getElementById("target2YCor").value = target2YCorS;
	
	firstTime = true;
	preExperiment = true;
	calibration = false;
	calibration_acceleration = false;
	wait = false;
	lastTrial = 0;
	
	//if (mouseSpeed == 1) mouseSpeed = (target2.yCor - target1.yCor) / ((calibrationDistance/(maxCalibration-calibrationTrialRecord)) * (desired_displacement/8.5)); // calibrate mouse speed
	//if (mouseSpeed == 1) mouseSpeed = (target2.yCor - target1.yCor) / ((calibrationDistance) * (desired_displacement/5.4)); // calibrate mouse speed
	if (mouseSpeed == 1) mouseSpeed = (midLineLen) / ((calibrationDistance) * (desired_displacement/8.5)); // calibrate mouse speed
	
	document.getElementById("cellMouseSpeed").innerHTML = mouseSpeed.toFixed(4);
	document.getElementById("cellMouseSpeed2").innerHTML = mouseSpeed.toFixed(4);
	//document.getElementById("nbExp").innerHTML = maxTrials;
	//document.getElementById("nbPreExp").innerHTML = maxTrialsPre;
	//document.getElementById("nbExp2").innerHTML = maxTrials;
	//document.getElementById("nbPreExp2").innerHTML = maxTrialsPre;
	trial = 1;
	// Update the position of the targets
	target1.xCor = target1XCorS[trial-1];
	target1.yCor = target1YCorS[trial-1];
	target2.xCor = target2XCorS[trial-1];
	target2.yCor = target2YCorS[trial-1];
	updateMidLine();
	updateTargetAngle();
	
	startingTarget = 2;
	
	// Reinitialize positions:
	initializeTrial();
}

// Display the experiment window
function startExperiment() {
	document.getElementById("pre1").style.display = "none";
	document.getElementById("general").style.display = "none";
	document.getElementById("calibration").style.display = "none";
	document.getElementById("preExperiment").style.display = "none";
	document.getElementById("experiment").style.display = "block";
	document.getElementById("exp").style.display = "none";
	document.getElementById("screen").style.display = "block";
	
	document.getElementById("cellMouseSpeed").innerHTML = mouseSpeed.toFixed(4);
	document.getElementById("cellMouseSpeed2").innerHTML = mouseSpeed.toFixed(4);
	//document.getElementById("nbExp").innerHTML = maxTrials;
	//document.getElementById("nbPreExp").innerHTML = maxTrialsPre;
	//document.getElementById("nbExp2").innerHTML = maxTrials;
	//document.getElementById("nbPreExp2").innerHTML = maxTrialsPre;
	
	updateCheckboxValues(); // Select experiment type (target positions)
	fillTargetCoordinates(maxTrials); // depending on the experiment type, fill target coordinates
	
	//await sleep(5000);
	
	preExperiment = false;
	calibration = false;
	calibration_acceleration = false;
	experiment = true;
	trial = 1;
	// Update the position of the targets
	target1.xCor = target1XCorS[trial-1];
	target1.yCor = target1YCorS[trial-1];
	target2.xCor = target2XCorS[trial-1];
	target2.yCor = target2YCorS[trial-1];
	updateMidLine();
	updateTargetAngle();
	startingTarget = 2;
	lastTrial = 0;
	
	//time0 = 0;
	wait = false;
	firstTimeExp = true;
	firstTime = false;
	
	// Reinitialize positions:
	initializeTrial();
	
	//if (pointerLock) window.requestAnimationFrame(loop);
}

// Display the window after the experiment (where you need to submit the data)
function finishExperiment() {
	document.getElementById("experiment").style.display = "none";
	document.getElementById("screen").style.display = "none";
	
	//a = [12.34, 14.155, 56.25];
	//trial = -10000;
	experiment = false;
	//document.removeEventListener("mousemove", mouseMoved, false);
	recordMouse = false;
	document.removeEventListener('pointerlockchange', lockChangeAlert, false);
	document.removeEventListener('mozpointerlockchange', lockChangeAlert, false);
	//closeFullscreen();
	
	// Save variables to submit
	document.getElementById("g0").value = g0;
	document.getElementById("gMax").value = gIncreased;
	document.getElementById("numPreTrials").value = maxTrialsPre;
	document.getElementById("numTrials").value = maxTrials;
	document.getElementById("startIncreaseG").value = trialIncreaseG;
	document.getElementById("stopIncreaseG").value = trialStopIncreaseG;
	document.getElementById("x").value = xS;
	document.getElementById("xf").value = xfS;
	document.getElementById("y").value = yS;
	document.getElementById("yf").value = yfS;
	document.getElementById("time").value = timeS;
	document.getElementById("trialTime").value = trialTimeS;
	document.getElementById("startMovement").value = startMovementS;
	document.getElementById("trialTargetReached").value = trialTargetReached;
	document.getElementById("trialEnd").value = trialEndS;
	document.getElementById("mouseSpeed").value = mouseSpeed.toFixed(4);
	//document.getElementById("n").value = xS;
	document.getElementById("target1XCor").value = document.getElementById("target1XCor").value +','+target1XCorS;
	document.getElementById("target1YCor").value = document.getElementById("target1YCor").value +','+target1YCorS;
	document.getElementById("target2XCor").value = document.getElementById("target2XCor").value +','+target2XCorS;
	document.getElementById("target2YCor").value = document.getElementById("target2YCor").value +','+target2YCorS;
	document.getElementById("startingXPosition").value = startingXPositionS;
	document.getElementById("startingYPosition").value = startingYPositionS;	
	document.getElementById("stoppingXPosition").value = stoppingXPositionS;
	document.getElementById("stoppingYPosition").value = stoppingYPositionS;
	document.getElementById("mouseLiftedTrials").value = mouseLiftedTrials;
	
	//document.getElementById("submitForm").style.display = "block";
	
	
	document.getElementById("submit").click();
}

// Submit experiment
function submitExperiment(){
	document.getElementById("submit").click();
}

// make the canvas fullscreen
function openFullscreen(panel) {
  if (panel.requestFullscreen) {
    panel.requestFullscreen();
  } else if (panel.mozRequestFullScreen) { /* Firefox */
    panel.mozRequestFullScreen();
  } else if (panel.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    panel.webkitRequestFullscreen();
  } else if (panel.msRequestFullscreen) { /* IE/Edge */
    panel.msRequestFullscreen();
  }
}

// exit fullscreen from the canvas
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

////////////////////////////////////////////// Buttons/checkboxes management /////////////////////////////////////////////////////////////

// Update hidden checkbox; Used for the submission of the data so that it sends border_present="true" if border is present and border_present="false" when not
function checkOffBorder(){
	if (document.getElementById("border_present").checked == false) document.getElementById("border_present_no").checked = true;
	else document.getElementById("border_present_no").checked = false;
}


// In the intro screen, only enable the button to proceed in the experiment when all three checkboxes are checked in the first screen
function preRequisites() {
  // Get the checkbox
  var chrome = document.getElementById("chrome");
  var audioOn = document.getElementById("audioON");
  var acceleration = document.getElementById("acceleration");

  // If the checkbox is checked, display the output text
  if (chrome.checked == true && audioON.checked == true && acceleration.checked == true){
    document.getElementById("startGeneral").disabled = false;	
  } else {
    document.getElementById("startGeneral").disabled = true;
  }
} 

