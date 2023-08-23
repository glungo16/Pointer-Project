function [age, other,g0,gMax,numPreTrials,numTrials,startIncreaseG,stopIncreaseG, trialWashout, minTime, maxTime, desired_displacement, mouseSpeed, timeout, RADIUS, targetSize, verticalLineSize, smoothing, calVar, outFile, cursorPerturbation, rotationPoint, targetPositions, direction, border_present, x,xf,y,yf,time,trialTime,startMovement, trialTargetReached, trialEnd, browserName, fullVersion, majorVersion, appName, userAgent, OSName, target1XCor, target1YCor, target2XCor, target2YCor, startingXPosition, startingYPosition, stoppingXPosition, stoppingYPosition] = data

d = fileread('rotation_prolific2.txt');
%d = fileread('test.txt');

d = string(d);
d = splitlines(d);

age = zeros([1 length(d)-1]);
other = strings([1 length(d)-1]);
g0 = zeros([1 length(d)-1]);
gMax = zeros([1 length(d)-1]);
numPreTrials = zeros([1 length(d)-1]);
numTrials = zeros([1 length(d)-1]);
startIncreaseG = zeros([1 length(d)-1]);
stopIncreaseG = zeros([1 length(d)-1]);
trialWashout = zeros([1 length(d)-1]);
minTime = zeros([1 length(d)-1]);
maxTime = zeros([1 length(d)-1]);
desired_displacement = zeros([1 length(d)-1]);
mouseSpeed = zeros([1 length(d)-1]);
timeout = zeros([1 length(d)-1]);
RADIUS = zeros([1 length(d)-1]);
targetSize = zeros([1 length(d)-1]);
verticalLineSize = zeros([1 length(d)-1]);
smoothing = zeros([1 length(d)-1]);
calVar = zeros([1 length(d)-1]);
outFile = strings([1 length(d)-1]);
cursorPerturbation = strings([1 length(d)-1]);
rotationPoint = strings([1 length(d)-1]);
targetPositions = strings([1 length(d)-1]);
direction = strings([1 length(d)-1]);
border_present = strings([1 length(d)-1]);
x = zeros([length(d)-1 100000]);
xf = zeros([length(d)-1 100000]);
y = zeros([length(d)-1 100000]);
yf = zeros([length(d)-1 100000]);
time = zeros([length(d)-1 100000]);
trialTime = zeros([length(d)-1 1000]);
startMovement = zeros([length(d)-1 1000]);
trialTargetReached = zeros([length(d)-1 1000]);
trialEnd = zeros([length(d)-1 1000]);
browserName = strings([1 length(d)-1]);
fullVersion = strings([1 length(d)-1]);
majorVersion = strings([1 length(d)-1]);
appName = strings([1 length(d)-1]);
userAgent = strings([1 length(d)-1]);
OSName = strings([1 length(d)-1]);
target1XCor = zeros([length(d)-1 1000]);
target1YCor = zeros([length(d)-1 1000]);
target2XCor = zeros([length(d)-1 1000]);
target2YCor = zeros([length(d)-1 1000]);
startingXPosition = zeros([length(d)-1 1000]);
startingYPosition = zeros([length(d)-1 1000]);
stoppingXPosition = zeros([length(d)-1 1000]);
stoppingYPosition = zeros([length(d)-1 1000]);

for i=1:length(d)-1
    txt = string(d(i));
    
    %strlength(txt);
    inputs = split(txt, "&");
    %inputs
    age(i) = str2double(extractAfter(inputs(startsWith(inputs,"age=")), "="));
    
    other(i) = replace(extractAfter(inputs(startsWith(inputs,"other=")), "="), "+", " ");
    
    g0(i) = str2double(extractAfter(inputs(startsWith(inputs,"g0=")), "="));
    
    gMax(i) = str2double(extractAfter(inputs(startsWith(inputs,"gMax=")), "="));
    
    numPreTrials(i) = str2double(extractAfter(inputs(startsWith(inputs,"numPreTrials=")), "="));
    
    numTrials(i) = str2double(extractAfter(inputs(startsWith(inputs,"numTrials=")), "="));
    
    startIncreaseG(i) = str2double(extractAfter(inputs(startsWith(inputs,"startIncreaseG=")), "="));
    
    stopIncreaseG(i) = str2double(extractAfter(inputs(startsWith(inputs,"stopIncreaseG=")), "="));
    
    trialWashout(i) = str2double(extractAfter(inputs(startsWith(inputs,"trialWashout=")), "="));
    
    minTime(i) = str2double(extractAfter(inputs(startsWith(inputs,"minTime=")), "="));
    
    maxTime(i) = str2double(extractAfter(inputs(startsWith(inputs,"maxTime=")), "="));
    
    desired_displacement(i) = str2double(extractAfter(inputs(startsWith(inputs,"desired_displacement=")), "="));
    
    mouseSpeed(i) = str2double(extractAfter(inputs(startsWith(inputs,"mouseSpeed=")), "="));
    
    timeout(i) = str2double(extractAfter(inputs(startsWith(inputs,"timeout=")), "="));
    
    RADIUS(i) = str2double(extractAfter(inputs(startsWith(inputs,"RADIUS=")), "="));
    
    targetSize(i) = str2double(extractAfter(inputs(startsWith(inputs,"targetSize=")), "="));
    
    verticalLineSize(i) = str2double(extractAfter(inputs(startsWith(inputs,"verticalLineSize=")), "="));
    
    smoothing(i) = str2double(extractAfter(inputs(startsWith(inputs,"calVar=")), "="));
    
    calVar(i) = str2double(extractAfter(inputs(startsWith(inputs,"calVar=")), "="));
    
    outFile(i) = replace(extractAfter(inputs(startsWith(inputs,"outFile=")), "="), "+", " ");
    
    cursorPerturbation(i) = replace(extractAfter(inputs(startsWith(inputs,"cursorPerturbation=")), "="), "+", " ");
    
    rotationPoint(i) = replace(extractAfter(inputs(startsWith(inputs,"rotationPoint=")), "="), "+", " ");
    
    targetPositions(i) = replace(extractAfter(inputs(startsWith(inputs,"direction=")), "="), "+", " ");
    
    direction(i) = replace(extractAfter(inputs(startsWith(inputs,"direction=")), "="), "+", " ");
    
    border_present(i) = replace(extractAfter(inputs(startsWith(inputs,"border_present=")), "="), "+", " ");
    
    xT = split(extractAfter(inputs(startsWith(inputs,"x=")), "="), "%2C")';    
    x(i,1:length(xT)) = xT;  
    
    xfT = split(extractAfter(inputs(startsWith(inputs,"xf=")), "="), "%2C")';    
    xf(i,1:length(xfT)) = xfT; 
    
    yT = split(extractAfter(inputs(startsWith(inputs,"y=")), "="), "%2C")';    
    y(i,1:length(yT)) = yT; 
    
    yfT = split(extractAfter(inputs(startsWith(inputs,"yf=")), "="), "%2C")';    
    yf(i,1:length(yfT)) = yfT;
    
    timeT = split(extractAfter(inputs(startsWith(inputs,"time=")), "="), "%2C")';    
    time(i,1:length(timeT)) = timeT; 
    
    trialTimeT = split(extractAfter(inputs(startsWith(inputs,"trialTime=")), "="), "%2C")';    
    trialTime(i,1:length(trialTimeT)) = trialTimeT;
    
    startMovementT = split(extractAfter(inputs(startsWith(inputs,"startMovement=")), "="), "%2C")';    
    startMovement(i,1:length(startMovementT)) = startMovementT;
    
    trialTargetReachedT = split(extractAfter(inputs(startsWith(inputs,"trialTargetReached=")), "="), "%2C")';    
    trialTargetReached(i,1:length(trialTargetReachedT)) = trialTargetReachedT; 
    
    trialEndT = split(extractAfter(inputs(startsWith(inputs,"trialEnd=")), "="), "%2C")';    
    trialEnd(i,1:length(trialEndT)) = trialEndT; 
    
    browserName(i) = replace(extractAfter(inputs(startsWith(inputs,"browserName=")), "="), "+", " ");
    
    fullVersion(i) = replace(extractAfter(inputs(startsWith(inputs,"fullVersion=")), "="), "+", " ");
    
    majorVersion(i) = replace(extractAfter(inputs(startsWith(inputs,"majorVersion=")), "="), "+", " ");
    
    appName(i) = replace(extractAfter(inputs(startsWith(inputs,"appName=")), "="), "+", " ");
    
    userAgent(i) = replace(extractAfter(inputs(startsWith(inputs,"userAgent=")), "="), "+", " ");
    
    OSName(i) = replace(extractAfter(inputs(startsWith(inputs,"OSName=")), "="), "+", " ");
    
    target1XCorT = split(extractAfter(inputs(startsWith(inputs,"target1XCor=")), "="), "%2C")';    
    target1XCor(i,1:length(target1XCorT)) = target1XCorT; 
    
    target1YCorT = split(extractAfter(inputs(startsWith(inputs,"target1YCor=")), "="), "%2C")';    
    target1YCor(i,1:length(target1YCorT)) = target1YCorT; 
    
    target2XCorT = split(extractAfter(inputs(startsWith(inputs,"target2XCor=")), "="), "%2C")';    
    target2XCor(i,1:length(target2XCorT)) = target2XCorT; 
    
    target2YCorT = split(extractAfter(inputs(startsWith(inputs,"target2YCor=")), "="), "%2C")';    
    target2YCor(i,1:length(target2YCorT)) = target2YCorT; 
    
    startingXPositionT = split(extractAfter(inputs(startsWith(inputs,"startingXPosition=")), "="), "%2C")';    
    startingXPosition(i,1:length(startingXPositionT)) = startingXPositionT; 
    
    startingYPositionT = split(extractAfter(inputs(startsWith(inputs,"startingYPosition=")), "="), "%2C")';    
    startingYPosition(i,1:length(startingYPositionT)) = startingYPositionT; 
    
    stoppingXPositionT = split(extractAfter(inputs(startsWith(inputs,"stoppingXPosition=")), "="), "%2C")';    
    stoppingXPosition(i,1:length(stoppingXPositionT)) = stoppingXPositionT; 
    
    stoppingYPositionT = split(extractAfter(inputs(startsWith(inputs,"stoppingYPosition=")), "="), "%2C")';    
    stoppingYPosition(i,1:length(stoppingYPositionT)) = stoppingYPositionT; 
end
% 
% age
% other
% x(:, 1:5)
% xf(:, 1:5)
% y(:, 1:5)
% yf(:, 1:5)
% time(:, 1:5)
% trialTime(:, 1:5)

end