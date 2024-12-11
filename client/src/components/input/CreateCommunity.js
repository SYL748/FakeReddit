import { useState } from "react";
import TextInput from "./TextInput";
import TextAreaInput from "./TextArea";
import Button from "../general/Button.js";
import axios from 'axios';

export default function CreateCommunity(props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        communityName: '',
        description: '',
        // username: ''
    });
    const [errors, setErrors] = useState({
        communityName: '',
        description: '',
        // username: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
        setErrors({
            ...errors,
            [id]: ''
        });
    };
    const handleSubmit = (e) => {
        if (isSubmitting) return;
        let newErrors = {};
        if (!formData.communityName) {
            newErrors.communityName = 'Community name is required.';
        } else {
            const isDuplicate = props.communities.some(
                community => community.name.toLowerCase() === formData.communityName.toLowerCase()
            );
            if (isDuplicate) {
                newErrors.communityName = 'Community name already exists. Please choose a different name.';
            }
        }
        if (!formData.description) newErrors.description = 'Description is required.';
        // if (!formData.username) newErrors.username = 'Username is required.';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setIsSubmitting(true);
            const newCommunity = {
                name: formData.communityName,
                description: formData.description,
                members: props.user.displayName,
                creator: props.user.displayName
            };

            let newCommunityID;
            const addCommunity = async (newCommunity) => {
                try {
                    // console.log("adding community");
                    axios.defaults.withCredentials = true;
                    const res = await axios.post('http://localhost:8000/create-community', newCommunity);
                    // console.log("finish community");
                    newCommunityID = res.data;
                    // console.log(res.data);
                    props.setCreate(true);
                    props.setUserCommunities((prev) => [...prev, newCommunityID]);

                } catch (error) {
                    console.log("error in post client" + error);
                }
            }

            queueMicrotask(() => {
                addCommunity(newCommunity);
            });

            setSuccessMessage('Community created successfully!');
            setTimeout(() => {
                setFormData({
                    communityName: '',
                    description: '',
                    // username: ''
                });
                setSuccessMessage('');
                props.setView({type: 'community', id: newCommunityID._id});
                setIsSubmitting(false);
            }, 1000);
        }
    };
    return (
        <div className="new-community-view">
            <h2>Create a New Community</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {/* Community Name Input */}
            <TextInput
                label="Community Name"
                id="communityName"
                value={formData.communityName}
                onChange={handleInputChange}
                placeholder="Enter community name"
                error={errors.communityName}
                maxLength={100}
            />

            {/* Community Description Input */}
            <TextAreaInput
                label="Community Description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter community description"
                error={errors.description}
                maxLength={500}
            />

            {/* Username Input */}
            {/* <TextInput
                label="Your Username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                error={errors.username}
                maxLength={100}
            /> */}

            <Button
                onClick={handleSubmit}
                className={`button ${isSubmitting ? 'disabled' : 'hover-orange'}`}
                buttonName="Engender Community"
                disabled={isSubmitting}
            />
        </div>
    );
}