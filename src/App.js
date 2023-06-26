import './App.css';

function Timer() {
	return (
		<div className="flex flex-col items-center justify-center w-[180px] h-[100px] border-2 border-[#EF8847] bg-[#EF8847] rounded-xl">
			<p className="h-[18px] text-center text-md text-[#3D3D3D] select-none">Session</p>
			<p className="h-[40px] text-center text-4xl text-[#3D3D3D]">25:00</p>
		</div>
	);
}

function ControlButtons() {
	return (
		<>
			<div id="control-1">
				{/* insert play button */}
			</div>
			<div id="control-2">
				{/* insert pause button */}
			</div>
			<div id="control-3">
				{/* insert repeat button */}
			</div>
			<div id="control-4">
				{/* insert mute button */}
			</div>
		</>
	);
}


export default function App() {
	return (
		<div className="App flex h-screen bg-[#3c3c3c]">
			<div id="App-frame" className="flex flex-col w-[290px] h-[420px] mx-auto my-auto border-2 border-[#FAF9F6] bg-[#FAF9F6] rounded-lg">
				<div className="flex flex-row mx-auto">
					<p className="text-xl text-[#f14b0e] select-none">25 - 5 Clock</p>
				</div>
				<div className="flex flex-row mx-auto">
					<Timer />
				</div>
				<div className="flex flex-row mx-auto">
					<ControlButtons />
				</div>
			</div>
		</div>
	);
}
