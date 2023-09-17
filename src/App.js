import logo from "./assets/logo-no-background.png";
import "./App.css";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import * as d3 from "d3";

import {MapContainer, TileLayer, useMap, Marker, Popup, FeatureGroup, Circle, Tooltip, SVGOverlay, Overlay} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import GenreChart from "./forceSimulation";
import AudioPreview from "./audioPreview";

function App() {
	const endpoint = "https://accounts.spotify.com/authorize";
	const client_id = "e2eb80deed934e49905fa157112568d1";
	const redirect = "https://visualised.tech";
	const scope = "user-top-read user-library-modify";

	const [token, setToken] = useState("");
	const [selectedOptions, setSelectedOption] = useState("");
	const [artistsData, setArtistsData] = useState([]);
	const [trackData, setTrackData] = useState([]);
	const [genreCount, setGenreCount] = useState({});
	const [weeklyData, setWeeklyData] = useState([]);
	const [page, setPageData] = useState("");

	useEffect(() => {
		const hash = window.location.hash;

		let access_token = window.localStorage.getItem("access_token");

		if (!access_token && hash) {
			access_token = hash.split("&")[0].split("=")[1];

			window.localStorage.setItem("access_token", access_token);
			window.location.hash = "";
		}

		setToken(access_token);

		if (access_token) {
			getArtists(access_token);
			getTracks(access_token);
			getWeekly(access_token);
		}
	}, []);

	const logout = () => {
		setToken("");
		window.localStorage.removeItem("access_token");
	};

	const getArtists = async (token) => {
		const {data} = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=0`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		let genreObject = {};
		for (const item of data.items) {
			item.genres.forEach((genre) => {
				if (!genreObject[genre]) {
					genreObject[genre] = 1;
				} else {
					genreObject[genre] = genreObject[genre] + 1;
				}
			});
		}

		setArtistsData(data.items);
		setGenreCount(genreObject);
	};

	const renderArtists = () => {
		let i = false;

		return (
			<div className="artistWrap">
				<div className="artistsHeader">
					<h1>
						TOP{" "}
						<button
							className="trackButton"
							onMouseDown={() => {
								setPageData();
							}}
						>
							ARTISTS
						</button>
					</h1>
				</div>
				<div className="artistsContainer">
					<table>
						<tr className="header">
							<td>#</td>
							<td>Icon</td>
							<td></td>
						</tr>
						{artistsData.map((a, i) => (
							<tr>
								<td>
									<h6>{i + 1}.</h6>
								</td>
								<td>
									<img className="image" src={a.images[0].url} />
								</td>
								<td>
									<h6>{a.name}</h6>
								</td>
							</tr>
						))}
					</table>
				</div>
			</div>
		);
	};

	const getTracks = async (token) => {
		const {data} = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		console.log(data.items);
		setTrackData(data.items);
	};

	const renderTracks = () => {
		let i = false;

		return (
			<div className="artistWrap">
				<div className="artistsHeader">
					<h1>
						TOP{" "}
						<button
							className="trackButton"
							onMouseDown={() => {
								setPageData("track");
							}}
						>
							TRACKS
						</button>
					</h1>
				</div>
				<div className="artistsContainer">
					<table>
						<tr className="header">
							<td>#</td>
							<td>Song</td>
							<td></td>
						</tr>
						{trackData.map((a, i) => (
							<tr>
								<td>
									<h6>{i + 1}.</h6>
								</td>
								<td>
									<img className="image" src={a.album.images[0].url} />
								</td>
								<td>
									<h6>
										{a.artists[0].name} -{" "}
										<a href={a.external_urls.spotify} target="_blank" rel="noopener noreferrer">
											{a.name}
										</a>
									</h6>
								</td>
							</tr>
						))}
					</table>
				</div>
			</div>
		);
	};

	const getWeekly = async (token) => {
		const {data} = await axios.get(`https://api.spotify.com/v1/playlists/37i9dQZEVXcGo007niPR1u/tracks?limit=50&offset=0`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		setWeeklyData(data.items);
	};

	return (
		<div className="App">
			<img src={logo} className="logo"></img>
			<h1 className="logoText">Spotify Visualized. {token ? <button onClick={logout}>Sign Out.</button> : ""}</h1>
			<h1 className="footer">made with passion by jaskaran</h1>
			{!token ? (
				<a href={`${endpoint}?client_id=${client_id}&redirect_uri=${redirect}&response_type=token&scope=${scope}`}>log in</a>
			) : (
				<div className="App-container">
					<header className="App-header">{!page ? renderTracks() : renderArtists()}</header>

					<div className="Chart-container">
						<div className="Chart-header">
							<h1>TOP GENRES</h1>
						</div>
						<GenreChart genreCount={genreCount} className="svg"></GenreChart>
					</div>
				</div>
			)}
			{token ? <div className="songSelection">{AudioPreview(weeklyData, token)}</div> : ""}
		</div>
	);
}

export default App;
