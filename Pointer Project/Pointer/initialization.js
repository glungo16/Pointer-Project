//////////////// Global variables ////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////// All global variables are explained here. Please refer to this section when encountering unknown variables

////// Vars target to change from the interface webpage
var g0 = parseFloat(document.getElementById("g0").value); // initial g
var gIncreased = parseFloat(document.getElementById("gMax").value); // final g
var maxTrials = parseInt(document.getElementById("numTrials").value, 10); // number of trials in the experimental phase
var maxTrialsPre = parseInt(document.getElementById("numPreTrials").value, 10); // number of trials in the training phase
var trialIncreaseG = parseInt(document.getElementById("startIncreaseG").value, 10); // trial number at which g starts moving from initial g towards final g
var trialStopIncreaseG = parseInt(document.getElementById("stopIncreaseG").value, 10); // trial number at which g gets to final g
var trialWashout = parseInt(document.getElementById("trialWashout").value, 10); // trial number at which g returns to initial g (abruptly)
var durMin = parseInt(document.getElementById("minTime").value, 10); // lower bound threshold for the perfect duration to reach the target
var durMax = parseInt(document.getElementById("maxTime").value, 10); // upper bound threshold for the perfect duration to reach the target
var desired_displacement = parseFloat(document.getElementById("desired_displacement").value); // physical mouse distance between targets in cm
var timeout = parseInt(document.getElementById("timeout").value, 10); // time of permissible inactivity (no mouse movement) until you stop recording data from participant
var RADIUS = parseFloat(document.getElementById("RADIUS").value); // radius of the pointer on the canvas (in px)
var targetSize = parseFloat(document.getElementById("targetSize").value); // target square edge length (in px)
var verticalLineSize = parseFloat(document.getElementById("verticalLineSize").value); // width of the line connecting the target variables
var smoothing = parseFloat(document.getElementById("smoothing").value); // between 0 and 1 ; lower values means more smoothing
var calibrationVariation = parseFloat(document.getElementById("calVar").value); // maximum coefficient of variation in distance allowed to end the first calibration task
var calibrationVariation2 = parseFloat(document.getElementById("calVar2").value); // maximum coefficient of variation in distance allowed to end the first calibration task
var border_present = document.getElementById("border_present").checked; // when checked, pointer must follow the path comprised between the two border extremities (with background color feedback)
var mouseSpeed = 1; // initial mouse speed (the value is calibrated during the calibration phase to respect the desired_distance
var targetPositions = ""; // target positions on each trial (currently, there is "1dir" = targets fixed in 1 place; "3dir" = targets change positions such that there are 3 distinct movements)
var cursorPerturbation = ""; // type of perturbation affecting the cursor currently, there is "velocity" = velocity-dependent force field and "rotation" = visuomotor rotation around starting point
var rotationPointStartingPoint = false; // In the case of visuomotor rotation, determine the axis around which the rotation takes place (true = update to the starting point; false = always the bottom point)
var direction = ""; // The direction of movement between targets ("1way" = always from bottom target to upper target; "2way" = the end target becomes the starting target with each trial)
var timeoutType = ""; // If "pauseExp", after the timeout time, the screen will exit fullscreen mode and data stops being recorded until experiment is resumed; if "exitExp", end the experiment

// setup of the canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// Images loading on canvas
var cardPath = 'credit_card.png';
var creditCard = new Image();
creditCard.src = cardPath;

var mousePicPath = 'mouse.png';
var mousePic = new Image();
mousePic.src = mousePicPath;

////// Assigned value vars not modifiable from the interface webpage

// Target vars
// Original: (670, 100) ---- (670, 480)
var t1X = 670;
var t1Y = 100;
var t2X = 670;
var t2Y = 480;

// initial displayed mouse coordinates during calibration
var xPointerCalibration = 590;
var yPointerCalibration = 100;

var calibrationSpeed = 2.3; // calibration display mouse speed
var border_dimension = 5; // border width of the target connecting line when border_present is checked

var endMovementThreshold = 10; // maximum mouse velocity allowed for the mouse to be considered immobile (consider the participant has stopped moving)

var startingTarget = 2; // the starting target for one trial (target 2 = bottom target)

////// Canvas objects initialized
var target1 = new Rectangle(t1X,t1Y, targetSize, targetSize);
var target2 = new Rectangle(t2X,t2Y, targetSize, targetSize);
var midLine = new Rectangle(0,0, 0, verticalLineSize);
var borderLine = new Rectangle(0,0, 0, verticalLineSize + border_dimension);

updateMidLine();
target2.visible = false;
var midLineLen = Math.sqrt(Math.pow(target1.yCor - target2.yCor,2) + Math.pow(target1.xCor - target2.xCor,2));

var targetAngle = 0; // Inclination between the targets
updateTargetAngle();

////// Variable initializations

// Gain of g in the X and Y directions depending of targetAngle
var gX;
var gY;

var x = 0; // real x coordinate of the pointer (unmodified by the force field)
var y = 0; // real y coordinate of the pointer (unmodified by the force field)
var g = g0; // current g value (coefficient of the magnitude of the force field)
var lastRender = 0 // last time stamp used to calculate elapsed time
var xprev = 0 // last x coordinate of the pointer used to calculate displacement magnitude
var yprev = 0 // last y coordinate of the pointer used to calculate displacement magnitude
var xv = 0 // unsmoothed instant x velocity of the pointer
var yv = 0 // unsmoothed instant y velocity of the pointer
var yvf = 0 // smoothed instant y velocity of the pointer
var xvf = 0; // smoothed instant y velocity of the pointer
var xf = t1X; // displayed x coordinate of the pointer (modified by the force field)
var yf = t1Y; // displayed y coordinate of the pointer (modified by the force field)
var xAbs = 0; // abslute x coordinate during the experiment; used to determine the start/stop position at each trial
var yAbs = 0; // abslute y coordinate during the experiment; used to determine the start/stop position at each trial
var vCal1 = []; // instant velocity array during the first calibration task
var vCal2 = []; // instant velocity array during the second calibration task
var t0Cal = 0; // time 0 for calibration
var vAvgCal1 = 0; // average velocity during the first calibration task
var vAvgCal2 = 0; // average velocity during the second calibration task

var trial = 1; // current trial (for applies to calibration, training and experimental phase)
var lastTrial = 0; // keep track of start of new trial (used for updating trialTimeS[] array)
var endTrial = false; // checked when target has been reached in each trial -> consider end of movement
var endMovement = 0; // time passed since the participant has stopped moving the mouse (when mouse velocity < endMovementThreshold) after endTrial is checked 

var startTrial = 0; // time at which participant has started moving in each trial (used for the target color feedback when the target is reached)

// checked when awaiting to record the first movement in each trial (i.e. checked after participant is allowed to move until it first moved)
var startTimerPre = false; // for training phase
var startTimerExp = false; // for experimental phase

var time = 0; // current recorded time in the loop


var calibrationDistance = 0; // mouse distance travelled during the current calibration trial in the first calibration task
var calibrationDistance2 = 0; // mouse distance travelled during the current calibration trial in the second calibration task
var calibrationDistanceArr = [0, 0, 0]; // mouse distance travelled during the last 3 calibration trials in the first calibration task
var calibrationDistanceArr2 = [0, 0, 0]; // mouse distance travelled during the last 3 calibration trials in the second calibration task



// used to determine the first trial in...
var firstTime = false; // training phase
var firstTimeExp = false; // experimental phase

// updated later to the current time when recordings start in order for the time to be recorded from 0
var time0 = 0;
var time0DateNow = 0;
var lastMouseMovedStartingPosition = 0;

// Initial and default target and background colors. These colors change as a feedback mechanism
var targetColor = "#ffffff"; // white
var backgroundColor = "black";

var wait = false; // used to stop looping around and updating variables (especially during await executions)
var pointerLock = false; // checked if the pointer is locked on the canvas
var mouseToReturn = false; // used when direction == "1way" to make participant to start next trial when then click on the screen
var recordMouse = false; // if the program records the mouse movement during the experiment (except for the xAbs and yAbs)
var considerStartingPosition = false; // consider the interval when to record the starting position (from the moment the trial starts until the target turns white)

// used in the calibration phase to determine the movement of the displayed mouse
var motionDown = false;
var motionUp = false;
var motionEnd = false;



// For calibration: record the starting mouse coordinates (A) and the end mouse coordinates (C) on each trial
var Ax = 0;
var Ay = 0;
var Cx = 0;
var Cy = 0;


////////// Temporary Variables for submission; Used to save the data across one trial;  ST = submission temporary; 
var xST = []; // all x values
var yST = []; // all y values
var xfST = []; // all xf values
var yfST = []; // all yf values
var timeST = []; // all time stamp values
var trialTimeST = []; // time at which each trial starts
var startMovementST = []; // time at which first movement is made in each trial 
var trialTargetReachedT =[]; // time at which the target is first reached in each trial (when the target feedback color changes)
var trialEndST = []; // time at which each trial ends
var startingXPositionST = ""; // absolute X position at the the start of the current trial
var startingYPositionST = ""; // absolute Y position at the the start of the current trial

////////// Variables for submission; S = submission; array of all recorded values 
var xS = []; // all x values
var yS = []; // all y values
var xfS = []; // all xf values
var yfS = []; // all yf values
var timeS = []; // all time stamp values
var trialTimeS = []; // time at which each trial starts
var startMovementS = []; // time at which first movement is made in each trial 
var trialTargetReached =[]; // time at which the target is first reached in each trial (when the target feedback color changes)
var trialEndS = []; // time at which each trial ends
var startingXPositionS = []; // absolute X position at the start of each trial
var stoppingXPositionS = []; // absolute X position at the end of each trial
var startingYPositionS = []; // absolute Y position at the start of each trial
var stoppingYPositionS = []; // absolute Y position at the end of each trial
var mouseLiftedTrials = []; // trials in which the mouse was lifted

// target coordinates at each trial
var target1XCorS = [];
var target1YCorS = [];
var target2XCorS = [];
var target2YCorS = [];

///// Trackers
var exitLock; // tracker of the setTimeout function which calls the exitLockF() function which timeouts the participant
var timeoutInProgress = false; // ensures that the timeout is called at most once (so that timeout is not called with every loop iteration)
var cLock; // tracker of the setTimeout function which calls the loop() function 
var fullscreenPromptClick = false; // Text shown on canvas to click on the screen to start calibration/experiment
var doNotExitExp = false; // when true, exiting pointer lock/fullscreen will not cause disqualification from the experiment (when timeoutType == "exitExp")


// Current phase in the experiment
var calibration = true; // Calibration phase
var calibration_acceleration = false; // Stage to check if acceleration is turned off
var preExperiment = false; // Training phase
var experiment = false; // Experimental phase


// Tone variables (the "start movement" and the "reach target" feedback tones) 
var dingStart = document.getElementById("dingStart");
var dingEnd = document.getElementById("dingEnd");

// Instructional videos
var calVideo = document.getElementById("calVideo");
var expVideo = document.getElementById("expVideo");




//////////////// Browser info ////////////////////////////////////////////////////////////////////////////////////////////////

var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName  = navigator.appName;
var fullVersion  = ''+parseFloat(navigator.appVersion); 
var majorVersion = parseInt(navigator.appVersion,10);
var nameOffset,verOffset,ix;


// In Opera, the true version is after "Opera" or after "Version"
if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
 browserName = "Opera";
 fullVersion = nAgt.substring(verOffset+6);
 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
   fullVersion = nAgt.substring(verOffset+8);
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
 browserName = "Microsoft Internet Explorer";
 fullVersion = nAgt.substring(verOffset+5);
}
// In Chrome, the true version is after "Chrome" 
else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 browserName = "Chrome";
 fullVersion = nAgt.substring(verOffset+7);
}
// In Safari, the true version is after "Safari" or after "Version" 
else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
 browserName = "Safari";
 fullVersion = nAgt.substring(verOffset+7);
 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
   fullVersion = nAgt.substring(verOffset+8);
}
// In Firefox, the true version is after "Firefox" 
else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
 browserName = "Firefox";
 fullVersion = nAgt.substring(verOffset+8);
}
// In most other browsers, "name/version" is at the end of userAgent 
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
          (verOffset=nAgt.lastIndexOf('/')) ) 
{
 browserName = nAgt.substring(nameOffset,verOffset);
 fullVersion = nAgt.substring(verOffset+1);
 if (browserName.toLowerCase()==browserName.toUpperCase()) {
  browserName = navigator.appName;
 }
}
// trim the fullVersion string at semicolon/space if present
if ((ix=fullVersion.indexOf(";"))!=-1)
   fullVersion=fullVersion.substring(0,ix);
if ((ix=fullVersion.indexOf(" "))!=-1)
   fullVersion=fullVersion.substring(0,ix);

majorVersion = parseInt(''+fullVersion,10);
if (isNaN(majorVersion)) {
 fullVersion  = ''+parseFloat(navigator.appVersion); 
 majorVersion = parseInt(navigator.appVersion,10);
}
/*
document.write(''
 +'Browser name  = '+browserName+'<br>'
 +'Full version  = '+fullVersion+'<br>'
 +'Major version = '+majorVersion+'<br>'
 +'navigator.appName = '+navigator.appName+'<br>'
 +'navigator.userAgent = '+navigator.userAgent+'<br>'
)
*/
// OS used
// This script sets OSName variable as follows:
// "Windows"    for all versions of Windows
// "MacOS"      for all versions of Macintosh OS
// "Linux"      for all versions of Linux
// "UNIX"       for all other UNIX flavors 
// "Unknown OS" indicates failure to detect the OS

var OSName="Unknown OS";
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

//document.write('Your OS: '+OSName);

document.getElementById("browserName").value = browserName;
document.getElementById("fullVersion").value = fullVersion;
document.getElementById("majorVersion").value = majorVersion;
document.getElementById("appName").value = navigator.appName;
document.getElementById("userAgent").value = navigator.userAgent;
document.getElementById("OSName").value = OSName;

// Only allow experiment if the user uses Chrome
if (browserName == "Chrome") document.getElementById("chrome").checked = true;
else document.getElementById("chrome").checked = false;



//////////////// Manage display pannels ////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("experiment").style.display = "none";
document.getElementById("preExperiment").style.display = "none";
document.getElementById("screen").style.display = "none";
document.getElementById("submitForm").style.display = "none";
document.getElementById("pre1").style.display = "none";
//document.getElementById("pre2").style.display = "none";
document.getElementById("exp").style.display = "none";
document.getElementById("cal").style.display = "none";
document.getElementById("calibration").style.display = "none";
document.getElementById("general").style.display = "none";
document.getElementById("hide").style.display = "block";


// Hide certain buttons when the actual experiment is set update
if (document.getElementById("runExperiment").checked) runExperiment();

/////Used during debugging to directly display experiment
//document.getElementById("pre-general").style.display = "none";
//start();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Update hidden checkbox; Used for the submission of the data so that it sends border_present="true" if border is present and border_present="false" when not
checkOffBorder();

// In the intro screen, only enable the button to proceed in the experiment when all three checkboxes are checked in the first screen
preRequisites();

// Was used to display the mouse speed after calibration in order to simply input that value from the beginning and skip calibration during debugging
// No longer in effect (currently hidden field)
document.getElementById("cellMouseSpeed").innerHTML = mouseSpeed.toFixed(4);
document.getElementById("cellMouseSpeed2").innerHTML = mouseSpeed.toFixed(4);

// Used to display the number of trials in the training and experimental phase to the participant
//document.getElementById("nbExp").innerHTML = maxTrials;
//document.getElementById("nbPreExp").innerHTML = maxTrialsPre;
//document.getElementById("nbExp2").innerHTML = maxTrials;
//document.getElementById("nbPreExp2").innerHTML = maxTrialsPre;


// Draw on canvas
canvasDraw();

// pointer lock object forking for cross browser

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;


// lock pointer when clicking on canvas
canvas.onclick = function() {
	
	// if browser is in fullscreen
	if (document.fullscreenElement) {
		canvas.requestPointerLock();

		// start next trial when the canvas is clicked when direction == "1way"
		if (mouseToReturn){
			mouseToReturn = false;
			if (!firstTime && !firstTimeExp){
				// Check if the distance traveled from the end position back to the starting position is less than 50% than the distance traveled towards the target
				// (Check if the participant lifted the mouse when he returned the mouse)
				if (trial > 1 && cartesian_distance(stoppingXPositionS[stoppingXPositionS.length - 1] - xAbs , stoppingYPositionS[stoppingYPositionS.length - 1] - yAbs) < 
					0.65 * cartesian_distance(stoppingXPositionS[stoppingXPositionS.length - 1] - startingXPositionS[startingXPositionS.length - 1] , stoppingYPositionS[stoppingYPositionS.length - 1] - startingYPositionS[startingYPositionS.length - 1])){
						
						// Record the trials in which the participant lifted the mouse
						if (preExperiment) mouseLiftedTrials.push(trial - 1);
						else if (experiment) mouseLiftedTrials.push(maxTrialsPre + trial - 1);
						
						// Display warning message;
						warningDontLiftMouse();
						
						setTimeout(startNextTrial1Way, 2000);
					}
				else startNextTrial1Way();
			}
		}
	}
	// if browser is not fullscreen, open fullscreen and want for another click for pointer lock
	else{
		openFullscreen(canvas);
		fullscreenPromptClick = true;
		canvasDraw();
	}
  
};

// fullscreen instructional videos
calVideo.onclick = function() {
	openFullscreen(calVideo);
	
	if (calVideo.paused) 
		calVideo.play(); 
	else 
		calVideo.pause(); 
}

expVideo.onclick = function() {
	openFullscreen(expVideo);
	
	if (expVideo.paused) 
		expVideo.play(); 
	else 
		expVideo.pause(); 
}

// Make participant advance in the experiment after watching the calibration video
calVideo.onended = function() {
	closeFullscreen();
	document.getElementById("nextC").click();
};

// Make participant advance in the experiment after watching the training video
expVideo.onended = function() {
	closeFullscreen()
	document.getElementById("pre2").click();
};

// pointer lock event listeners

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);



//////////////////////////////////////////////// Get URL parameters ///////////////////////////////////////////////////////////////////

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has('PROLIFIC_PID')){
	document.getElementById("PROLIFIC_PID").value = urlParams.get('PROLIFIC_PID');
}

if (urlParams.has('STUDY_ID')){
	document.getElementById("STUDY_ID").value = urlParams.get('STUDY_ID');
}

if (urlParams.has('SESSION_ID')){
	document.getElementById("SESSION_ID").value = urlParams.get('SESSION_ID');
}