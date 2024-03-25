"use client";

import {
	useLoadScript,
	GoogleMap,
	MarkerF,
	PolygonF,
	PolylineF,
} from "@react-google-maps/api";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useAtom } from "jotai";

import { updateMarkersAtom } from "@/lib/atoms";

const MapCard = ({
	styles,
	width,
	height = "400px",
	markers = [],
	singleMarker = false,
	center,
	draggable = false,
	zoom = 17,
	modify = false,
}) => {
	const [points, setPoints] = useAtom(updateMarkersAtom);
	const mapCenter = useMemo(() => center, [center]);

	useEffect(() => {
		console.log("Got points in map : ", markers, points);
		setPoints([...markers]);
	}, [markers]);

	const mapOptions = useMemo(
		() => ({
			disableDefaultUI: false,
			clickableIcons: true,
			scrollwheel: false,
			draggable,
		}),
		[draggable]
	);

	const { isLoaded } = useLoadScript({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY,
	});

	if (!isLoaded) {
		return (
			<div className="h-36 flex justify-center items-center bg-white rounded-lg shadow-lg">
				<p className="text-purple-400">Loading...</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full rounded-lg shadow-lg">
			<GoogleMap
				options={mapOptions}
				zoom={zoom}
				center={mapCenter}
				mapTypeId={google.maps.MapTypeId.ROADMAP}
				onClick={(e) => {
					if (!modify) {
						return;
					}
					if (!singleMarker) {
						setPoints([
							...points,
							{ position: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
						]);
					} else {
						setPoints([
							{ position: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
						]);
					}
				}}
				mapContainerStyle={{ width, height }}
				className={cn(`w-full h-full rounded-lg ${styles}`)}
			>
				{points.map((marker, i) => (
					<MarkerF
						key={i + 1}
						position={marker.position}
						label={{ text: `${i + 1}`, fontWeight: "bold", color: "white" }}
						onLoad={() => console.log("Marker Loaded", marker.position)}
						onClick={(e) => {
							if (!modify) {
								return;
							}
							console.log("clicked marker : ", marker);
							setPoints(points.filter((el) => points.indexOf(el) != i));
						}}
					/>
				))}

				<PolylineF
					editable={false}
					draggable={false}
					path={points.map((el) => el.position)}
					options={{
						strokeColor: "red",
					}}
				/>

				{!modify && (
					<PolygonF
						editable={false}
						draggable={false}
						path={points.map((el) => el.position)}
						options={{
							fillColor: "red",
							strokeColor: "red",
						}}
					/>
				)}
			</GoogleMap>
		</div>
	);
};

export default MapCard;
