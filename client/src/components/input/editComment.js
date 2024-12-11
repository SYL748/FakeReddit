import React, { useState } from "react";
import TextArea from "./TextArea.js";
import axios from "axios";
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
                const updatedComment = {
                    content: formData.content,
                };
                console.log("DSAFSDAFASF"+formData.content);

                await axios.patch(
                    `http://localhost:8000/edit-comment/${commentData._id}`,
                    updatedComment,
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

    const handleDelete = async () => {
        try {
          const confirmDelete = window.confirm(
            "Are you sure you want to delete this community? This action cannot be undone."
          );
    
          if (confirmDelete) {
            console.log("DELETE BEFORE");
            await axios.delete(
              `http://localhost:8000/delete-comment/${commentData._id}`,
              { withCredentials: true }
            );
            console.log("DELETE AFTER");
    
    
            props.setView({ type: "profile", id: null });
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
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
            <Button
                onClick={handleSubmit}
                className={`button ${isSubmitting ? "disabled" : "hover-orange"}`}
                buttonName="Update Comment"
                disabled={isSubmitting}
            />
            <Button
                onClick={handleDelete}
                className="button hover-red"
                buttonName="Delete Comment"
            />
        </div>
    )
}