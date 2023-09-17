import React, {useState} from "react"; // Import React

// Define your audioPreview component
const AudioPreview = (trackData) => {
	const values = {};

	const fTrack = trackData.filter((a) => a.track.preview_url !== null);
	return (
		<div className="gridContainer">
			<div className="gridHeader">
				<h1>SCROLL TO DISCOVER</h1>
			</div>
			<div className="grid">
				{fTrack.map((a, i) => (
					<div
						className="grid-item"
						key={i}
						onMouseEnter={() => {
							try {
								const audio = new Audio(a.track.preview_url);
								audio.play();
								audio.onended = () => {
									audio.pause();
									audio.currentTime = 0;
								};
								values[a.track.name] = audio;
							} catch (error) {
								console.error(error);
							}
						}}
						onMouseLeave={() => {
							try {
								values[a.track.name].pause();
								values[a.track.name].currentTime = 0;
								console.log(values);
							} catch (error) {
								console.error(error);
							}
						}}
					>
						<img src={a.track.album.images[0].url} style={{width: "100%"}} alt={`Track ${i}`} />
					</div>
				))}
			</div>
		</div>
	);
};

export default AudioPreview; // Export the component as the default export
