import logo from "./logo.svg";
import "./App.css";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import * as d3 from "d3";

import {MapContainer, TileLayer, useMap, Marker, Popup, FeatureGroup, Circle, Tooltip, SVGOverlay} from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
		let i = 0;
		return (
			<div className="artistWrap">
				<div className="artistsHeader">
					<h1>TOP ARTISTS</h1>
					{/* <button className="track" /> */}
				</div>
				<div className="artistsContainer">
					{artistsData.map((a, i) => (
						<div key={a.id}>
							<h6>{i + 1}.</h6>
							<img src={a.images[0].url} />
							<h6>{a.name}</h6>
						</div>
					))}
					{/* <div>
					{Object.entries(genreCount).map(([key, value]) => (
						<div key={key}>
							{key}: {value}
						</div>
					))}
				</div> */}
				</div>
			</div>
		);
	};

	const generateMap = () => {
		const preProssessed = Object.entries(genreCount).map(([key, value]) => ({
			genre: key,
			radius: value / 8,
			randomY: Math.floor(Math.random() * (40 - 60) + 60),
			randomX: Math.floor(Math.random() * (40 - 60) + 60),
		}));

		const svgRef = useRef(null);

		useEffect(() => {
			const width = 400;
			const height = 400;
		});

		return (
			<div className="map">
				<MapContainer center={[51.505, -0.52]} zoom={17} scrollWheelZoom={true} wheelPxPerZoomLevel={200}>
					<TileLayer attribution="" url="" />
					<SVGOverlay
						attributes={{stroke: "red"}}
						bounds={[
							[51.4, -1],
							[51.61, -0.04],
						]}
					>
						<rect x="0" y="0" width="100%" height="100%" fill="black" />

						{preProcessed.map((key, index) => (
							<g key={index}>
								<circle r={`${key.radius}%`} cx={`${key.randomX}%`} cy={`${key.randomY}%`} fill="red" />
								<text x={`${key.randomX}%`} y={`${key.randomY}%`} fontSize="15" text-anchor="middle" alignment-baseline="middle" stroke="white">
									{key.genre}
								</text>
							</g>
						))}
					</SVGOverlay>
				</MapContainer>
			</div>
		);
	};

	return (
		<div className="App">
			<div className="App-container">
				<header className="App-header">
					{!token ? <a href={`${endpoint}?client_id=${client_id}&redirect_uri=${redirect}&response_type=token&scope=${scope}`}>log in</a> : ""}

					{artistsData.length === 0 ? <button onClick={getArtists}>start</button> : ""}
					{renderArtists()}
				</header>
				{generateMap()}
			</div>
		</div>
	);
}

export default App;
