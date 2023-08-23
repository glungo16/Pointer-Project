function [g, timeOptimal, vyOptimal] = ideal_movement(g0, gMax, startIncreaseG,stopIncreaseG, trialWashout, numPreTrials, numTrials, maxDur, meanDur, target1XCor, target1YCor, target2XCor, target2YCor)

%% Optain g at each trial
g = zeros([1, numPreTrials+numTrials]);

for i=1:numPreTrials+startIncreaseG-1
    g(i) = g0;
end

for i=numPreTrials+startIncreaseG:numPreTrials+stopIncreaseG
    g(i) = g(i-1) + gMax/(stopIncreaseG - startIncreaseG + 1);
end

if trialWashout < numTrials
    for i=numPreTrials+stopIncreaseG+1:numPreTrials+trialWashout-1 
        g(i) = g(i-1);
    end
    
    for i=numPreTrials+trialWashout:numPreTrials+numTrials
        g(i) = g0;
    end
    
else
    for i=numPreTrials+stopIncreaseG+1:numPreTrials+numTrials
        g(i) = g(i-1);
    end
end

%% Determine the optimal position

timeOptimal = 0:0.010:maxDur;

vyOptimal = quadratic(timeOptimal, maxDur);

% 
% figure(1);
% clf;
% 
% plot(timeOptimal, vyOptimal);
target1 = [670 110];
target2 = [670 490];

yStart = target1(2);
yStop = target2(2);

yOptimalS = zeros([1 length(timeOptimal)]);

yOptimalS(1) = yStart;


for i=2:length(timeOptimal)
    yOptimalS(i) = yOptimalS(i-1) + vyOptimal(i)*0.010;
end
% 
% figure(2);
% clf;
% 
% plot(timeOptimal, yOptimalS);


xOptimal = zeros([numPreTrials+numTrials length(timeOptimal)]);
yOptimal = zeros([numPreTrials+numTrials length(timeOptimal)]);

for i=1:numPreTrials+numTrials
    yOptimal(i,:) = yOptimalS;
    
    xOptimal(i,1) = target1(1);
    
    if mod(i,2) == 1
        sign = -1;
    else
        sign = 1;
    end
    
    for j=2:length(timeOptimal)
        xOptimal(i,j) = xOptimal(i,1) + sign*g(i)*vyOptimal(j);
    end
end
% 
% figure(3);
% clf;
% 
% plot(xOptimal(160,:), yOptimal(160,:));

vyOptimalS = vyOptimal;
vyOptimal = zeros([numPreTrials+numTrials, length(timeOptimal)]);

for i=1:numPreTrials+numTrials
    vyOptimal(i,:) = vyOptimalS;
end

end

function v = quadratic(timeOptimal, maxDur)

v = zeros([1 length(timeOptimal)]);
vScale = 0.32;
for i=1:length(timeOptimal)
    v(i) = vScale*max(-10000*power(timeOptimal(i) - (maxDur(1))/2,2) + 2000, 0);
end


end