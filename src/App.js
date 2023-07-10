import './App.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'remixicon/fonts/remixicon.css';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function Timer({ timeRemaining, clockMode }) {
	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const secondsFormatted = String(seconds % 60).padStart(2, '0');
		return `${minutes} : ${secondsFormatted}`;
	}

	return (
		<div id="timer-display" className="flex flex-col justify-center">
			<p id="time-left" className="text-center h-[54px] text-[54px]">
				{formatTime(timeRemaining)}
			</p>
			<p id="timer-label" className="mt-[14px] text-center text-base">{clockMode === 'session' ? 'Session' : 'Break'}</p>
		</div>
	);
}
Timer.propTypes = {
	timeRemaining: PropTypes.number.isRequired,
	clockMode: PropTypes.string.isRequired
};

function ControlPanelButtons({ clockIsRunning, startTimer, pauseTimer, resetTimer, muteAlarm, alarmIsMuted, timeRemaining, clockMode, sessionLength, breakLength }) {
	const totalTime =  convertToSeconds(clockMode === 'session' ? sessionLength : breakLength);
	const progress = ((totalTime - timeRemaining) / totalTime) * 100;
	return (
		<div className="flex flex-row gap-6 mx-auto justify-center items-center">
			<div id="mute" onClick={muteAlarm} className="flex items-center text-2xl">
				<i className={alarmIsMuted ?'ri-volume-up-line' : 'ri-volume-mute-line'}></i>
				{/* <FontAwesomeIcon className="text-xl" icon={alarmIsMuted ? faVolumeHigh : faVolumeMute} /> */}
			</div>
			<div id="start_stop" className="h-20 w-20 flex">
				<CircularProgressbarWithChildren
					id="play-progress-circle"
					value={progress}
					text=""
					strokeWidth="3"
				>
					<i className={`${clockIsRunning ? 'ri-pause-fill' : 'ri-play-fill'} text-[44px]`} onClick={clockIsRunning ? pauseTimer : startTimer}  />
				</CircularProgressbarWithChildren>

			</div>
			<div id="reset" onClick={resetTimer} className="flex items-center text-[21px]">
				<i className="ri-restart-line"></i>
				{/* <FontAwesomeIcon className="text-xl" icon={faRotateRight} /> */}
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
			<div id="session-increment" onClick={() => {handleSessionClick('increment');}} className="flex justify-center text-base select-none"><i className="ri-add-line text-2xl"></i></div>
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
					className="max-w-[40px] text-center text-3xl bg-inherit bg-opacity-0 focus:outline-none"/>
			</div>
			<div id="session-decrement" onClick={() => {handleSessionClick('decrement');}} className="flex justify-center text-base select-none"><i className="ri-subtract-line text-2xl"></i></div>
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
			<div id="break-increment" onClick={() => {handleBreakClick('increment');}} className="flex justify-center text-base select-none"><i className="ri-add-line text-2xl"></i></div>
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
					className="max-w-[40px] text-center text-3xl bg-inherit bg-opacity-0 focus:outline-none"/>
			</div>
			<div id="break-decrement" onClick={() => {handleBreakClick('decrement');}} className="flex justify-center text-base select-none"><i className="ri-subtract-line text-2xl"></i></div>
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
				audioAlarm.play();
			}
			if (clockMode === 'session') {
				setClockMode('break');
				let convertedBreakLength = convertToSeconds(breakLength);
				setTimeRemaining(convertedBreakLength);
				startTimer();
			}
			if (clockMode === 'break') {
				setClockMode('session');
				let convertedSessionLength = convertToSeconds(sessionLength);
				setTimeRemaining(convertedSessionLength);
				startTimer();
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
		setSessionLength(25);
		setBreakLength(5);
		let convertedLength = convertToSeconds(25);
		setTimeRemaining(convertedLength); // Resets `timeRemaining` to initial `sessionLength`.
	}

	function muteAlarm() {
		setAlarmIsMuted(!alarmIsMuted);
	}

	// -------------- handles changes and click for `SessionLengthControl` Component --------------------------
	function handleSessionChange(event) {
		if (clockIsRunning) {
			return;
		}
		let value = event.target.value;
		// Allow only digits (0-9).
		if (!/^\d*$/.test(value)) {
			return;
		}
		setSessionLength(value === '' ? '' : parseInt(value));
		if (clockMode === 'session') {
			let convertedSessionLength = convertToSeconds(value === '' ? 1 : parseInt(value));
			setTimeRemaining(convertedSessionLength);
		}
	}

	function handleSessionClick(change) {
		if (clockIsRunning) {
			return;
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
			return;
		}
		let value = event.target.value;
		// Allow only digits (0-9)
		if (!/^\d*$/.test(value)) {
			return;
		}
		setBreakLength(value === '' ? '' : parseInt(value));
		if (clockMode === 'break') {
			let convertedBreakLength = convertToSeconds(value === '' ? 1 : parseInt(value));
			setTimeRemaining(convertedBreakLength);
		}
	}

	function handleBreakClick(change) {
		if (clockIsRunning) {
			return;
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
			return;
		}
		switch (true) {
			case component === 'session': {
				if (sessionLength === '' || sessionLength <= 0) {
					setSessionLength(1);
					setTimeRemaining(1 * 60);
				}
				if (sessionLength >= 60) {
					setSessionLength(60);
					setTimeRemaining(60 * 60);
				}
				break;
			}
			case component === 'break': {
				if (breakLength === '' || breakLength <= 0) {
					setBreakLength(1);
					setTimeRemaining(1 * 60);
				}
				if (breakLength >= 60) {
					setBreakLength(60);
					setTimeRemaining(60 * 60);
				}
				break;
			}
		}
	}

	return (
		<div className="App flex h-screen">
			<div id="App-frame" className="flex flex-col gap-[6px] w-fit mx-auto">
				<div className="flex flex-row mx-auto pt-[18px]">
					<p className="text-base select-none">Pomodoro Timer</p>
				</div>
				<hr id="header-hr" />
				<div className="flex flex-row mx-auto mt-7">
					<Timer timeRemaining={timeRemaining} clockMode={clockMode} />
				</div>
				<div id="length-controls-component" className="flex flex-col mx-auto mt-8 gap-4">
					<div className="flex flex-col mx-auto gap-1">
						<SessionLengthControl sessionLength={sessionLength} handleSessionChange={handleSessionChange} handleBlur={handleBlur} handleSessionClick={handleSessionClick} />
						<p id="session-label" className="text-center select-none">Session Length</p>
					</div>
					<hr id="length-controls-hr" className="control-hr" />
					<div className="flex flex-col mx-auto gap-1">
						<BreakLengthControl breakLength={breakLength} handleBreakChange={handleBreakChange} handleBlur={handleBlur} handleBreakClick={handleBreakClick} />
						<p id="break-label" className="text-center select-none">Break Length</p>
					</div>
				</div>
				<div className="flex flex-row mx-auto mt-[40px]">
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