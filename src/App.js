import './App.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'remixicon/fonts/remixicon.css';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function Timer({ timeRemaining, clockMode }) {

	function formatTime(seconds) {
		// Calculates the number of minutes by dividing the input seconds by 60 and rounding down using Math.floor() function.
		const minutes = Math.floor(seconds / 60); 
		// Calculate the remaining seconds after converting them to a string and padding it with a leading zero if necessary.
		const secondsFormatted = String(seconds % 60).padStart(2, '0');
		// Return the formatted time string in the format "minutes : secondsFormatted".
		return `${minutes} : ${secondsFormatted}`;
	}

	return (
		<div id="timer-display" className="flex flex-col justify-center w-[230px] h-[160px] md:w-[350px] md:h-[200px] lg:w-[500px] lg:h-[300px] rounded-[8px]">
			<p id="time-left" className="text-center select-none h-[54px] text-[54px] md:text-[70px] md:h-[70px] lg:text-[110px] lg:h-[110px]">
				{formatTime(timeRemaining)}
			</p>
			<p id="timer-label" className="mt-[14px] text-center text-base select-none md:text-lg lg:text-3xl lg:mt-7">{clockMode === 'session' ? 'Session' : 'Break'}</p>
		</div>
	);
}
Timer.propTypes = {
	timeRemaining: PropTypes.number.isRequired,
	clockMode: PropTypes.string.isRequired
};

function ControlPanelButtons({ clockIsRunning, startTimer, pauseTimer, resetTimer, muteAlarm, alarmIsMuted, timeRemaining, clockMode, sessionLength, breakLength }) {
	// Checks `clockMode` is set to session and assigns `sessionLength` to `totalTime` when true, `breakLength` when false.
	const totalTime =  convertToSeconds(clockMode === 'session' ? sessionLength : breakLength);
	// Calculates the progress of the timer in percentage by dividing the `timeRemaining` by the `totalTime` and multiplying it by '100'. 
	const progress = (timeRemaining / totalTime) * 100;
	return (
		<div className="flex flex-row gap-6 mx-auto justify-center items-center">
			<div id="mute" onClick={muteAlarm} className="flex items-center text-2xl lg:text-4xl">
				<i className={alarmIsMuted ?'ri-volume-up-line' : 'ri-volume-mute-line'}></i>
			</div>
			<div id="start_stop" className="h-20 w-20 lg:h-[120px] lg:w-[120px] flex">
				<CircularProgressbarWithChildren
					id="play-progress-circle"
					// Assigns `progress` to value to be shown on CircularProgressBar
					value={progress}
					strokeWidth="3"
				>
					<i className={`${clockIsRunning ? 'ri-pause-fill' : 'ri-play-fill'} text-[44px] lg:text-[70px]`} onClick={clockIsRunning ? pauseTimer : startTimer}  />
				</CircularProgressbarWithChildren>
			</div>
			<div id="reset" onClick={resetTimer} className="flex items-center text-[21px] lg:text-[34px]">
				<i className="ri-restart-line"></i>
			</div>
		</div>
	);
}
ControlPanelButtons.propTypes = {
	clockIsRunning: PropTypes.bool.isRequired,
	resetTimer: PropTypes.func.isRequired,
	startTimer: PropTypes.func.isRequired,
	pauseTimer: PropTypes.func.isRequired,
	muteAlarm: PropTypes.func.isRequired,
	alarmIsMuted: PropTypes.bool.isRequired,
	timeRemaining: PropTypes.number.isRequired,
	clockMode: PropTypes.string.isRequired,
	sessionLength: PropTypes.number.isRequired,
	breakLength: PropTypes.number.isRequired
};

function SessionLengthControl({ sessionLength, handleSessionChange, handleBlur, handleSessionClick }) {
	return (
		<div className="flex flex-row justify-center items-center gap-[2px]">
			<div id="session-increment" onClick={() => {handleSessionClick('increment');}} className="flex justify-center text-base select-none"><i className="ri-add-line text-2xl md:text-[28px] lg:text-4xl"></i></div>
			<div className="flex items-center justify-center w-16 my-auto text-center">
				<input
					id="session-length"
					type="text" 
					inputMode="numeric" 
					minLength="1" 
					maxLength="2" 
					value={sessionLength}
					onChange={handleSessionChange}
					onBlur={() => {handleBlur('session');}}
					className="max-w-[40px] md:max-w-[46px] lg:max-w-[60px] text-center text-3xl md:text-4xl lg:text-5xl bg-inherit bg-opacity-0 focus:outline-none"/>
			</div>
			<div id="session-decrement" onClick={() => {handleSessionClick('decrement');}} className="flex justify-center text-base select-none"><i className="ri-subtract-line text-2xl md:text-[28px] lg:text-4xl"></i></div>
		</div>
	);
}
SessionLengthControl.propTypes = {
	sessionLength: PropTypes.number.isRequired,
	handleSessionChange: PropTypes.func.isRequired,
	handleBlur: PropTypes.func.isRequired,
	handleSessionClick: PropTypes.func.isRequired
};

function BreakLengthControl({ breakLength, handleBreakChange, handleBlur, handleBreakClick }) {
	return (
		<div className="flex flex-row justify-center items-center gap-[2px]">
			<div id="break-increment" onClick={() => {handleBreakClick('increment');}} className="flex justify-center text-base select-none"><i className="ri-add-line text-2xl md:text-[28px] lg:text-4xl"></i></div>
			<div className="flex items-center justify-center w-16 my-auto text-center">
				<input
					id="break-length"
					type="text" 
					inputMode="numeric" 
					minLength="1" 
					maxLength="2" 
					value={breakLength}
					onChange={handleBreakChange}
					onBlur={() => {handleBlur('break');}}
					className="max-w-[40px] md:max-w-[46px] lg:max-w-[60px] text-center text-3xl md:text-4xl lg:text-5xl bg-inherit bg-opacity-0 focus:outline-none"/>
			</div>
			<div id="break-decrement" onClick={() => {handleBreakClick('decrement');}} className="flex justify-center text-base select-none"><i className="ri-subtract-line text-2xl md:text-[28px] lg:text-4xl"></i></div>
		</div>
	);
}
BreakLengthControl.propTypes = {
	breakLength: PropTypes.number.isRequired,
	handleBreakChange: PropTypes.func.isRequired,
	handleBlur: PropTypes.func.isRequired,
	handleBreakClick: PropTypes.func.isRequired
};

export default function App() {
	// Creates state `timeRemaining` to store remaining time of the clock.
	const [timeRemaining, setTimeRemaining] = useState(1500); // 25 * 60 seconds = 1500 seconds = 25 mins
	// Creates state `timerId` to store ID of timer on interval start.
	const [timerId, setTimerId] = useState(null);
	// Creates state `clockMode` to store mode of the clock;
	const [clockMode, setClockMode] = useState('session');
	// Creates state `clockIsRunning` to store on and off state of the clock.
	const [clockIsRunning, setClockIsRunning] = useState(false);
	// Creates state `clockIsPaused` to store state of clock when paused.
	const [clockIsPaused, setClockIsPaused] = useState(false);
	// Creats state `alarmIsMuted` to store state when alarm is muted.
	const [alarmIsMuted, setAlarmIsMuted] = useState(false);
	// Creates state `sessionLength` to store length of session time.
	const [sessionLength, setSessionLength] = useState(25);
	// Creates state `breakLength` to store length of break time.
	const [breakLength, setBreakLength] = useState(5);
	// Create state `isNightMode` to track night mode state of app.
	const [isNightMode, setIsNightMode] = useState(false);
	// Create an audio element `audioAlarm`.
	const audioAlarm = new Audio('/soundfx/alarm_sfx.mp3');
	// Set the source and attributes of `audioAlarm`.
	audioAlarm.src = '/soundfx/alarm_sfx.mp3';
	audioAlarm.id = 'beep';

	useEffect(() => {
		// Stop the countdown when `timeRemaining` reaches -1.
		if (timeRemaining === 0) {
			clearInterval(timerId);
			// Perform any necessary actions when the countdown ends.
			if (!alarmIsMuted) {
				audioAlarm.play(); // When `alarmIsMuted` is true, `audioAlarm` wont be played.
			}
			// Checks if `clockMode` is set to session.
			if (clockMode === 'session') {
				setClockMode('break'); // Sets `clockMode` to break.
				let convertedBreakLength = convertToSeconds(breakLength); // Converts `breakLength` to seconds and assigns it to `convertedBreakLength`.
				setTimeRemaining(convertedBreakLength); // Sets state `timeRemaining` to `convertedBreakLength`.
				startTimer(); // Starts the timer.
			}
			// Checks if `clockMode` is set to break.
			if (clockMode === 'break') {
				setClockMode('session'); // Sets `clockMode` to session.
				let convertedSessionLength = convertToSeconds(sessionLength); // Converts `sessionLength` to seconds and assigns it to `convertedSessionLength`.
				setTimeRemaining(convertedSessionLength); // Sets state `timeRemaining` to `convertedSessionLength`.
				startTimer(); // Starts the timer.
			}
		}
	}, [timeRemaining, timerId]);

	function startTimer() {
		// Checks if timer is not paused. When true, the clock does not need to continue
		// from its previous state and can be assigned a new state to start from.
		if (!clockIsPaused && !clockIsRunning) {
			let convertedSessionLength = convertToSeconds(sessionLength);
			setTimeRemaining(convertedSessionLength);
		}
		
		setClockIsRunning(true); // sets `clockIsRunning` state to true.
		setClockIsPaused(false); // sets `clockIsPaused` state to false.

		// Starts the countdown for the clock.
		const timer = setInterval(() => {
			// decrement `timeRemaining` by 1.
			setTimeRemaining(prevTime => prevTime - 1);
		}, 1000);

		// Gets the timer id assigned to `timer` and stores it in state `timerId`.
		setTimerId(timer);
	}

	function pauseTimer() {
		setClockIsRunning(false); // Changes `clockIsRunning` state of clock to false.
		setClockIsPaused(true); // Changes `clockIsPaused` state of clock to true.

		// Clears the interval.
		clearInterval(timerId);
	}

	function resetTimer() {
		// Checks if clock is till running. When true, it clears the interval.
		if (clockIsRunning) {
			clearInterval(timerId);
		}

		setClockIsRunning(false); // Sets states to false to prepare for new countdown.
		setClockIsPaused(false); // Sets states to false to prepare for new countdown.
		setClockMode('session'); // Sets clock back to session mode.
		setSessionLength(25); // Sets `sessionlength` back to default value of 25mins.
		setBreakLength(5); // Sets `breaklength` back to default value of 5mins.
		let convertedDefaultLength = convertToSeconds(25); // Converts default `sessionLength` value to seconds and assigns it to `convertedDefaultLength`
		setTimeRemaining(convertedDefaultLength); // Resets `timeRemaining` to default `sessionLength`.
	}

	// Handles audio state of the app.
	function muteAlarm() {
		setAlarmIsMuted(!alarmIsMuted); // Inverts value of `alarmIsMuted` when called and assigns it to `alarmIsMuted` state.
	}

	// Handles changing display mode between night or day.
	function changeDisplayMode() {
		setIsNightMode(!isNightMode);
	}

	// -------------- handles changes and click for `SessionLengthControl` Component --------------------------
	function handleSessionChange(event) {
		if (clockIsRunning) {
			return; // When clock is running, do nothing.
		}
		let value = event.target.value;
		// Allow only digits (0-9).
		if (!/^\d*$/.test(value)) {
			return;
		}
		setSessionLength(value === '' ? '' : parseInt(value)); // Checks if value is an empty string. When true, state `sessionLength` is assigned an empty string. When false, state `sessionlength` is assigned `value` that is parsed into an integer.

		if (clockMode === 'session') { // Checks if `clockMode` is set to session.
			// Checks first if value is an empty string. If true, a value of '1' is returned that is then converted to seconds and assigned to `convertedSessionLength`. When false, `value` is converted to seconds and asigned to `convertedSessionLength`.
			let convertedSessionLength = convertToSeconds(value === '' ? 1 : parseInt(value)); 
			setTimeRemaining(convertedSessionLength); // State `timeRemaining` is set to `convertedSessionLength`.
		}
	}

	function handleSessionClick(change) {
		if (clockIsRunning) {
			return; // When clock is running, do nothing.
		}
		let updatedSessionLength = sessionLength; // gets current session length and assigns it to `updatedSessionLength`;
		if (updatedSessionLength >= 60 && change === 'increment') {
			return; // Do nothing when `sessionLength` is greater than or equal to 60 and user presses increment button.
		}
		if (updatedSessionLength <= 1 && change === 'decrement') {
			return; // Do nothing when `sessionLength` is lesser than or equal to 1 and user presses decrement button.
		}
		if (change === 'increment') {
			updatedSessionLength = updatedSessionLength + 1; // increments `updatedSessionLength` by 1.
			setSessionLength(updatedSessionLength); // Sets state `sessionLength` to `updatedSessionLength`.
			// Checks if `clockMode` is set to 'session'. When true, `timeRemaining` is set to `updatedSessionLength`. When false, do nothing.
			let convertedSessionLength = convertToSeconds(updatedSessionLength);
			clockMode === 'session' ? setTimeRemaining(convertedSessionLength) : () => {};
		}
		if (change === 'decrement') {
			updatedSessionLength = updatedSessionLength - 1; // decrements `updatedSessionLength` by 1.
			setSessionLength(updatedSessionLength); // Sets state `sessionLength` to `updatedSessionLength`.
			// Checks if `clockMode` is set to 'session'. When true, `timeRemaining` is set to `updatedSessionLength`. When false, do nothing.
			let convertedSessionLength = convertToSeconds(updatedSessionLength);
			clockMode === 'session' ? setTimeRemaining(convertedSessionLength) : () => {};
		}
	}
	// -------------- End of handles for changes and click for `SessionLengthControl` Component --------------------------

	// -------------- handles changes and click for `BreakLengthControl` Component --------------------------
	function handleBreakChange(event) {
		if (clockIsRunning) {
			return; // When clock is running, do nothing.
		}
		let value = event.target.value;
		// Allow only digits (0-9)
		if (!/^\d*$/.test(value)) {
			return;
		}
		setBreakLength(value === '' ? '' : parseInt(value)); // Checks if value is an empty string. When true, state `breakLength` is assigned an empty string. When false, state `breaklength` is assigned `value` that is parsed into an integer.

		if (clockMode === 'break') {// Checks if `clockMode` is set to break.
			// Checks first if value is an empty string. If true, a value of '1' is returned that is then converted to seconds and assigned to `convertedBreakLength`. When false, `value` is converted to seconds and asigned to `convertedBreakLength`.
			let convertedBreakLength = convertToSeconds(value === '' ? 1 : parseInt(value));
			setTimeRemaining(convertedBreakLength); // State `timeRemaining` is set to `convertedBreakLength`.
		}
	}

	function handleBreakClick(change) {
		if (clockIsRunning) {
			return; // When clock is running, do nothing.
		}
		let updatedBreakLength = breakLength; // gets current break length and assigns it to `updatedBreakLength`.
		if (updatedBreakLength >= 60 && change === 'increment') {
			return; // Do nothing when `breakLength` is greated than or equal to 60 and user presses increment button.
		}
		if (updatedBreakLength <= 1 && change === 'decrement') {
			return; // Do nothing when `breakLength` is lesser than or equal to 1 and user presses decrement button.
		}
		if (change === 'increment') {
			updatedBreakLength = updatedBreakLength + 1; // increments `updatedBreakLength` by 1.
			setBreakLength(updatedBreakLength); // Sets state `breakLength` to `updatedBreakLength`.
			// Checks if `clockMode` is set to 'break'. When true, `timeRemaining` is set to `updatedBreakLength`. When false, do nothing.
			let convertedBreakLength = convertToSeconds(updatedBreakLength);
			clockMode === 'break' ? setTimeRemaining(convertedBreakLength) : () => {};
		}
		if (change === 'decrement') {
			updatedBreakLength = updatedBreakLength - 1; // decrements `updatedBreakLength` by 1.
			setBreakLength(updatedBreakLength); // Sets state `breakLength` to `updatedBreakLength`.
			// Checks if `clockMode` is set to 'break'. When true, `timeRemaining` is set to `updatedBreakLength`. When false, do nothing.
			let convertedBreakLength = convertToSeconds(updatedBreakLength);
			clockMode === 'break' ? setTimeRemaining(convertedBreakLength) : () => {};
		}
	}
	// -------------- End of handles for changes and click for `BreakLengthControl` Component --------------------------

	// Handles blur change for both `SessionLengthControl` and `BreakLengthControl` components
	function handleBlur(component) {
		if (clockIsRunning) {
			return; // When clock is running, do nothing.
		}
		switch (true) {
			// Checks if `component` has a value of `session`.
			case component === 'session': {
				// Checks if `sessionLength` is an empty string or has a value less than '0'.
				if (sessionLength === '' || sessionLength <= 0) {
					setSessionLength(1); // Sets state `sessionLength` to '1'.
					setTimeRemaining(60); // Sets state `timeRemaining` to '60' (1 minute = 60 seconds).
				}
				// Checks if `sessionLength` is equal to or greater than 60.
				if (sessionLength >= 60) {
					setSessionLength(60); // Sets state `sessionLength` to '1' (1 minute = 60 seconds).
					setTimeRemaining(3600); // Sets state `timeRemaining` to '3600' (60 minutes = 3600 seconds).
				}
				break;
			}
			// Checks if `component` has a value of `break`.
			case component === 'break': {
				// Checks if `breakLength` is an empty string or has a value less than '0'.
				if (breakLength === '' || breakLength <= 0) {
					setBreakLength(1); // Sets state `breakLength` to '1'.
					setTimeRemaining(1 * 60); // Sets state `timeRemaining` to '60'.
				}
				// Checks if `breakLength` is equal to or greater than 60.
				if (breakLength >= 60) {
					setBreakLength(60); // Sets state `breakLength` to '1' (1 minute = 60 seconds).
					setTimeRemaining(60 * 60); // Sets state `timeRemaining` to '3600' (60 minutes = 3600 seconds).
				}
				break;
			}
		}
	}

	return (
		<div className={`${isNightMode ? 'night-mode' : 'day-mode'} App flex h-screen`}>
			<div id="App-frame" className="flex flex-col gap-[6px] w-fit mx-auto">
				<div id="header" className="flex items-center justify-center mt-4 lg:mt-24 lg:mb-2">
					<div className="flex-1 text-center">
						<p className="text-base md:text-xl lg:text-3xl select-none">Pomodoro Timer</p>
					</div>
					<div>
						<i 
							className={`${isNightMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg md:text-xl lg:text-3xl`}
							onClick={changeDisplayMode}>
						</i>
					</div>
				</div>
				<hr id="header-hr" className={`${isNightMode ? 'night-mode' : 'day-mode'}`} />
				<div className="flex flex-row mx-auto mt-7 lg:mt-10">
					<Timer timeRemaining={timeRemaining} clockMode={clockMode} />
				</div>
				<div id="length-controls-component" className="flex flex-col lg:flex-row h-fit mx-auto mt-8 md:mt-6 lg:mt-8 gap-4 lg:gap-0">
					<div className="flex flex-col mx-auto gap-1">
						<SessionLengthControl sessionLength={sessionLength} handleSessionChange={handleSessionChange} handleBlur={handleBlur} handleSessionClick={handleSessionClick} />
						<p id="session-label" className="text-center md:text-lg lg:text-xl select-none">Session Length</p>
					</div>
					<hr id="length-controls-hr" className={`${isNightMode ? 'night-mode' : 'day-mode'} lg:rotate-90`} />
					<div className="flex flex-col mx-auto gap-1">
						<BreakLengthControl breakLength={breakLength} handleBreakChange={handleBreakChange} handleBlur={handleBlur} handleBreakClick={handleBreakClick} />
						<p id="break-label" className="text-center md:text-lg lg:text-xl select-none">Break Length</p>
					</div>
				</div>
				<div className="flex flex-row mx-auto mt-[40px] lg:mt-24">
					<ControlPanelButtons clockIsRunning={clockIsRunning} startTimer={startTimer} pauseTimer={pauseTimer} resetTimer={resetTimer} muteAlarm={muteAlarm} alarmIsMuted={alarmIsMuted} timeRemaining={timeRemaining} clockMode={clockMode} sessionLength={sessionLength} breakLength={breakLength} />
				</div>
			</div>
		</div>
	);
}

// Helper function `convertToSeconds`.
function convertToSeconds(minutes) {
	return minutes * 60;
}