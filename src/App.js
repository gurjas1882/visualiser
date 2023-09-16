import logo from "./logo.svg";
import "./App.css";
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
	const endpoint = "https://accounts.spotify.com/authorize";
	const client_id = "e2eb80deed934e49905fa157112568d1";
	const redirect = "http://localhost:3000";
	const scope = "user-top-read";

	const [token, setToken] = useState(0);

	useEffect(() => {
		const hash = window.location.hash;

		let access_token = window.localStorage.getItem("access_token");

		if (!access_token && hash) {
			access_token = hash.split("&")[0].split("=")[1];

			window.localStorage.setItem("access_token", access_token);
			window.location.hash = "";
			console.log(access_token);
		}

		setToken(access_token);
	}, []);

	async function getArtists() {
		const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists?limit=50&offset=0", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		for (const item of data.items) {
			console.log(item.name, item.genres);
		}
	}

	return (
		<div className="App">
			<header className="App-header">
				<a href={`${endpoint}?client_id=${client_id}&redirect_uri=${redirect}&response_type=token&scope=${scope}`}>log in</a>
				<button onClick={getArtists}>wad</button>
			</header>
		</div>
	);
}

export default App;
