"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CalendarView({ events, dateFn }) {
	const [eventsList, setEventsList] = useState(events);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

	const updateDate = (date) => {
		currentParams.set("date", date);
		router.push(`${pathname}?${currentParams.toString()}`);
	};

	useEffect(() => {
		setEventsList(events);
		console.log("Got the following events");
	}, [events]);
	return (
		<div className="w-full">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="timeGridDay"
				duration={{ days: 2 }}
				locale={frLocale}
				initialEvents={eventsList}
				selectMirror={true}
				timeZone="local"
				allDaySlot={false}
			/>
		</div>
	);
}
