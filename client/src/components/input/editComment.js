import React, { useState } from "react";
import TextArea from "./TextArea.js";
import Button from "../general/Button.js";
export default function EditComment(props) {
    const commentData = props.comments.find(
        (c) => c._id === props.commentID
    );
    const [formData, setFormData] = useState({
        content: commentData?.content || "",
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
        <div className="edit-comment-view">
            <h2>Edit Comment</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <TextArea
                label="Comment Content"
                id="content"
                value={formData.content}
                onChange={handleInputChange}
                error={errors.content}
            />
        </div>
    )
}