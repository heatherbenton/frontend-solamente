import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import useUsers from "../store/users";

export default function AllData() {
	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				let profile = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
					headers: {
						jwt: localStorage.getItem("token"),
					},
				});
				profile = await profile.json();
				setUserProfile(profile);
			} catch (err) {
				console.log("an error==>>", err);
			}
		})();
	}, []);

	//const users = useUsers((state) => state.users);
	const deleteAll = useUsers((state) => state.deleteAllUsers);

	return (
		<div>
			<ReactJson src={userProfile} displayDataTypes={false} />
			<button
				onClick={deleteAll}
				className="rounded text-white bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-700 hover:to-emerald-400 ... p-2"
			>
				Delete transaction history?
			</button>
		</div>
	);
}
