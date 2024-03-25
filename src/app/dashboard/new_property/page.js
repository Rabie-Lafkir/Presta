"use client";

// Imports
import MapCard from "@/components/ui/MapCard";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { updateMarkersAtom } from "@/lib/atoms";
import CreatePropertyForm from "@/components/forms/CreateProperty";

//Global Functions

export default function PropertyPage({ params, searchParams }) {
	const [points, setPoints] = useAtom(updateMarkersAtom);
	const markers = useMemo(() => points, []);
	return (
		<div className="w-full flex items-start justify-center gap-x-4">
			<div className="w-full md:w-8/12">
				<MapCard
					styles="min-w-full"
					center={
						points?.[0]?.position || {
							lat: 33.572374435642274,
							lng: -7.599711506827777,
						}
					}
					markers={markers}
					draggable={true}
					modify={true}
					singleMarker={true}
				/>
				<div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit my-5">
					<CreatePropertyForm />
				</div>
			</div>
		</div>
	);
}
