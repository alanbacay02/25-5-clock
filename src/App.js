import './App.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRepeat, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

function Timer({ timeRemaining, clockMode }) {
	return (
		<div id="timer-display" className="flex flex-col items-center justify-center w-[140px] h-[90px] bg-[#ff7e2e] rounded-xl select-none">
			<p id="timer-label" className="h-[14px] text-center text-sm text-[#414141]">{clockMode === 'session' ? 'Session' : 'Break'}</p>
			<p id="time-left" className="h-[36px] text-center text-3xl text-[#414141]">{timeRemaining}</p>
		</div>
	);
}
Timer.propTypes = {
	timeRemaining: PropTypes.number.isRequired
};

function ControlPanelButtons({ timerIsRunning, startTimer, pauseTimer, resetTimer }) {
	return (
		<div className="flex flex-row gap-3 mx-auto pt-[6px] pb-[8px] px-[10px] bg-gray-100 rounded-md shadow-inner">
			<div id="start_stop" onClick={timerIsRunning ? pauseTimer : startTimer} className="control-panel-buttons">
				<FontAwesomeIcon className="text-[10.5px] pr-[1px]" icon={faPlay} /><FontAwesomeIcon className="text-[12px]" icon={faPause}  />
			</div>
			{/* <div id="control-2" onClick={() => {}} className="control-panel-buttons">
				<FontAwesomeIcon icon={faPause}  />
			</div> */}
			<div id="control-3" onClick={resetTimer} className="control-panel-buttons">
				<FontAwesomeIcon className="text-[12px]" icon={faRepeat} />
			</div>
			<div id="control-4" onClick={() => {}} className="control-panel-buttons">
				<FontAwesomeIcon className="text-[12px]" icon={faVolumeMute} />
			</div>
		</div>
	);
}
ControlPanelButtons.propTypes = {
	timerIsRunning: PropTypes.bool.isRequired,
	resetTimer: PropTypes.func.isRequired,
	startTimer: PropTypes.func.isRequired,
	pauseTimer: PropTypes.func.isRequired
};

function SessionLengthControl({ sessionLength, handleSessionChange, handleBlur, handleSessionClick, timerIsRunning }) {
	return (
		<div className="flex flex-row justify-center items-center gap-2 pt-1 px-[6px] pb-[6px] bg-gray-100 rounded-md shadow-inner">
			<div id="session-increment" onClick={timerIsRunning ? () => {} : () => {handleSessionClick('increment');}} className="control-length-buttons select-none">+</div>
			<div className="flex items-center justify-center w-16 h-10 my-auto text-center bg-slate-300 rounded-md shadow-inner">
				<input
					type="text" 
					inputMode="numeric" 
					minLength="1" 
					maxLength="2" 
					value={sessionLength}
					onChange={timerIsRunning ? () => {} : handleSessionChange}
					onBlur={timerIsRunning ? () => {} : () => {handleBlur('session');}}
					className="max-w-[64px] text-center bg-inherit bg-opacity-0 focus:outline-none"/>
			</div>
			<div id="session-decrement" onClick={timerIsRunning ? () => {} : () => {handleSessionClick('decrement');}} className="control-length-buttons select-none">-</div>
		</div>
	);
}
SessionLengthControl.propTypes = {
	sessionLength: PropTypes.number.isRequired,
	handleSessionChange: PropTypes.func.isRequired,
	handleBlur: PropTypes.func.isRequired,
	handleSessionClick: PropTypes.func.isRequired
};

function BreakLengthControl({ breakLength, handleBreakChange, handleBlur, handleBreakClick, timerIsRunning }) {
	return (
		<div className="flex flex-row justify-center items-center gap-2 pt-1 px-[6px] pb-[6px] bg-gray-100 rounded-md shadow-inner">
			<div id="session-increment" onClick={timerIsRunning ? () => {} : () => {handleBreakClick('increment');}} className="control-length-buttons select-none">+</div>
			<div className="flex items-center justify-center w-16 h-10 my-auto text-center bg-slate-300 rounded-md shadow-inner">
				<input
					type="text" 
					inputMode="numeric" 
					minLength="1" 
					maxLength="2" 
					value={breakLength}
					onChange={timerIsRunning ? () => {} : handleBreakChange}
					onBlur={timerIsRunning ? () => {} : () => {handleBlur('break');}}
					className="max-w-[64px] text-center bg-inherit bg-opacity-0 focus:outline-none"/>
			</div>
			<div id="session-decrement" onClick={timerIsRunning ? () => {} : () => {handleBreakClick('decrement');}} className="control-length-buttons select-none">-</div>
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
	const [timeRemaining, setTimeRemaining] = useState(25);
	// Creates state `clockMode` to store mode of the clock;
	const [clockMode, setClockMode] = useState('session');
	// Creates state `timerIsRunning` to store on and off state of the clock.
	const [timerIsRunning, setTimerIsRunning] = useState(false);
	// Creates state `timerIsPaused` to store state of clock when paused.
	const [timerIsPaused, setTimerIsPaused] = useState(false);
	// Creates state `timerId` to store ID of timer on interval start.
	const [timerId, setTimerId] = useState(null);
	// Creates state `sessionLength` to store length of session time.
	const [sessionLength, setSessionLength] = useState(25);
	// Creates state `breakLength` to store length of break time.
	const [breakLength, setBreakLength] = useState(5);

	useEffect(() => {
		// Stop the countdown when `timeRemaining` reaches -1.
		// We use -1 so we can display 0 to the clock before resetting to new mode.
		if (timeRemaining === -1) {
			setTimerIsRunning(false);
			clearInterval(timerId);
			// Perform any necessary actions when the countdown ends.
			if (clockMode === 'session') {
				setClockMode('break');
				setTimeRemaining(breakLength);
				setTimerIsPaused(true);
				startTimer();
			}
			if (clockMode === 'break') {
				setClockMode('session');
				setTimeRemaining(sessionLength);
				setTimerIsPaused(true);
				startTimer();
			}
		}
	}, [timeRemaining, timerId]);

	function startTimer() {
		// Checks if timer is not paused. When true, the clock does not need to continue
		// from its previous state and can be assigned a new state to start from.
		if (!timerIsPaused) {
			setTimeRemaining(sessionLength);
		}
		
		setTimerIsRunning(true); // sets `timerIsRunning` state to true.
		setTimerIsPaused(false); // sets `timerIsPaused` state to false.

		// Starts the countdown for the clock.
		const timer = setInterval(() => {
			setTimeRemaining(prevTime => prevTime - 1);
		}, 1000);

		// Gets the timer id assigned to `timer` and stores it in state `timerId`.
		setTimerId(timer);
	}

	function pauseTimer() {
		setTimerIsRunning(false); // Changes `timerIsRunning` state of clock to false.
		setTimerIsPaused(true); // Changes `timerIsPaused` state of clock to true.

		// Clears the interval.
		clearInterval(timerId);
	}

	function resetTimer() {
		// Checks if clock is till running. When true, it clears the interval.
		if (timerIsRunning) {
			clearInterval(timerId);
		}

		setTimerIsRunning(false); // Sets states to false to prepare for new countdown.
		setTimerIsPaused(false); // Sets states to false to prepare for new countdown.
		setClockMode('session'); // Sets clock back to session mode.
		setTimeRemaining(sessionLength); // Resets `timeRemaining` to initial `sessionLength`.
	}


	function handleSessionChange(event) {
		let value = event.target.value;
		// Allow only digits (0-9)
		if (!/^\d*$/.test(value)) {
			return;
		}
		setSessionLength(value === '' ? '' : parseInt(value));
	}

	function handleSessionClick(change) {
		let updatedSessionLength = sessionLength;
		if (updatedSessionLength >= 60 && change === 'increment') {
			return;
		}
		if (updatedSessionLength <= 1 && change === 'decrement') {
			return;
		}
		if (change === 'increment') {
			updatedSessionLength = updatedSessionLength + 1;
			setSessionLength(updatedSessionLength);
			clockMode === 'session' ? setTimeRemaining(updatedSessionLength) : () => {};
		}
		if (change === 'decrement') {
			updatedSessionLength = updatedSessionLength - 1;
			setSessionLength(updatedSessionLength);
			clockMode === 'session' ? setTimeRemaining(updatedSessionLength) : () => {};
		}
	}

	function handleBreakChange(event) {
		let value = event.target.value;
		// Allow only digits (0-9)
		if (!/^\d*$/.test(value)) {
			return;
		}
		setBreakLength(value === '' ? '' : parseInt(value));
	}

	function handleBreakClick(change) {
		let updatedBreakLength = breakLength;
		if (updatedBreakLength >= 60 && change === 'increment') {
			return;
		}
		if (updatedBreakLength <= 1 && change === 'decrement') {
			return;
		}
		if (change === 'increment') {
			updatedBreakLength = updatedBreakLength + 1;
			setBreakLength(updatedBreakLength);
			clockMode === 'break' ? setTimeRemaining(updatedBreakLength) : () => {};
		}
		if (change === 'decrement') {
			updatedBreakLength = updatedBreakLength - 1;
			setBreakLength(updatedBreakLength);
			clockMode === 'break' ? setTimeRemaining(updatedBreakLength) : () => {};
		}
	}

	function handleBlur(component) {
		let newSessionTime = sessionLength;
		switch (true) {
			case component === 'session':
				if (sessionLength === '' || sessionLength <= 0) {
					setSessionLength(1);
					newSessionTime = 1;
				}
				if (sessionLength >= 60) {
					setSessionLength(60);
					newSessionTime = 60;
				}
				break;
			case component === 'break':
				if (breakLength === '' || breakLength <= 0) {
					setBreakLength(1);
				}
				if (breakLength >= 60) {
					setBreakLength(60);
				}
				break;
		}
		setTimeRemaining(newSessionTime);
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
					<ControlPanelButtons timerIsRunning={timerIsRunning} startTimer={startTimer} pauseTimer={pauseTimer} resetTimer={resetTimer} />
				</div>
				<div className="flex flex-col mx-auto">
					<p className="text-center select-none">Session Length</p>
					<SessionLengthControl sessionLength={sessionLength} handleSessionChange={handleSessionChange} handleBlur={handleBlur} handleSessionClick={handleSessionClick} timerIsRunning={timerIsRunning} />
				</div>
				<div className="flex flex-col mx-auto">
					<p className="text-center select-none">Break Length</p>
					<BreakLengthControl breakLength={breakLength} handleBreakChange={handleBreakChange} handleBlur={handleBlur} handleBreakClick={handleBreakClick} timerIsRunning={timerIsRunning} />
				</div>
			</div>
		</div>
	);
}
