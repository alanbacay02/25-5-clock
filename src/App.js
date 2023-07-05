import './App.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRepeat, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

function Timer({ timeRemaining, clockMode }) {
	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const secondsFormatted = String(seconds % 60).padStart(2, '0');
		return `${minutes}:${secondsFormatted}`;
	}

	return (
		<div id="timer-display" className="flex flex-col items-center justify-center w-[140px] h-[90px] bg-[#ff7e2e] rounded-xl select-none">
			<p id="timer-label" className="h-[14px] text-center text-sm text-[#414141]">{clockMode === 'session' ? 'Session' : 'Break'}</p>
			<p id="time-left" className="h-[36px] text-center text-3xl text-[#414141]">{formatTime(timeRemaining)}</p>
		</div>
	);
}
Timer.propTypes = {
	timeRemaining: PropTypes.number.isRequired,
	clockMode: PropTypes.string.isRequired
};

function ControlPanelButtons({ clockIsRunning, startTimer, pauseTimer, resetTimer }) {
	return (
		<div className="flex flex-row gap-3 mx-auto pt-[6px] pb-[8px] px-[10px] bg-gray-100 rounded-md shadow-inner">
			<div id="start_stop" onClick={clockIsRunning ? pauseTimer : startTimer} className="control-panel-buttons">
				<FontAwesomeIcon className="text-[10.5px] pr-[1px]" icon={faPlay} /><FontAwesomeIcon className="text-[12px]" icon={faPause}  />
			</div>
			{/* <div id="control-2" onClick={() => {}} className="control-panel-buttons">
				<FontAwesomeIcon icon={faPause}  />
			</div> */}
			<div id="reset" onClick={resetTimer} className="control-panel-buttons">
				<FontAwesomeIcon className="text-[12px]" icon={faRepeat} />
			</div>
			<div id="mute" onClick={() => {}} className="control-panel-buttons">
				<FontAwesomeIcon className="text-[12px]" icon={faVolumeMute} />
			</div>
		</div>
	);
}
ControlPanelButtons.propTypes = {
	clockIsRunning: PropTypes.bool.isRequired,
	resetTimer: PropTypes.func.isRequired,
	startTimer: PropTypes.func.isRequired,
	pauseTimer: PropTypes.func.isRequired
};

function SessionLengthControl({ sessionLength, handleSessionChange, handleBlur, handleSessionClick }) {
	return (
		<div className="flex flex-row justify-center items-center gap-2 pt-1 px-[6px] pb-[6px] bg-gray-100 rounded-md shadow-inner">
			<div id="session-increment" onClick={() => {handleSessionClick('increment');}} className="control-length-buttons select-none">+</div>
			<div className="flex items-center justify-center w-16 h-10 my-auto text-center bg-slate-300 rounded-md shadow-inner">
				<input
					id="session-length"
					type="text" 
					inputMode="numeric" 
					minLength="1" 
					maxLength="2" 
					value={sessionLength}
					onChange={handleSessionChange}
					onBlur={() => {handleBlur('session');}}
					className="max-w-[64px] text-center bg-inherit bg-opacity-0 focus:outline-none"/>
			</div>
			<div id="session-decrement" onClick={() => {handleSessionClick('decrement');}} className="control-length-buttons select-none">-</div>
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
		<div className="flex flex-row justify-center items-center gap-2 pt-1 px-[6px] pb-[6px] bg-gray-100 rounded-md shadow-inner">
			<div id="break-increment" onClick={() => {handleBreakClick('increment');}} className="control-length-buttons select-none">+</div>
			<div className="flex items-center justify-center w-16 h-10 my-auto text-center bg-slate-300 rounded-md shadow-inner">
				<input
					id="break-length"
					type="text" 
					inputMode="numeric" 
					minLength="1" 
					maxLength="2" 
					value={breakLength}
					onChange={handleBreakChange}
					onBlur={() => {handleBlur('break');}}
					className="max-w-[64px] text-center bg-inherit bg-opacity-0 focus:outline-none"/>
			</div>
			<div id="break-decrement" onClick={() => {handleBreakClick('decrement');}} className="control-length-buttons select-none">-</div>
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
	// Creates state `sessionLength` to store length of session time.
	const [sessionLength, setSessionLength] = useState(25);
	// Creates state `breakLength` to store length of break time.
	const [breakLength, setBreakLength] = useState(5);



	useEffect(() => {
		// Stop the countdown when `timeRemaining` reaches -1.
		// We use -1 so we can display 0 to the clock before resetting to new mode.
		if (timeRemaining === 0) {
			clearInterval(timerId);
			// Perform any necessary actions when the countdown ends.
			// Create an audio element
			let audio = new Audio('/soundfx/alarm_sfx.mp3');

			// Set the source and attributes
			audio.src = '/soundfx/alarm_sfx.mp3';
			audio.id = 'beep';
			audio.play();
			
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
		setBreakLength(value === '' ? 1 : parseInt(value));
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
		<div className="App flex h-screen bg-[#3c3c3c]">
			<div id="App-frame" className="flex flex-col gap-2 w-[240px] h-[420px] mx-auto my-auto border-2 border-[#fdf9f3] bg-[#fdf9f3] rounded-lg">
				<div className="flex flex-row mx-auto pt-3">
					<p className="text-xl text-[#f14b0e] select-none">25 + 5 Clock</p>
				</div>
				<div className="flex flex-row mx-auto">
					<Timer timeRemaining={timeRemaining} clockMode={clockMode} />
				</div>
				<div className="flex flex-row mx-auto">
					<ControlPanelButtons clockIsRunning={clockIsRunning} startTimer={startTimer} pauseTimer={pauseTimer} resetTimer={resetTimer} />
				</div>
				<div className="flex flex-col mx-auto">
					<p id="session-label" className="text-center select-none">Session Length</p>
					<SessionLengthControl sessionLength={sessionLength} handleSessionChange={handleSessionChange} handleBlur={handleBlur} handleSessionClick={handleSessionClick} />
				</div>
				<div className="flex flex-col mx-auto">
					<p id="break-label" className="text-center select-none">Break Length</p>
					<BreakLengthControl breakLength={breakLength} handleBreakChange={handleBreakChange} handleBlur={handleBlur} handleBreakClick={handleBreakClick} />
				</div>
			</div>
		</div>
	);
}

// Helper function `convertToSeconds`.
function convertToSeconds(minutes) {
	return minutes * 60;
}