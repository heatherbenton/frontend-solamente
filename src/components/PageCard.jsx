import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
/// import useUsers from "../store/users";

export default function PageCard({ action }) {
	const [accounts, setAccounts] = useState([]);
	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				let accounts = await fetch(
					`${process.env.REACT_APP_API_URL}/account/all`,
					{
						headers: {
							jwt: localStorage.getItem("token"),
						},
					}
				);
				accounts = await accounts.json();
				setAccounts(accounts);
			} catch (err) {
				console.log("an error==>>", err);
			}
		})();
	}, []);

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

	// const users = useUsers((state) => state.users);

	/// const changeBalance = useUsers((state) => state.changeBalance);

	const formik = useFormik({
		initialValues: {
			amount: 0,
			acctNo: "",
		},
		onSubmit: () => handleSubmit(),
	});

	const changeBal = async (acctNo, amount, action) => {
		if (action === "Withdraw") amount = amount * -1;
		try {
			let updatedAcct = await fetch(
				`${process.env.REACT_APP_API_URL}/account/change_balance`,
				{
					method: "post",
					body: JSON.stringify({ acctNo, amount }),
					headers: {
						jwt: localStorage.getItem("token"),
						"content-type": "application/json",
					},
				}
			);
			await updatedAcct.json();
		} catch (err) {
			console.log("an error==>>", err);
		}
	};

	const handleSubmit = () => {
		if (isNaN(formik.values.amount) === true) {
			alert("please enter numbers only");
			return;
		}

		if (formik.values.amount <= 0) {
			alert("please enter only a positive numbers");
			return;
		}

		// 		let user = users.find((user) => user.email === formik.values.userEmail);
		if (!userProfile) {
			alert("invalid credentials");
			return;
		}

		if (action === "Withdraw") {
			if (formik.values.amount > userProfile.balance) {
				alert("transaction invalid");
				return;
			}
		}

		changeBal(formik.values.acctNo, formik.values.amount, action);
		alert("Success!");
	};

	return (
		<div className="flex justify-center">
			<form
				className="flex flex-col bg-orange-100 rounded-lg p-6 m-12 space-y-4"
				onSubmit={formik.handleSubmit}
			>
				<h3 className="flex flex-col space-y-1 bg-orange-100 rounded-lg p-6text-lg font-semibold">
					{action}
				</h3>
				<div className="flex flex-col">
					<label htmlFor="acctNo">Acct Number</label>
					<select
						type="number"
						id="acctNo"
						onChange={formik.handleChange}
						value={formik.values.acctNo}
					>
						<option value="">Select Acct No</option>
						{accounts.map((acct, i) => (
							<option key={i} value={acct.acctNo}>
								{acct.acctNo}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col">
					<label htmlFor="amount">{`${action}:`}</label>
					<input
						type="number"
						id="amount"
						name="amount"
						onChange={formik.handleChange}
						value={formik.values.amount}
					/>
				</div>

				<button
					type="submit"
					disabled={!formik.values.amount}
					className={`rounded bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-700 hover:to-emerald-400 ... py-2 font-semibold ${
						!formik.values.amount && "text-gray-50"
					}`}
				>
					Submit
				</button>
			</form>
		</div>
	);
}
