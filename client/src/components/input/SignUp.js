/*
TODO: 
    - Add an account created successfully.
    - Add an email not found when logging in.
*/


import React, { useState } from "react";
import TextInput from "./TextInput";
import Button from "../general/Button";
import './SignupPage.css';
import axios from "axios";

export default function SignupPage( {onSignupComplete} ) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        displayName: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
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
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailLocalPart = formData.email?.split("@")[0];
    
        if (!formData.firstName) newErrors.firstName = "First name is required.";
        if (!formData.lastName) newErrors.lastName = "Last name is required.";
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }
        if (!formData.displayName) newErrors.displayName = "Display name is required.";
        if (!formData.password) newErrors.password = "Password is required.";
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        if (formData.password.includes(formData.firstName)) {
            newErrors.password = "Password cannot contain your first name.";
        }
        if (formData.password.includes(formData.lastName)) {
            newErrors.password = "Password cannot contain your last name.";
        }
        if (formData.password.includes(formData.displayName)) {
            newErrors.password = "Password cannot contain your display name.";
        }
        if (formData.password.includes(formData.email)) {
            newErrors.password = "Password cannot contain your email.";
        }
        if (emailLocalPart && formData.password.includes(emailLocalPart)) {
            newErrors.password = "Password cannot contain the local part of your email.";
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setIsSubmitting(true);

            try {
                // console.log("post login in signup.js");
                await axios.post('http://localhost:8000/signup',
                    {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    displayName: formData.displayName,
                    password: formData.password,
                    }
                );

                onSignupComplete();
            } catch (error) {
                //console.log(error);
                const errors = error.response.data.errors;

                if (errors.displayName && errors.email) {
                    setErrors({email: "Email already registered.", displayName: "Display name is already taken."});
                } else if (errors.displayName) {
                    setErrors({displayName: "Display name is already taken."});
                } else if (errors.email) {
                    setErrors({displayName: "Email already registered."});
                } else {
                    console.log("Error in sign up: " + error);
                }
            }
        }
    };

    return (
        <div className="signup-page">
            <h1>Create an Account</h1>
            <div className="signup-form">
                <TextInput
                    label="First Name"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    error={errors.firstName}
                />
                <TextInput
                    label="Last Name"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    error={errors.lastName}
                />
                <TextInput
                    label="Email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    error={errors.email}
                />
                <TextInput
                    label="Display Name"
                    id="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Choose a display name"
                    error={errors.displayName}
                />
                <TextInput
                    label="Password"
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter a password"
                    error={errors.password}
                />
                <TextInput
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    error={errors.confirmPassword}
                />
                <Button
                    buttonName="Sign Up"
                    className={`button ${isSubmitting ? 'disabled' : 'hover-orange'}`}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}