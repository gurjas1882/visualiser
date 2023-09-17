import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {MapContainer, TileLayer, Marker} from "react-leaflet";

const GenreChart = ({genreCount}) => {
	const svgRef = useRef(null);

	useEffect(() => {
		if (!genreCount) return;
		const width = 750;
		const height = 750;
		const preProcessed = Object.entries(genreCount).map(([key, value]) => ({
			genre: key,
			radius: value * 6,
		}));

		const simulation = d3
			.forceSimulation(preProcessed)
			.force(
				"collide",
				d3
					.forceCollide()
					.radius((d) => d.radius + 2)
					.strength(0.8)
			)
			.force("center", d3.forceCenter(width / 2, height / 2));

		const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

		const groups = svg.selectAll("g").data(preProcessed).enter().append("g");

		groups
			.append("circle")
			.attr("r", (d) => d.radius)
			.attr("fill", "#8967e9");

		groups
			.append("text")
			.attr("font-size", 15)
			.attr("font-weight", 100)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.attr("stroke", "white")
			.text((d) => d.genre);

		simulation.on("tick", () => {
			groups.attr("transform", (d) => `translate(${d.x},${d.y})`);
		});
	}, [genreCount]);

	return <svg ref={svgRef} className="svg"></svg>;
};

export default GenreChart;
