import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import useUsers from "../store/users";

export default function CreateAccount({ setPopUp }) {
	const addUser = useUsers((state) => state.addUser);
	const history = useHistory();

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmit: async (values) => {
			try {
				const { name, email, password } = values;
				let token = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name, email, password }),
				});
				token = await token.json();
				localStorage.setItem("token", token);
				addUser({
					name,
					email,
					password,
				});
				formik.setValues({
					email: "",
					name: "",
					password: "",
				});
				history.push("/account");
			} catch (err) {
				console.log("an errr==>>", err);
			}
		},
	});

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		if (formik.values.name && formik.values.name && formik.values.password)
			setDisabled(false);
		else setDisabled(true);
	}, [formik.values]);

	return (
		<div className="flex justify-center">
			<form
				onSubmit={formik.handleSubmit}
				className="flex flex-col space-y-1 bg-orange-100 rounded-lg p-6 m-12"
			>
				<h3 className=" flex flex-col space-y-1 bg-orange-100 rounded-lg p-6text-lg font-semibold">
					Create a New User Account
				</h3>

				<div className="flex flex-col">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						onChange={formik.handleChange}
						value={formik.values.name}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						onChange={formik.handleChange}
						value={formik.values.email}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						onChange={formik.handleChange}
						value={formik.values.password}
					/>
				</div>
				<button
					type="submit"
					disabled={disabled}
					className={`rounded bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-700 hover:to-emerald-400 ... py-2 font-semibold ${
						disabled && "text-gray-50"
					}`}
				>
					Sign up!
				</button>
			</form>
		</div>
	);
}
