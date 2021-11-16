import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import useUsers from "../store/users";

export default function CreateAccount({ setPopUp }) {
	const addUser = useUsers((state) => state.addUser);
	const history = useHistory();

	const formik = useFormik({
		initialValues: {
			acctName: "",
			balance: "",
		},
		onSubmit: async (values) => {
			try {
				const { acctName, balance } = values;
				const user = await fetch(
					`${process.env.REACT_APP_API_URL}/account/open`,
					{
						method: "post",
						headers: {
							"Content-Type": "application/json",
							jwt: localStorage.getItem("token"),
						},
						body: JSON.stringify({ acctName, balance }),
					}
				);
				await user.json();
				addUser({
					acctName,
					balance,
				});
				formik.setValues({
					acctName: "",
					balance: "",
				});
				history.push("/deposit");
			} catch (err) {
				console.log("an errr==>>", err);
			}
		},
	});

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		if (formik.values.acctName && formik.values.balance) setDisabled(false);
		else setDisabled(true);
	}, [formik.values]);

	return (
		<div className="flex justify-center">
			<form
				onSubmit={formik.handleSubmit}
				className="flex flex-col space-y-1 bg-orange-100 rounded-lg p-6 m-12"
			>
				<h3 className=" flex flex-col space-y-1 bg-orange-100 rounded-lg p-6text-lg font-semibold">
					Open a New Bank Account
				</h3>

				<div className="flex flex-col">
					<label htmlFor="acctName">Account Name</label>
					<input
						type="text"
						id="acctName"
						name="acctName"
						onChange={formik.handleChange}
						value={formik.values.acctName}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="balance">Account Balance</label>
					<input
						type="number"
						id="balance"
						name="balance"
						onChange={formik.handleChange}
						value={formik.values.balance}
					/>
				</div>
				<button
					type="submit"
					disabled={disabled}
					className={`rounded bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-700 hover:to-emerald-400 ... py-2 font-semibold ${
						disabled && "text-gray-50"
					}`}
				>
					Create Account
				</button>
			</form>
		</div>
	);
}
