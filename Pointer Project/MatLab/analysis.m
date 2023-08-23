function analysis()

try

% Close all figures
close all;
    
[age, other,g0,gMax,numPreTrials,numTrials,startIncreaseG,stopIncreaseG, trialWashout, minTime, maxTime, desired_displacement, mouseSpeed, timeout, RADIUS, targetSize, verticalLineSize, smoothing, calVar, outFile, cursorPerturbation, rotationPoint, targetPositions, direction, border_present, x,xf,y,yf,time,trialTime,startMovement, trialTargetReached, trialEnd, browserName, fullVersion, majorVersion, appName, userAgent, OSName, target1XCor, target1YCor, target2XCor, target2YCor, startingXPosition, startingYPosition, stoppingXPosition, stoppingYPosition] = data;

cursorPerturbation = cursorPerturbation(1);
subjects = size(time);
subjects = subjects(1); % Number of subjects
lastIndexExp = zeros([1 subjects]); % Last timepoint index
%numTrials = find(trialStartTime(1,:) == 0, 2);
%numTrials = numTrials(2) -1; % Total number of trials
%midline = 670; % Midline on x-axis
numTrials = numTrials(1);
numPreTrials = numPreTrials(1);
startIncreaseG = startIncreaseG(1);
stopIncreaseG = stopIncreaseG(1);
trialWashout = trialWashout(1);
desired_displacement = desired_displacement(1);
g0 = g0(1);
gMax = gMax(1);
smoothing = smoothing(1); % Smoothing done on the velocity
smoothing_analysis = 0.15; % Smoothing done across trials (used in analysis)
minDur = minTime;
maxDur = maxTime;
trialStartTime = trialTime;
meanDur = (minDur + maxDur) / 2;
%trialWashout = numTrials +1;
target1 = [670 110];
target2 = [670 490];

% Subjects to look at
%sample_subject = 0;
sample_subject = 1;

% px to cm conversion coefficient
px2cm = cartesian(target1(1)-target2(1),target1(2)-target2(2)) / desired_displacement;


startMovementIndeces = getIndexTrialStage(startMovement, time, subjects, numTrials, numPreTrials);
trialStartTimeIndeces = getIndexTrialStage(trialStartTime, time, subjects, numTrials, numPreTrials);
trialTargetReachedIndeces = getIndexTrialStage(trialTargetReached, time, subjects, numTrials, numPreTrials);
trialEndIndeces = getIndexTrialStage(trialEnd, time, subjects, numTrials, numPreTrials);


indexStartExperiment = zeros([1 subjects]);

for i = 1:subjects
    lastIndexExpT = find(time(i,:) ==0, 2);
    lastIndexExp(i) = lastIndexExpT(2) - 1;
    
    indexStartExperimentT = find(time(i,:) == trialStartTime(i, 1 + numPreTrials));
    indexStartExperiment(i) = indexStartExperimentT(1);
end

% x-y Coordinates of the corresponding (optimal) position of the cursor on
% the line between targets
[xLine,yLine] = get_coordinates_on_line(x,y,subjects, target1XCor, target1YCor, target2XCor, target2YCor, trialStartTimeIndeces, trialEndIndeces);
[xfLine,yfLine] = get_coordinates_on_line(xf,yf,subjects, target1XCor, target1YCor, target2XCor, target2YCor, trialStartTimeIndeces, trialEndIndeces);





[vx, vy] = getVelocity(x, y, time, subjects, lastIndexExp); % Raw Velocities

vy_smooth = smooth(vy, smoothing); % Smoothed y velocity
vx_smooth = smooth(vx, smoothing); % Smoothed x velocity

% General Optimal movement (optimal position for standardized velocity)
[g, timeOptimal, vyOptimal] = ideal_movement(g0, gMax, startIncreaseG,stopIncreaseG, trialWashout, numPreTrials, numTrials, maxDur, meanDur, target1XCor, target1YCor, target2XCor, target2YCor);

% Individual Optimal movement (optimal position for participant's velocity)
[xOptimal_individual, yOptimal_individual] = ideal_movement_individual(xLine, yLine, vx_smooth, vy_smooth, g, trialStartTimeIndeces, trialEndIndeces, target1XCor, target1YCor, target2XCor, target2YCor, subjects);
%xOptimal_individual = ideal_movement_individual(vy_smooth, g, trialStartTimeIndeces, trialEndIndeces, midline);

% Indice of max velocity
[vxMax, vxMaxInd] = getMaxVelocityPerTrial(vx_smooth, startMovement, trialTargetReached, numTrials, subjects, numPreTrials, time);
[vyMax, vyMaxInd] = getMaxVelocityPerTrial(vy_smooth, startMovement, trialTargetReached, numTrials, subjects, numPreTrials, time);
[vMax, vMaxInd] = getMaxVelocityPerTrial(cartesian(vx_smooth,vy_smooth), startMovement, trialTargetReached, numTrials, subjects, numPreTrials, time);
%lastIndexExp

if cursorPerturbation == "rotation"
    
    angleErr = getRotationAngle(x,y,target2XCor,target2YCor,target1XCor,target1YCor, subjects, lastIndexExp, trialStartTimeIndeces, trialEndIndeces, xLine, yLine);
    angleErrF = getRotationAngle(xf,yf,target2XCor,target2YCor,target1XCor,target1YCor, subjects, lastIndexExp, trialStartTimeIndeces, trialEndIndeces, xfLine, yfLine);
    
    %% Trial-Deviation at peak velocity plot
    
    figure();
    clf;
    %plot(xf(1, 1:lastIndexExp(1)), yf(1, 1:lastIndexExp(1)));
    trialNumFig = [5 25 35 85 115 125 145 150 175] + numPreTrials + 1;
    %trialNumFig = [1 1 1 1 1 1 1 1 1] + numPreTrials + 1;
    for i=1:9
        subplot(3,3,i);
        hold on;
        for sub=1:length(sample_subject)
            if sample_subject(1) ~= 0
                plot(xf(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))), yf(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))));
                plot(xfLine(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))), yfLine(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))),'-.m');
            end
            xlim([350 950]);
        end
        hold off;
    
        title(strcat("X-Y displayed cursor at trial ", num2str(trialNumFig(i))));
        xlabel("x");
        ylabel("y");
    end
    
    deviationF = zeros([subjects, numPreTrials+numTrials]);
    deviation = zeros([subjects, numPreTrials+numTrials]);
    
    for i=1:subjects
        for j=1:numPreTrials+numTrials
            % Convert from rad to degrees
            deviationF(i,j) = rad2deg(angleErrF(i, vMaxInd(i,j)));
            deviation(i,j) = rad2deg(angleErr(i, vMaxInd(i,j)));
            %deviation(i,j) = abs(midline - xf(i, vyMaxInd(i,j)));
        end
    end

    % Mouse position
    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,deviation(sample_subject,:));
        %plot(xaxis,smooth(deviation(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(deviation,1));
        plot(xaxis,smooth(mean(deviation,1),smoothing_analysis));
    end
    
    plot(xaxis,g);
    %plot(xaxis, mean(deviation,1), 'Linewidth', 4);
    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    hold off;
    
    legend("Raw deviation","Smoothed deviation", "Ideal deviation");
    title("Deviation of mouse position from midline at peak velocity across trials");
    ylabel("Deviation (degrees)");
    xlabel("Trial Number");

    % Pointer position
    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,deviationF(sample_subject,:));
        %plot(xaxis,smooth(deviationF(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(deviationF,1));
        plot(xaxis,smooth(mean(deviationF,1),smoothing_analysis));
    end
    
    %plot(xaxis, mean(deviation,1), 'Linewidth', 4);
    yline(0,'--g');
    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    hold off;
    
    legend("Raw deviation","Smoothed deviation");
    title("Deviation of pointer position from midline at peak velocity across trials");
    ylabel("Deviation (degrees)");
    xlabel("Trial Number");
    
    %% Trial-Deviation at 100ms after start of movement plot

    deviationF = zeros([subjects, numPreTrials+numTrials]);
    deviation = zeros([subjects, numPreTrials+numTrials]);
    
    for i=1:subjects
        for j=1:numPreTrials+numTrials
            % Convert from rad to degrees
            deviationF(i,j) = rad2deg(angleErrF(i, startMovementIndeces(i,j) + 7)); % Appx 100ms after the start of movement
            deviation(i,j) = rad2deg(angleErr(i, startMovementIndeces(i,j) + 7)); % Appx 100ms after the start of movement
            %deviation(i,j) = abs(midline - xf(i, vyMaxInd(i,j)));
        end
    end

    % Mouse position
    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,deviation(sample_subject,:));
        %plot(xaxis,smooth(deviation(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(deviation,1));
        plot(xaxis,smooth(mean(deviation,1),smoothing_analysis));
    end
    
    plot(xaxis,g);
    %plot(xaxis, mean(deviation,1), 'Linewidth', 4);
    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    hold off;
    
    legend("Raw deviation","Smoothed deviation", "Ideal deviation");
    title("Deviation of mouse position from midline at 100ms after start of movement across trials");
    ylabel("Deviation (degrees)");
    xlabel("Trial Number");

    % Pointer position
    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,deviationF(sample_subject,:));
        %plot(xaxis,smooth(deviationF(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(deviationF,1));
        plot(xaxis,smooth(mean(deviationF,1),smoothing_analysis));
    end
    
    %plot(xaxis, mean(deviation,1), 'Linewidth', 4);
    yline(0,'--g');
    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    hold off;
    
    legend("Raw deviation","Smoothed deviation");
    title("Deviation of pointer position from midline at 100ms after start of movement across trials");
    ylabel("Deviation (degrees)");
    xlabel("Trial Number");
    
else
    %% X-Y plot
    figure();
    clf;
    %plot(xf(1, 1:lastIndexExp(1)), yf(1, 1:lastIndexExp(1)));
    trialNumFig = [5 25 35 85 115 125 145 150 175] + numPreTrials + 1;
    %trialNumFig = [1 1 1 1 1 1 1 1 1] + numPreTrials + 1;
    for i=1:9
        subplot(3,3,i);
        hold on;
        for sub=1:length(sample_subject)
            if sample_subject(1) ~= 0
                plot(xf(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))), yf(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))));
                plot(xfLine(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))), yfLine(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))),'-.m');
            end
            xlim([350 950]);
        end

        %plot(xOptimal(1,:), yOptimal(1,:),'-.m');
        %plot(xfLine(1,:), yfLine(1,:),'-.m');
        %plot(mean(xf(:, trialStartTimeIndeces(trialNumFig(i)):trialEndIndeces(trialNumFig(i))),1), mean(yf(:, trialStartTimeIndeces(trialNumFig(i)):trialEndIndeces(trialNumFig(i))),1), 'Linewidth', 4);

        hold off;

        title(strcat("X-Y displayed cursor at trial ", num2str(trialNumFig(i) - numPreTrials)));
        xlabel("x");
        ylabel("y");
    end

    figure();
    clf;
    % plot(xf(1, 1:lastIndexExp(1)), yf(1, 1:lastIndexExp(1)));
    % trialNumFig = [5 45 100 145 160 195];
    for i=1:9
        subplot(3,3,i);
        hold on;
        for sub=1:length(sample_subject)
            if sample_subject(1) ~= 0
                plot(x(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))), y(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))));
                %plot(xOptimal_individual(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))), yOptimal_individual(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))), '-.r');
                plot(xLine(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))), yLine(sample_subject(sub), trialStartTimeIndeces(sample_subject(sub), trialNumFig(i)):trialEndIndeces(sample_subject(sub), trialNumFig(i))),'-.m');

            end
            xlim([300 1200]);
        end
        %plot(xOptimal(trialNumFig(i),:), yOptimal(trialNumFig(i),:), '-.m');

        %plot(mean(xf(:, trialStartTimeIndeces(trialNumFig(i)):trialEndIndeces(trialNumFig(i))),1), mean(yf(:, trialStartTimeIndeces(trialNumFig(i)):trialEndIndeces(trialNumFig(i))),1), 'Linewidth', 4);

        hold off;

        title(strcat("X-Y mouse coordinates at trial ", num2str(trialNumFig(i))));
        xlabel("x");
        ylabel("y");
        %legend("Sub", "Opt p",...
        %    "Opt p+v");

    end

    %find(time(1,:) ==0, 4)
    %size(trialTime)
    %trialStartTime(1,2)
    %trialEnd(1,2)
    %% Time vs velocity && Time vs x-displacement
    figure();
    clf;

    if sample_subject(1) ~= 0
        j=1;
        for i=[2,4,6,8]
            subplot(4,4,j);
            hold on;
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), vx(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))));
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), vx_smooth(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))));
            title(strcat("X-velocity across time at trial ", num2str(trialNumFig(i))));
            xlabel("Time (s)");
            ylabel("Y velocity (px/s)");
            legend("Raw vel", "Smoothed vel");
            hold off; 
            j = j+1;

            subplot(4,4,j);
            hold on;
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), vy(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))));
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), vy_smooth(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))));
            title(strcat("Y-velocity across time at trial ", num2str(trialNumFig(i))));
            xlabel("Time (s)");
            ylabel("Y velocity (px/s)");
            legend("Raw vel", "Smoothed vel");
            hold off; 
            j = j+1;

            subplot(4,4,j);
            hold on;
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), x(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))));
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), xf(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))));
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), xfLine(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), '--r');
            hold off;
            title(strcat("X-displacement across time at trial ", num2str(trialNumFig(i))));
            xlabel("Time (s)");
            ylabel("X position (px)");
            %yline(midline,'--r');
            legend("Actual pos", "Displayed pos",'Location', 'SouthEast');
            j = j+1;

            subplot(4,4,j);
            hold on;
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), y(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))));
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), yf(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))));
            plot(time(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), yfLine(sample_subject(1), trialStartTimeIndeces(sample_subject(1), trialNumFig(i)):trialEndIndeces(sample_subject(1), trialNumFig(i))), '--r');
            hold off;
            title(strcat("Y-displacement across time at trial ", num2str(trialNumFig(i))));
            xlabel("Time (s)");
            ylabel("X position (px)");
            %yline(midline,'--r');
            legend("Actual pos", "Displayed pos",'Location', 'SouthEast');
            j = j+1;
        end
    end


    %% time-X plot
    figure();
    clf;
    plot(time(1, 1:lastIndexExp(1)), xf(1, 1:lastIndexExp(1)));
    % for i=1:10:numTrials
    %     xline(trialStartTime(1,i),'--r',{strcat('Trial ', num2str(i))});
    %     xline(trialEnd(1,i),'--g',{strcat('Trial ', num2str(i))});
    % end
    %xline(trialStartTime(1,numTrials),'--r',{strcat('Trial ', num2str(numTrials))});
    xline(trialStartTime(1,1),'--r',{'Pre-Trials 1'});
    %xline(trialStartTime(1,1 + numPreTrials),'--r',{'Pre-Trials 2'});
    xline(trialStartTime(1,1 + numPreTrials),'--r',{'Experiment'});
    xline(trialStartTime(1, numPreTrials + startIncreaseG),'--r',{'Start Increasing g'});
    xline(trialStartTime(1, numPreTrials + stopIncreaseG),'--r',{'Max g reached'});
    xline(trialStartTime(1, numPreTrials + trialWashout),'--r',{strcat('g=', num2str(g0))});

    for i=0:2
        xline(trialStartTime(1,numPreTrials + 100 +i),'--b',{strcat('Start Trial ', num2str(100+i))});
        xline(startMovement(1,numPreTrials + 100 +i),'--m',{'Start Movement'});
        xline(trialTargetReached(1,numPreTrials + 100 +i),'--r',{'Target Reached'});
        xline(trialEnd(1,numPreTrials + 100 +i),'--k',{'Trial end'});

    end

    title("X coordinate over time");
    xlabel("time (s)");
    ylabel("x");

    %% Mean squared error on x-axis
    MSS_displayed = SS_error_across_trials(numPreTrials,numTrials, subjects, time, startMovement, trialEnd, xfLine, xf, yfLine, yf);
    MSS_actual = SS_error_across_trials(numPreTrials,numTrials, subjects, time, startMovement, trialEnd, xfLine, x, yLine, y);

    max_MSS_displayed = max(max(MSS_displayed));
    max_MSS_actual = max(max(MSS_actual));
    max_MSS = max(max_MSS_displayed, max_MSS_actual);

    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;
    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,MSS_displayed(sample_subject,:));
        plot(xaxis,smooth(MSS_displayed(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(MSS_displayed,1));
        plot(xaxis,smooth(mean(MSS_displayed,1), smoothing_analysis));
    end
    hold off;
    title("Displayed MS error across trials");
    ylabel("Mean of squares");
    xlabel("Trial Number");
    ylim([1 max_MSS]);

    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});


    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;
    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,MSS_actual(sample_subject,:));
        plot(xaxis,smooth(MSS_actual(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(MSS_actual,1));
        plot(xaxis,smooth(mean(MSS_actual,1), smoothing_analysis));
    end
    hold off;
    title("Actual MS error across trials");
    ylabel("Mean of squares");
    xlabel("Trial Number");
    ylim([1 max_MSS]);

    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});

    %% Trial-Max Velocity plot

    
    %vMax = sqrt(power(vxMax, 2) + power(vyMax, 2));
    vMax = vyMax;

    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,vMax(sample_subject,:));
        plot(xaxis,smooth(vMax(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(vMax,1));
        plot(xaxis,smooth(mean(vMax,1), smoothing_analysis));
    end

    %plot(xaxis, mean(vMax,1), 'Linewidth', 4);
    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});

    plot(xaxis, max(vyOptimal,[],2), 'r', 'Linewidth', 3);
    hold off;

    title("Maximum velocity across trials");
    ylabel("Velocity");
    xlabel("Trial Number");

    %% Trial-duration plot

    duration = getDurationPerTrial(time, startMovement, trialTargetReached, numTrials, subjects, numPreTrials);

    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,duration(sample_subject,:));
        plot(xaxis,smooth(duration(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(duration,1));
        plot(xaxis,smooth(mean(duration,1), smoothing_analysis));
    end

    %plot(xaxis, mean(duration,1), 'Linewidth', 4);
    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    hold off;

    title("Experiment duration across trials");
    ylabel("Duration (s)");
    xlabel("Trial Number");

    %% Trial-Deviation at peak velocity plot

    deviationF = zeros([subjects, numPreTrials+numTrials]);
    deviation = zeros([subjects, numPreTrials+numTrials]);

    for i=1:subjects
        for j=1:numPreTrials+numTrials
            deviationF(i,j) = cartesian(xf(i, vyMaxInd(i,j)) - xfLine(i, vyMaxInd(i,j)), yf(i, vyMaxInd(i,j)) - yfLine(i, vyMaxInd(i,j)));
            deviation(i,j) = cartesian(x(i, vyMaxInd(i,j)) - xLine(i, vyMaxInd(i,j)), y(i, vyMaxInd(i,j)) - yLine(i, vyMaxInd(i,j)));
            %deviation(i,j) = abs(midline - xf(i, vyMaxInd(i,j)));
        end
    end

    % Mouse position
    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,deviation(sample_subject,:));
        plot(xaxis,smooth(deviation(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(deviation,1));
        plot(xaxis,smooth(mean(deviation,1),smoothing_analysis));
    end

    %plot(xaxis, mean(deviation,1), 'Linewidth', 4);
    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    hold off;

    title("Deviation of mouse position from midline at peak velocity across trials");
    ylabel("Deviation (px)");
    xlabel("Trial Number");

    % Pointer position
    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,deviationF(sample_subject,:));
        plot(xaxis,smooth(deviationF(sample_subject,:), smoothing_analysis));
    else
        plot(xaxis,mean(deviationF,1));
        plot(xaxis,smooth(mean(deviationF,1),smoothing_analysis));
    end

    %plot(xaxis, mean(deviation,1), 'Linewidth', 4);
    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    hold off;

    title("Deviation of pointer position from midline at peak velocity across trials");
    ylabel("Deviation (px)");
    xlabel("Trial Number");

    %% Deviation error on x-axis

    % Mean Deviation calculation of the actual movement
    mean_dev_displayed = Mean_Deviation_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xfLine, xf, yfLine, yf);
    mean_dev_actual = Mean_Deviation_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xLine, x, yLine, y);

    % Deviation calculation of a movement with no compensation
    %dev_displayed_no_comp = Mean_Deviation_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xfLine, xOptimal_individual, yfLine, yOptimal_individual);
    %dev_actual_no_comp = Mean_Deviation_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xLine, xOptimal_individual, yLine, yOptimal_individual);



    max_dev_displayed = max(max(mean_dev_displayed));
    max_dev_actual = max(max(mean_dev_actual));
    max_dev = max(max_dev_displayed, max_dev_actual);

    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,mean_dev_displayed(sample_subject,:));
        plot(xaxis,smooth(mean_dev_displayed(sample_subject,:), smoothing_analysis));

        %plot(xaxis,dev_displayed_no_comp(sample_subject,:), '--m');
    else
        plot(xaxis,mean(mean_dev_displayed,1));
        plot(xaxis,smooth(mean(mean_dev_displayed,1), smoothing_analysis));

        %plot(xaxis,mean(dev_displayed_no_comp,1), '--m');
    end
    hold off;
    title("Pointer mean absolute error across trials");
    ylabel("Absolute error");
    xlabel("Trial Number");
    %ylim([1 max_dev]);

    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});




    % Deviation calculation of the actual movement
    m_dev_displayed = Max_Deviation_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xfLine, xf, yfLine, yf);
    m_dev_actual = Max_Deviation_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xLine, x, yLine, y);

    max_max_dev_displayed = max(max(m_dev_displayed));
    max_max_dev_actual = max(max(m_dev_actual));
    max_dev = max(max_max_dev_displayed, max_max_dev_actual);

    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,m_dev_displayed(sample_subject,:));
        plot(xaxis,smooth(m_dev_displayed(sample_subject,:), smoothing_analysis));

        %plot(xaxis,dev_displayed_no_comp(sample_subject,:), '--m');
    else
        plot(xaxis,mean(m_dev_displayed,1));
        plot(xaxis,smooth(mean(m_dev_displayed,1), smoothing_analysis));

        %plot(xaxis,mean(dev_displayed_no_comp,1), '--m');
    end
    hold off;
    title("Pointer maximum absolute error across trials");
    ylabel("Absolute error");
    xlabel("Trial Number");
    %ylim([1 max_dev]);

    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});

    figure();
    clf;
    xaxis = 1:numPreTrials+numTrials;

    hold on;
    if sample_subject(1) ~= 0
        plot(xaxis,mean_dev_actual(sample_subject,:));
        plot(xaxis,smooth(mean_dev_actual(sample_subject,:), smoothing_analysis));

        %plot(xaxis,dev_actual_no_comp(sample_subject,:), '--m');

    else
        plot(xaxis,mean(mean_dev_actual,1));
        plot(xaxis,smooth(mean(mean_dev_actual,1), smoothing_analysis));

        %plot(xaxis,mean(dev_actual_no_comp,1), '--m');
    end
    hold off;

    title("Mouse absolute error across trials");
    ylabel("Absolute error");
    xlabel("Trial Number");
    %ylim([1 max_dev]);

    xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});

end


%% Starting and stopping positions graph
if sample_subject(1) ~= 0
    figure();
    clf;
    hold on;
    for sub=sample_subject
       scatter(startingXPosition(sub,:) ./ px2cm,startingYPosition(sub,:) ./ px2cm, 'blue');
       scatter(stoppingXPosition(sub,:) ./ px2cm,stoppingYPosition(sub,:) ./ px2cm, 'red');
    end
    hold off;

    legend("starting point", "stopping point");
    title("Mouse start and stop positions across trials");
    ylabel("Y Position (cm)");
    xlabel("X Position (cm)");

    % Position vs trial graphs
    figure();
    clf;
    hold on;
    for sub=sample_subject
        subplot(2,1,1);
        scatter(xaxis,startingXPosition(sub,1:numPreTrials+numTrials) ./ px2cm, 'blue');
        title("Mouse X coordinate start position across trials");
        ylabel("X Position (cm)");
        xlabel("Trial");
        xline(1,'--r',{strcat('Training:g=', num2str(g0))});
        xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
        xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
        xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
        xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
        
        subplot(2,1,2);
        scatter(xaxis,startingYPosition(sub,1:numPreTrials+numTrials) ./ px2cm, 'blue');
        title("Mouse Y coordinate start position across trials");
        ylabel("Y Position (cm)");
        xlabel("Trial");
        xline(1,'--r',{strcat('Training:g=', num2str(g0))});
        xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
        xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
        xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
        xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    end
    hold off;

end


    %%
    % %% Difference of Deviation error between actual and displayed positions
    % 
    % % Direct difference between actual and displayed
    % dir_dif_act_disp = dev_actual - dev_displayed;
    % 
    % 
    % figure();
    % clf;
    % xaxis = 1:numPreTrials+numTrials;
    % 
    % hold on;
    % if sample_subject(1) ~= 0
    %     plot(xaxis,dir_dif_act_disp(sample_subject,:));
    %     plot(xaxis,smooth(dir_dif_act_disp(sample_subject,:), smoothing_analysis));
    %     
    %     %plot(xaxis,dev_actual_no_comp(sample_subject,:), '--m');
    % 
    % else
    %     plot(xaxis,mean(dir_dif_act_disp,1));
    %     plot(xaxis,smooth(mean(dir_dif_act_disp,1), smoothing_analysis));
    %     
    %     %plot(xaxis,mean(dev_actual_no_comp,1), '--m');
    % end
    % hold off;
    % 
    % 
    % title("Direct difference between actual and displayed");
    % ylabel("Direct difference error");
    % xlabel("Trial Number");
    % %ylim([1 max_dev]);
    % 
    % xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    % xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    % xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    % xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    % xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    % 
    % 
    % 
    % 
    % 
    % % Proportional difference between actual and displayed
    % sd_dif_act_disp = Standardized_difference_act_disp_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xLine, yLine,xfLine, yfLine, x, y, xf, yf, xOptimal_individual, yOptimal_individual);
    % 
    % figure();
    % clf;
    % xaxis = numPreTrials+startIncreaseG:numPreTrials+trialWashout;
    % 
    % hold on;
    % if sample_subject(1) ~= 0
    %     plot(xaxis,sd_dif_act_disp(sample_subject,numPreTrials+startIncreaseG:numPreTrials+trialWashout));
    %     plot(xaxis,smooth(sd_dif_act_disp(sample_subject,numPreTrials+startIncreaseG:numPreTrials+trialWashout), smoothing_analysis));
    %     
    %     %plot(xaxis,dev_actual_no_comp(sample_subject,:), '--m');
    % 
    % else
    %     plot(xaxis,mean(sd_dif_act_disp(:,numPreTrials+startIncreaseG:numPreTrials+trialWashout),1));
    %     plot(xaxis,smooth(mean(sd_dif_act_disp(:,numPreTrials+startIncreaseG:numPreTrials+trialWashout),1), smoothing_analysis));
    %     
    %     %plot(xaxis,mean(dev_actual_no_comp,1), '--m');
    % end
    % hold off;
    % 
    % 
    % title("Standardized difference between actual and displayed");
    % ylabel("Standardized difference error");
    % xlabel("Trial Number");
    % %ylim([1 max_dev]);
    % 
    % xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    % xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    % xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    % xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    % xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    % 
    % yline(-1,'--g',{strcat('No adaptation')});
    % yline(1,'--g',{strcat('Full adaptation')});
    % 
    % ylim([-1.2 1.2]);
    % 
    % 
    % %% Standardized Difference between actual and ideal trajectories
    % sd_dif_act_ideal = Standardized_difference_act_ideal_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xLine, yLine, x, y, xOptimal_individual, yOptimal_individual);
    % 
    % figure();
    % clf;
    % xaxis = numPreTrials+startIncreaseG:numPreTrials+trialWashout;
    % 
    % hold on;
    % if sample_subject(1) ~= 0
    %     plot(xaxis,sd_dif_act_ideal(sample_subject,numPreTrials+startIncreaseG:numPreTrials+trialWashout));
    %     plot(xaxis,smooth(sd_dif_act_ideal(sample_subject,numPreTrials+startIncreaseG:numPreTrials+trialWashout), smoothing_analysis));
    %     
    %     %plot(xaxis,dev_actual_no_comp(sample_subject,:), '--m');
    % 
    % else
    %     plot(xaxis,mean(sd_dif_act_ideal(:,numPreTrials+startIncreaseG:numPreTrials+trialWashout),1));
    %     plot(xaxis,smooth(mean(sd_dif_act_ideal(:,numPreTrials+startIncreaseG:numPreTrials+trialWashout),1), smoothing_analysis));
    %     
    %     %plot(xaxis,mean(dev_actual_no_comp,1), '--m');
    % end
    % hold off;
    % 
    % 
    % title("Standardized difference between actual and ideal");
    % ylabel("Standardized difference error");
    % xlabel("Trial Number");
    % %ylim([1 max_dev]);
    % 
    % xline(1,'--r',{strcat('Training:g=', num2str(g0))});
    % xline(numPreTrials+1,'--r',{strcat('Experiment:g=', num2str(g0))});
    % xline(numPreTrials+startIncreaseG,'--r',{strcat('Start Increase g')});
    % xline(numPreTrials+stopIncreaseG,'--r',{strcat('g=', num2str(gMax))});
    % xline(numPreTrials+trialWashout,'--r',{strcat('g=', num2str(g0))});
    % 
    % yline(1,'--g',{strcat('No adaptation')});
    % yline(0,'--g',{strcat('Full adaptation')});
    % 
    % ylim([-0.2 1.2]);


catch ME
    ME.stack.name
    ME.stack.line
    ME.message
    g0
end


end



    












%% %%%%%%%%%%%%%%%%%%%%%%% Functions

%% MSS deviation
function SS = SS_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xfLine, xf, yfLine, yf)

SS = zeros([subjects, numPreTrials+numTrials]);
timePoints = zeros([subjects, numPreTrials+numTrials]);

for i=1:subjects
    for j=1:numPreTrials+numTrials
        indStart = find(time(i,:) == trialStartTime(i,j),1);
        indEnd = find(time(i,:) == trialEnd(i,j),1);
        
        % Calculate sum of squares
        for k=indStart:indEnd
            SS(i,j) = SS(i,j) + power(cartesian(xf(i,k) - xfLine(i,k), yf(i,k) - yfLine(i,k)), 2);
            timePoints(i,j) = timePoints(i,j) + 1;
        end
    end
end
SS = SS ./ timePoints;

end

%% Max Absolute deviation
function AD = Max_Deviation_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xfLine, xf, yfLine, yf)

AD = zeros([subjects, numPreTrials+numTrials]);

for i=1:subjects
    for j=1:numPreTrials+numTrials
        indStart = find(time(i,:) == trialStartTime(i,j),1);
        indEnd = find(time(i,:) == trialEnd(i,j),1);
        
        temp = 0;
        % Calculate sum of squares
        for k=indStart:indEnd
            % Find max
            act = cartesian(xf(i,k) - xfLine(i,k), yf(i,k) - yfLine(i,k));
            if temp < act
                temp = act;
            end
        end
        AD(i,j) = temp;
    end
end

end

%% Mean Absolute deviation
function AD = Mean_Deviation_error_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xfLine, xf, yfLine, yf)

AD = zeros([subjects, numPreTrials+numTrials]);
timePoints = zeros([subjects, numPreTrials+numTrials]);

for i=1:subjects
    for j=1:numPreTrials+numTrials
        indStart = find(time(i,:) == trialStartTime(i,j),1);
        indEnd = find(time(i,:) == trialEnd(i,j),1);
        
        % Calculate sum of squares
        for k=indStart:indEnd
            AD(i,j) = AD(i,j) + cartesian(xf(i,k) - xfLine(i,k), yf(i,k) - yfLine(i,k));
            timePoints(i,j) = timePoints(i,j) + 1;
        end
    end
end
AD = AD ./ timePoints;

end

%% Standardized difference between the actual error and the displayed error
function SD = Standardized_difference_act_disp_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xLine, yLine,xfLine, yfLine, x, y, xf, yf, xOptimal_individual, yOptimal_individual)

SD = zeros([subjects, numPreTrials+numTrials]);
%timePoints = zeros([subjects, numPreTrials+trials]);

for i=1:subjects
    for j=1:numPreTrials+numTrials
        indStart = find(time(i,:) == trialStartTime(i,j),1);
        indEnd = find(time(i,:) == trialEnd(i,j),1);
        
        % Standardized Proportions for each time point
        temp_prop = zeros([1 indEnd-indStart+1]);
        % Calculate the standardized difference 
        %(actual - displayed) / ideal_movement
        for k=indStart:indEnd
            temp_prop(k - indStart + 1) = (cartesian(x(i,k) - xLine(i,k), y(i,k) - yLine(i,k)) - ...
                cartesian(xf(i,k) - xfLine(i,k), yf(i,k) - yfLine(i,k))) / ...
                max([cartesian(x(i,k) - xLine(i,k), y(i,k) - yLine(i,k)), cartesian(xOptimal_individual(i,k) - xLine(i,k), yOptimal_individual(i,k) - yLine(i,k)),1]);
            %SD(i,j) = SD(i,j) + cartesian(xf(i,k) - xLine(i,k), yf(i,k) - yLine(i,k));
            %timePoints(i,j) = timePoints(i,j) + 1;
        end
        
        SD(i,j) = mean(temp_prop);
    end
end
%SD = SD ./ timePoints;

end

%% Standardized difference between the actual error and the ideal error

function SD = Standardized_difference_act_ideal_across_trials(numPreTrials, numTrials, subjects, time, trialStartTime, trialEnd, xLine, yLine, x, y, xOptimal_individual, yOptimal_individual)

SD = zeros([subjects, numPreTrials+numTrials]);
%timePoints = zeros([subjects, numPreTrials+trials]);

for i=1:subjects
    for j=1:numPreTrials+numTrials
        indStart = find(time(i,:) == trialStartTime(i,j),1);
        indEnd = find(time(i,:) == trialEnd(i,j),1);
        
        % Standardized Proportions for each time point
        temp_prop = zeros([1 indEnd-indStart+1]);
        % Calculate the standardized difference 
        %(actual - displayed) / ideal_movement
        for k=indStart:indEnd
           % temp_prop(k - indStart + 1) = (cartesian(x(i,k) - xLine(i,k), y(i,k) - yLine(i,k)) - ...
           %     cartesian(xOptimal_individual(i,k) - xLine(i,k), yOptimal_individual(i,k) - yLine(i,k))) / ...
           %     max(cartesian(xOptimal_individual(i,k) - xLine(i,k), yOptimal_individual(i,k) - yLine(i,k)),1);
            
            temp_prop(k - indStart + 1) = abs(cartesian(x(i,k) - xLine(i,k), y(i,k) - yLine(i,k)) - ...
                cartesian(xOptimal_individual(i,k) - xLine(i,k), yOptimal_individual(i,k) - yLine(i,k))) / ...
                max([cartesian(x(i,k) - xLine(i,k), y(i,k) - yLine(i,k)), cartesian(xOptimal_individual(i,k) - xLine(i,k), yOptimal_individual(i,k) - yLine(i,k)),1]);
            
           %  temp_prop(k - indStart + 1) = abs(cartesian(x(i,k) - xLine(i,k), y(i,k) - yLine(i,k)) - ...
           %     cartesian(xOptimal_individual(i,k) - xLine(i,k), yOptimal_individual(i,k) - yLine(i,k)));

            %SD(i,j) = SD(i,j) + cartesian(xf(i,k) - xLine(i,k), yf(i,k) - yLine(i,k));
            %timePoints(i,j) = timePoints(i,j) + 1;
        end
        
        SD(i,j) = mean(temp_prop);
    end
end
%SD = SD ./ timePoints;

end

%% Get velocity
function [vx vy] = getVelocity(x, y, time, subjects, lastIndexExp)

lastIndex = max(lastIndexExp);

vx = zeros([subjects lastIndex]);
vy = zeros([subjects lastIndex]);

for i=1:subjects
    for j=2:lastIndexExp(i)
        
        dt = time(i,j) - time(i,j-1);
        if dt == 0
            dt = 0.005;
        end
        
        vx(i,j) = (x(i,j) - x(i,j-1)) / dt;
        vy(i,j) = (y(i,j) - y(i,j-1)) / dt;
    end
end

end

%% Get max velocity per trial
function [vMax, vMaxInd] = getMaxVelocityPerTrial(v, startMovement, trialTargetReached, numTrials, subjects, numPreTrials, time)

vMax = zeros([subjects numPreTrials+numTrials]);
vMaxInd = zeros([subjects numPreTrials+numTrials]);

for i=1:subjects
    for j=1:numPreTrials+numTrials
        indStart = find(time(i,:) == startMovement(i, j),1);
        indEnd = find(time(i,:) == trialTargetReached(i,j),1);
        %indStart = indStart(1);
        %indEnd = indEnd(1);
        
        [vMax(i,j), vMaxInd(i,j)] = max(abs(v(i, indStart:indEnd)));
        
        vMaxInd(i,j) = vMaxInd(i,j) + indStart - 1;
    end
end

end

%% Get duration per trial

function duration = getDurationPerTrial(time, startMovement, trialTargetReached, numTrials, subjects, numPreTrials)

duration = zeros([subjects, numPreTrials+numTrials]);

for i=1:subjects
    for j=1:numPreTrials+numTrials
        indStart = find(time(i,:) == startMovement(i,j),1);
        indEnd = find(time(i,:) == trialTargetReached(i,j),1);
        
        duration(i,j) = time(i,indEnd) - time(i,indStart);
    end
end

end

%% Get index of a trial stage

function indeces = getIndexTrialStage(stage, time, subjects, numTrials, numPreTrials)

indeces = zeros([subjects, numPreTrials+numTrials]);

for i=1:subjects
    for j=1:numPreTrials+numTrials
        indT = find(time(i,:) == stage(i, j));
        if isempty(indT)
            indT = find(time(i,:) >= stage(i,j), 1) - 1;
        end
        indeces(i,j) = indT(1);
    end
end

end


%% Get ideal position given the participant's velocity

function [xOptimal_ind, yOptimal_ind] = ideal_movement_individual(xL, yL, vx, vy, g, trialStartTimeIndeces, trialEndIndeces, target1XCor, target1YCor, target2XCor, target2YCor, subjects)

xOptimal_ind = zeros(size(vx));
yOptimal_ind = zeros(size(vy));

% For each subject
for sub=1:subjects
    % For each trial/pre-trials
    for trial=1:size(trialStartTimeIndeces,2)
        
        targetAngle = atan2(target2YCor(sub,trial) - target1YCor(sub,trial), target2XCor(sub,trial) - target1XCor(sub,trial));
        
        % For each time point
        for i=trialStartTimeIndeces(sub,trial):trialEndIndeces(sub,trial)
            mag_force_dir = g(trial)*sqrt(power(vx(sub,i),2) + power(vy(sub,i),2)) * cos(atan2(vy(sub,i),vx(sub,i)) - targetAngle);
            
            [xOptimal_ind(sub,i),yOptimal_ind(sub,i)] = perpendicular_point_from_point_on_line(xL(sub,i),yL(sub,i),targetAngle, mag_force_dir);
        end
    end
end

% 
% for sub=1:subjects
%     
%     for j=1:trialEndIndeces(i,end)
%         
%         
%         
%         ind = find(trialStartTimeIndeces(i,:) > j, 1);
%         if ind == 1
%             continue;
%         end
%         
%         if j >= trialStartTimeIndeces(i,end)
%             ind = length(trialStartTimeIndeces(i,:));
%         end
%         
%         xOptimal_ind(i,j) = midline - g(ind - 1)*vy(i,j);
%     end
% end

end


%% Get smoothed velocity:

function sm_vel = smooth(vel, smoothing)
sm_vel = zeros(size(vel));

for i=1:size(vel,1)
    sm_vel(i,1) = vel(i,1);
    for j=2:size(vel,2)
        sm_vel(i,j) = sm_vel(i,j-1) + (vel(i,j) - sm_vel(i,j-1)) * smoothing;
    end
end
 
end


%% Get point on the line (x1,y1)--(x2,y2) closest to the point (x0,y0)
function [x,y] = closest_point_on_line_from_point(x0,y0,x1,y1,x2,y2)

% coefficients of the line
a = y2-y1;
b = x1-x2;
c = x2*y1 - y2*x1;

x = (b*(b*x0 - a*y0) - a*c)/(a*a + b*b);
y = (a*(-b*x0 + a*y0) - b*c)/(a*a + b*b);

end


%% Get coordinates on the line between targets
function [xLine,yLine] = get_coordinates_on_line(x,y,subjects, target1XCor, target1YCor, target2XCor, target2YCor, trialStartTimeIndeces, trialEndIndeces)

xLine = zeros(size(x));
yLine = zeros(size(y));

% For each subject
for sub=1:subjects
    % For each trial/pre-trials
    for trial=1:size(trialStartTimeIndeces,2)
        % For each time point
        for i=trialStartTimeIndeces(sub,trial):trialEndIndeces(sub,trial)
            [xLine(sub,i),yLine(sub,i)] = closest_point_on_line_from_point(x(sub,i),y(sub,i),target1XCor(sub,trial),target1YCor(sub,trial),target2XCor(sub,trial),target2YCor(sub,trial));
        end
    end
end

end


%% Get point perpendicular to the line (x1,y1)--(x2,y2) from the point (x0,y0) with distance d
function [x,y] = perpendicular_point_from_point_on_line(x0,y0,alpha, d)

% Get angle of the line
%alpha = atan2(y2-y1,x2-x1);

% Get perpendicular angle
beta = alpha - pi/2;

% Find the deviation on x and y axis
dx = d*cos(beta);
dy = d*sin(beta);

% Find the coordinates of the point

x = x0 - dx;
y = y0 - dy;

end


%% Cartesian sum
function z = cartesian(x,y)
    z = sqrt(power(x,2)+power(y,2));
end

%% Rotation angle and respective coordinates on midline
function angleErr = getRotationAngle(x,y,xPivot,yPivot,xT2,yT2, subjects, lastIndexExp, trialStartTimeIndeces, trialEndIndeces, xLine, yLine)

    lastIndex = max(lastIndexExp);
    angleErr = zeros([subjects, lastIndex]);
    %xLine = zeros([subjects, lastIndex]);
    %yLine = zeros([subjects, lastIndex]);
    
    for sub=1:subjects
        
        % For each trial/pre-trials
        for trial=1:size(trialStartTimeIndeces,2)

            %targetAngle = atan2(target2YCor(sub,trial) - target1YCor(sub,trial), target2XCor(sub,trial) - target1XCor(sub,trial));

            % For each time point
            for i=trialStartTimeIndeces(sub,trial):trialEndIndeces(sub,trial)
                
                %[xLine(sub,i),yLine(sub,i)] = closest_point_on_line_from_point(x(sub,i),y(sub,i),xPivot(sub,trial),yPivot(sub,trial),xT2(sub,trial),yT2(sub,trial));
                 if   cartesian(x(sub,i) - xPivot(sub,trial),y(sub,i) - yPivot(sub,trial)) == 0
                     angleErr(sub,i) = 0;
                 else
                    angleErr(sub,i) = asin(sign(x(sub,i) - xLine(sub,i)) * cartesian(x(sub,i) - xLine(sub,i),y(sub,i) - yLine(sub,i))/cartesian(x(sub,i) - xPivot(sub,trial),y(sub,i) - yPivot(sub,trial)));
                 end
                %mag_force_dir = g(trial)*sqrt(power(vx(sub,i),2) + power(vy(sub,i),2)) * cos(atan2(vy(sub,i),vx(sub,i)) - targetAngle);

                %[xOptimal_ind(sub,i),yOptimal_ind(sub,i)] = perpendicular_point_from_point_on_line(xL(sub,i),yL(sub,i),targetAngle, mag_force_dir);
            end
        end
        
    end

end