import { useState } from "react";
import TextAreaInput from "./TextArea";
import Button from "../general/Button.js";
import axios from "axios";

export default function CommentForm(props) {
    // console.log("in comment form");
    const postID = props.postID;
    // console.log(postID);

    const [formData, setFormData] = useState({
        commentBody: '',
        // username: ''
    });

    const [errors, setErrors] = useState({
        commentBody: '',
        // username: ''
    });

    // State for success message
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to handle input change
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

    // Function to handle form submission
    const handleSubmit = (e) => {
        if (isSubmitting) return;
        let newErrors = {};

        if (!formData.commentBody) {
            newErrors.commentBody = 'Comment body is required.';
        }
        // if (!formData.username) {
        //     newErrors.username = 'Username is required.';
        // }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setIsSubmitting(true); // Set form as submitting
            // const newComment = {
            //     commentID: `comment${props.comments.length + 1}`,
            //     content: formData.commentBody,
            //     commentIDs: [],
            //     commentedBy: formData.username,
            //     commentedDate: new Date(),
            // };

            const newComment = {
                content: formData.commentBody,
                commentedBy: props.user.displayName,
                isReply: props.isReply,
                commentID: props.commentID,
                postID: props.postID
            }
            // console.log("props:" + postID); 

            const addComment = async (newComment) => {
                try {
                    // console.log("adding new comment");
                    axios.defaults.withCredentials = true;
                    const res = await axios.post('http://localhost:8000/comments', newComment);
                    console.log(res);
                } catch (error) {
                    console.log("error in post client" + error);
                }
            }

            addComment(newComment);


            /* not sure if comments/replies add to community members
            const community = props.communities.find((community) => community.postIDs.includes(props.postID));
            if (community) {
                community.members.push(formData.username);
            }
            console.log(community.members);
            */
            props.setComments(prevComments => [...prevComments, newComment]);
            setSuccessMessage('Comment created successfully!');
            setTimeout(() => {
                setFormData({
                    commentBody: '',
                    // username: ''
                });
                setSuccessMessage('');
                props.setView({type: 'post', id: postID});
                setIsSubmitting(false);
            }, 1000);
        }
    };

    return (
        <div className="new-comment-view">
            <h2>{props.isReply ? "Reply to Comment" : "Create a New Comment"}</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}

            <TextAreaInput
                label="Comment Body"
                id="commentBody"
                value={formData.commentBody}
                onChange={handleInputChange}
                placeholder="Enter your comment"
                error={errors.commentBody}
                maxLength={500}
            />

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
                buttonName={props.isReply ? "Reply" : "Create Comment"}
                disabled={isSubmitting}  // Disable button when submitting
            />
        </div>
    );
}
