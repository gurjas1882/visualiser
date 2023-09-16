import logo from "./logo.svg";
import "./App.css";
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
	const endpoint = "https://accounts.spotify.com/authorize";
	const client_id = "e2eb80deed934e49905fa157112568d1";
	const redirect = "http://localhost:3000";
	const scope = "user-top-read";

	const [token, setToken] = useState("");
	const [selectedOptions, setSelectedOption] = useState("");
	const [artistsData, setArtistsData] = useState([]);
	const [genreCount, setGenreCount] = useState({});

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

	const getArtists = async () => {
		const {data} = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=0`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(data);
		let genreObject = {};
		for (const item of data.items) {
			console.log(item);
			item.genres.forEach((genre) => {
				if (!genreObject[genre]) {
					genreObject[genre] = 1;
				} else {
					console.log("dupe");
					genreObject[genre] = genreObject[genre] + 1;
				}
			});
		}

		setArtistsData(data.items);
		setGenreCount(genreObject);
	};

	const handleOptionChange = (event) => {
		setSelectedOption(event.target.value);
		console.log(selectedOptions);
		getArtists();
	};

	const renderArtists = () => {
		return (
			<div className="artistsContainer">
				{artistsData.map((a) => (
					<div key={a.id}>
						<img src={a.images[0].url} />
						{a.name}
					</div>
				))}
				<div>
					{Object.entries(genreCount).map(([key, value]) => (
						<div key={key}>
							{key}: {value}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="App">
			<header className="App-header">
				{!token ? <a href={`${endpoint}?client_id=${client_id}&redirect_uri=${redirect}&response_type=token&scope=${scope}`}>log in</a> : ""}

				<button onClick={getArtists}>start</button>
				{renderArtists()}
			</header>
		</div>
	);
}

export default App;
