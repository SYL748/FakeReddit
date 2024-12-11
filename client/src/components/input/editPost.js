import React, { useState } from "react";
import TextAreaInput from "./TextArea";
import TextInput from "./TextInput";
import Button from "../general/Button.js";
import { findCommunityByPostID } from "../utils/FindCommunityByPostID.js";
import axios from "axios";

export default function EditPosts(props) {

    let community = findCommunityByPostID(props.postID, props.communities);
    const postData = props.posts.find(
        (post) => post._id === props.postID
    );
    const flairContent = props.linkFlair.find(
        (flair) => flair._id === postData.linkFlairID
    )?.content || "";
    const [formData, setFormData] = useState({
        title: postData?.title || "",
        content: postData?.content || "",
        linkFlair: flairContent
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        content: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
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
        if (isSubmitting) return;

        let newErrors = {};
        if (!formData.content) {
            newErrors.content = "Description is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setIsSubmitting(true);
            try {
                const updatedPost = {
                    content: formData.content,
                };

                await axios.patch(
                    `http://localhost:8000/edit-post/${postData._id}`,
                    updatedPost,
                    { withCredentials: true }
                );

                setSuccessMessage("Community updated successfully!");
                setTimeout(() => {
                    setSuccessMessage("");
                    props.setView({ type: "profile", id: null });
                    setIsSubmitting(false);
                }, 1000);
            } catch (error) {
                console.error("Error updating community:", error);
            }
        }
    };

    return (
        <div className="edit-post-view">
            <h2>Edit Post</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <TextInput
                label="Select Community"
                id="communityName"
                value={community}
                onChange={handleInputChange}
                placeholder="Enter post title"
                error={errors.title}
                disabled={true}
            />
            <TextInput
                label="Post Title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                error={errors.title}
                maxLength={100}
                disabled={true}
            />
            <TextInput
                label="Link Flair (optional)"
                id="linkFlair"
                value={flairContent}
                onChange={handleInputChange}
                placeholder="Enter post title"
                error={errors.title}
                maxLength={100}
                disabled={true}
            />
            <TextAreaInput
                label="Post Content"
                id="content"
                value={formData.content}
                onChange={handleInputChange}
                error={errors.content}
            />
            <div className="buttons-container">
                <Button
                    onClick={handleSubmit}
                    className={`button ${isSubmitting ? "disabled" : "hover-orange"}`}
                    buttonName="Update Community"
                    disabled={isSubmitting}
                />
                <Button
                    //   onClick={handleDelete}
                    className={`button ${isSubmitting ? "disabled" : "hover-orange"}`}
                    buttonName="Delete Community"
                />
            </div>
        </div>
    )
}