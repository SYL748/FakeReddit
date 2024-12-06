import React, { useState } from "react";
import TextInput from "./TextInput";
import Button from "../general/Button";
import './WelcomePage.css';
import axios from "axios";

export default function WelcomePage({ onLogin, onSignup, onGuest, setView, setLoggedIn, setUser}) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
        setErrors({
            ...errors,
            [id]: "",
        });
    };

    const handleSubmit = async () => {
        let newErrors = {};
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.password) newErrors.password = "Password is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setIsSubmitting(true);
            axios.defaults.withCredentials = true;
            try {
                console.log("post login in login.js");
                const res = await axios.post('http://localhost:8000/login',
                    {
                    email: formData.email,
                    password: formData.password,
                    }
                );

                console.log("before second axios")

                try {
                    console.log("calling current axios");
                    const userRes = await axios.get('http://localhost:8000/current-user');
                    console.log(userRes);
                    setUser(userRes.data);
                } catch (errorRes) {
                    setView({type:'login', id: null});
                    setLoggedIn(false);
                }

                if (res.data) { //if this is true, logged in
                    setView({type:'home', id: null});
                    setLoggedIn(true);
                }
        
            } catch (error) {
                console.log(error);
                const errors = error.response.data.errors;
                if (errors.email) {
                    setErrors({email: "Email does not exist."});
                } else if (errors.validPassword) {
                    setErrors({password: "Wrong password. Try again."});
                } else {
                    console.log("Login client side error " + error);
                }
            }
        }

    };

    const handleSignup = () => {
        onSignup();
    };

    const handleGuest = () => {
        onGuest();
    };

    return (
        <div className="welcome-page">
            <h1>Welcome to Phreddit</h1>
            <div className="login-area">
                <h2>Login</h2>
                <TextInput
                    label="Email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    error={errors.email}
                />
                <TextInput
                    label="Password"
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    error={errors.password}
                />
                <Button
                    buttonName="Login"
                    className={`button ${isSubmitting ? 'disabled' : 'hover-orange'}`}
                    onClick={handleSubmit}
                />
            </div>

            <div className="actions">
                <p>Don't have an account?</p>
                <Button
                    buttonName="Sign Up"
                    className={`button ${isSubmitting ? 'disabled' : 'hover-orange'}`}
                    onClick={handleSignup}
                />
                <p>Or</p>
                <Button
                    buttonName="Continue as Guest"
                    className={`button ${isSubmitting ? 'disabled' : 'hover-orange'}`}
                    onClick={handleGuest}
                />
            </div>
        </div>
    );
}
