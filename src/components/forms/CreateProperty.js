/* eslint-disable react/no-unescaped-entities */
"use client";

import Select from "react-select";
import { useState, useRef } from "react";
import { createProperty } from "@/actions/propertyActions";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";
import { useAtom } from "jotai";
import { updateMarkersAtom } from "@/lib/atoms";
import regions from "../../lib/helpers/moroccanRegions.json";
import { setDefaults, fromAddress } from "react-geocode";

const CreatePropertyForm = () => {
	const supabase = createClient();
	const [points, setPoints] = useAtom(updateMarkersAtom);

	console.log("Init point in prop creation : ", points);

	const getAddCoor = (address) => {
		try {
			console.log("Geo Coding address : ", address);
			setDefaults({
				key: process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY,
				language: "fr",
				region: "ma",
			});

			fromAddress(address)
				.then(({ results }) => {
					if (results?.length == 0) {
						return;
					}
					console.log("Geo encoding results : ", results);
					const { lat, lng } = results[0].geometry.location;
					if (typeof lat == "number" && typeof lng == "number") {
						setPoints([
							{
								position: {
									lat: parseFloat(lat),
									lng: parseFloat(lng),
								},
							},
						]);
						console.log("About to add marker : ", results[0].geometry.location);
						return { lat, lng };
					}
				})
				.catch("Geocoding error");
		} catch (e) {
			console.log("Geocoding error :", e);
		}
	};

	const [status, setStatus] = useState(false);
	const [number, setNumber] = useState(1);
	const [neighborhood, setNeighborhood] = useState();
	const [street, setStreet] = useState();
	const [city, setCity] = useState();
	const [user, setUser] = useState();
	const [userList, setUserList] = useState([]);
	const [members, setMembers] = useState([]);
	const [userRegion, setUserRegion] = useState();
	const ownerRef = useRef();
	const updateUserRegion = (region) => {
		setUserRegion(region);
	};

	const updateUser = async (query) => {
		setUser(query);

		console.log("Searching for : ", query);
		if (query.length < 3) {
			return;
		}
		const filteredUsers = await supabase
			.from("users")
			.select("*")
			.textSearch("username", `'${query}'`)
			.eq("role", "client");

		if (filteredUsers?.data?.length > 0) {
			setMembers([
				{
					id: filteredUsers?.data?.[0].id,
					name: filteredUsers?.data?.[0].username,
				},
			]);

			ownerRef.current.value = filteredUsers?.data?.[0].id;
			console.log("Member is : ", ownerRef.current.value);
		}

		console.log(`Found following users for query :`, filteredUsers);
		setUserList(
			filteredUsers?.data ? filteredUsers?.data.map((el) => el.username) : []
		);
		return filteredUsers;
	};

	return (
		<form className="w-full h-fit" action={createProperty}>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 p-10 justify-items-center gap-x-4">
				<div className="w-full flex flex-col items-start col-span-2 mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Status du bien
					</label>
					<select
						className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
						name="active"
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value={true}>Active</option>
						<option value={false}>Inactif</option>
					</select>
				</div>

				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Type du bien
					</label>
					<select
						className="select w-full text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
						name="property_type"
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value={"maison"}>Maison</option>
						<option value={"bureau"}>Bureau</option>
						<option value={"magasin"}>Magasin</option>
						<option value={"syndique"}>Syndique</option>
					</select>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Nom du bien
					</label>
					<input
						type="text"
						name="property_name"
						placeholder="Maison principale"
						className={
							"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
						}
						onChange={(e) => setStatus(e.target.value)}
					/>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Catégorie du bien
					</label>
					<select
						className="select w-full  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
						name="property_category"
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value={"principal"}>Principal</option>
						<option value={"secondaire"}>Secondaire</option>
					</select>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Numéro d'adresse
					</label>
					<input
						type="number"
						name="number"
						placeholder="105"
						className={
							"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
						}
						onChange={(e) => {
							setNumber(e.target.value);
							getAddCoor(
								`${e.target.value}, ${street}, ${neighborhood}, ${city}`
							);
						}}
					/>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Rue
					</label>
					<input
						type="text"
						name="street"
						placeholder="Bd Zerkoutouni"
						className={
							"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
						}
						onChange={(e) => {
							setStreet(e.target.value);
							getAddCoor(
								`${number}, ${e.target.value}, ${neighborhood}, ${city}`
							);
						}}
					/>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Quartier
					</label>
					<input
						type="text"
						name="neighborhood"
						placeholder="Maarif"
						className={
							"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
						}
						onChange={(e) => {
							setNeighborhood();
							getAddCoor(`${number}, ${street}, ${e.target.value}, ${city}`);
						}}
					/>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Ville
					</label>
					<input
						type="text"
						name="city"
						placeholder="Casablanca"
						className={
							"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
						}
						onInput={(e) => {
							setCity(e.target.value);
							getAddCoor(
								`${number}, ${street}, ${neighborhood}, ${e.target.value}`
							);
						}}
					/>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Région
					</label>
					<Select
						options={regions.map((region) => ({
							value: region.region,
							label: region.region,
						}))}
						name="region"
						placeholder="Veuillez choisir une région ..."
						unstyled={true}
						defaultInputValue={updateUserRegion}
						classNames={{
							control: (state) =>
								"select w-full input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400",
							option: (state) => "text-blue-600 px-5 py-2 bg-white",
							menu: (state) => "shadow",
							noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
							container: (state) => "w-full",
						}}
					/>
				</div>
				<div className="divider  border-blue-950 min-w-full col-span-2"></div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Indications
					</label>
					<textarea
						type="text"
						name="directions"
						placeholder="Indiquer comment accéder à la propriété du client"
						className={
							"textarea textarea-bordered textarea-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
						}
						onChange={(e) => setStatus(e.target.value)}
					/>
				</div>
				<div className="divider  border-blue-950 min-w-full col-span-2"></div>
				<div className="w-full flex flex-col items-start mb-5">
					<SearchDropdown
						values={[...userList]}
						label={"Choissisez un utilisateur"}
						placeholder={"Veuillez choisir un utilisateur ..."}
						name="user"
						inputFn={updateUser}
					/>
					<input name="owner" className="hidden" ref={ownerRef} />
				</div>
				<input
					name="location_lat"
					value={points?.[0]?.position.lat}
					defaultValue={points?.[0]?.position.lat}
					className="hidden"
				/>
				<input
					name="location_long"
					value={points?.[0]?.position.lng}
					defaultValue={points?.[0]?.position.lng}
					className="hidden"
				/>
			</div>

			<div className="w-full flex flex-col items-center justify-center mb-5">
				<button
					className="flex items-center bg-emerald-500 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none"
					type="submit"
					disabled={points?.length == 0 || !points?.[0]?.position.lng}
				>
					Sauvegarder
				</button>
			</div>
		</form>
	);
};

export default CreatePropertyForm;
