import React, { useState } from "react";
import TextAreaInput from "./TextArea";
import TextInput from "./TextInput";
import Button from "../general/Button.js";
import { findCommunityByPostID } from "../utils/FindCommunityByPostID.js";

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
        communityName: "",
        description: "",
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

    return (
        <>
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
                    //   onClick={handleSubmit}
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
        </>
    )
}