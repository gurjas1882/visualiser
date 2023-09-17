import axios from "axios";
import React, {useState} from "react"; // Import React

const AudioPreview = (trackData, token) => {
	const values = {};

	const fTrack = trackData.filter((a) => a.track.preview_url !== null);
	return (
		<div className="gridContainer">
			<div className="gridHeader">
				<h1>SCROLL TO DISCOVER</h1>
				<h5>hover over the images to preview music. click to save to spotify.</h5>
			</div>
			<div className="grid">
				{fTrack.map((a, i) => (
					<div
						className="grid-item"
						title={`${a.track.name} - ${a.track.artists[0].name}`}
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
								console.log(a);
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
						onMouseDown={() => {
							console.log("wih");
							console.log(token);
							axios.put(`https://api.spotify.com/v1/me/tracks?ids=${a.track.id}`, {
								headers: {
									Authorization: `Bearer ${token}`,
								},
							});
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
