import React, { useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea.js";
import Button from "../general/Button.js";
import axios from "axios";

export default function EditCommunity(props) {
    const communityData = props.communities.find(
        (community) => community._id === props.communityID
    );
    console.log("SDFSFASDFDS"+communityData._id);
    const [formData, setFormData] = useState({
        communityName: communityData?.name || "",
        description: communityData?.description || "",
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

  const handleSubmit = async () => {
    if (isSubmitting) return;

    let newErrors = {};
    if (!formData.description) {
      newErrors.description = "Description is required.";
    }

    if (!formData.communityName) {
      newErrors.communityName = "Community name is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsSubmitting(true);
      try {
        const updatedCommunity = {
          description: formData.description,
          communityName: formData.communityName,
        };

        await axios.patch(
          `http://localhost:8000/edit-community/${communityData._id}`,
          updatedCommunity,
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
          `http://localhost:8000/delete-community/${communityData._id}`,
          { withCredentials: true }
        );
        console.log("DELETE AFTER");


        props.setView({ type: "profile", id: null });
      }
    } catch (error) {
      console.error("Error deleting community:", error);
    }
  };

  return (
    <div className="edit-community-view">
      <h2>Edit Community</h2>
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
      <TextArea
        label="Community Description"
        id="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Enter community description"
        error={errors.description}
        maxLength={500}
      />

      <div className="buttons-container">
        <Button
          onClick={handleSubmit}
          className={`button ${isSubmitting ? "disabled" : "hover-orange"}`}
          buttonName="Update Community"
          disabled={isSubmitting}
        />
        <Button
          onClick={handleDelete}
          className="button hover-orange"
          buttonName="Delete Community"
        />
      </div>
    </div>
  );
}
