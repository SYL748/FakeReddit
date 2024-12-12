import { useState} from "react";
import TextAreaInput from "./TextArea";
import TextInput from "./TextInput";
import SelectInput from "./SelectorInput";
import Button from "../general/Button.js";
import axios from 'axios';

export default function CreatePostPage(props) {
    // console.log("CURRENT:" + props.userCommunities);
    // console.log("Other: " + props.otherCommunities);
    const inOrderCommunities = [...props.userCommunities, ...props.otherCommunities];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        communityName: '',
        title: '',
        content: '',
        // username: '',
        linkFlair: '',
        newFlair: ''
    });

    const [errors, setErrors] = useState({
        communityName: '',
        title: '',
        content: '',
        // username: '',
        newFlair: ''
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
        // e.preventDefault();
        let newErrors = {};

        if (!formData.communityName) newErrors.communityName = 'Please select a community.';
        if (!formData.title) newErrors.title = 'Post title is required.';
        if (!formData.content) newErrors.content = 'Post content is required.';
        // if (!formData.username) newErrors.username = 'Username is required.';
        if (formData.linkFlair && formData.newFlair) {
            newErrors.newFlair = 'Please enter only one flair: existing or new.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            let appliedFlair = formData.linkFlair;
            if (formData.newFlair) {
                const isDuplicateFlair = props.linkFlair.some(
                    flair => flair.content.toLowerCase() === formData.newFlair.toLowerCase()
                );
                if (isDuplicateFlair) {
                    newErrors.newFlair = 'This flair already exists. Please use the existing one or enter a different flair.';
                    setErrors(newErrors);
                    return;
                } else {
                    // const newFlairID = `lf${props.linkFlair.length + 1}`;
                    // const newFlair = { linkFlairID: newFlairID, content: formData.newFlair };
                    // props.linkFlair.push(newFlair);
                    appliedFlair = formData.newFlair;
                }
            }
            setIsSubmitting(true);
        
            const newPost = {
                title: formData.title,
                content: formData.content,
                linkFlairID: appliedFlair || null,
                postedBy: props.user.displayName,
                postedDate: new Date(),
                commentIDs: [],
                views: 0,
                communityName: formData.communityName
            }

            // console.log(newPost);

            const addPost = async (newPost) => {
                try {
                    // console.log("adding new post");
                    axios.defaults.withCredentials = true;
                    const res = await axios.post('http://localhost:8000/create-post', newPost);
                    console.log(res);
                } catch (error) {
                    console.log("error in post client" + error);
                }
            }

            addPost(newPost);

            // const newPost = {
            //     postID: `p${props.posts.length + 1}`,
            //     title: formData.title,
            //     content: formData.content,
            //     postedBy: formData.username,
            //     postedDate: new Date(),
            //     views: 0,
            //     commentIDs: [],
            //     linkFlairID: appliedFlair || null
            // };
            // const community = props.communities.find(c => c.name === formData.communityName);
            // if (community) {
            //     community.postIDs.push(newPost.postID);
            //     const member = community.members.includes(formData.username);
            //     if (!member) {
            //         community.members.push(formData.username);
            //     }
            // }
            //console.log(community.members);
            // console.log(formData.username);
            props.setPosts(prevPosts => [...prevPosts, newPost]);
            setSuccessMessage('Post created successfully!');
            setTimeout(() => {
                setFormData({
                    communityName: '',
                    title: '',
                    content: '',
                    // username: '',
                    linkFlair: '',
                    newFlair: ''
                });
                setSuccessMessage('');
                props.setView({type: 'home', id: null});
                props.setCount(props.posts.length);
                setIsSubmitting(false);
            }, 1000);
        }
    };

    return (
        <div className="new-post-view">
            <h2>Create a New Post</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {/* Community Select Input */}
            <SelectInput
                label="Select Community"
                id="communityName"
                value={formData.communityName}
                onChange={handleInputChange}
                options={inOrderCommunities.map((community) => ({
                    value: community.name,
                    label: community.name
                }))}
                error={errors.communityName}
            />

            {/* Post Title Input */}
            <TextInput
                label="Post Title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                error={errors.title}
                maxLength={100}
            />

            {/* Link Flair Selection */}
            <SelectInput
                label="Link Flair (optional)"
                id="linkFlair"
                value={formData.linkFlair}
                onChange={handleInputChange}
                options={props.linkFlair.map((flair) => ({
                    value: flair.linkFlairID,
                    label: flair.content
                }))}
            />

            {/* New Flair Input */}
            <TextInput
                label="New Flair (optional)"
                id="newFlair"
                value={formData.newFlair}
                onChange={handleInputChange}
                placeholder="Enter new flair (optional)"
                maxLength={30}
                error={errors.newFlair}
            />

            {/* Post Content Text Area */}
            <TextAreaInput
                label="Post Content"
                id="content"
                value={formData.content}
                onChange={handleInputChange}
                error={errors.content}
            />

            {/* Username Input */}
            {/* <TextInput
                label="Your Username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                maxLength={100}
                error={errors.username}
            /> */}
            <Button
                onClick={handleSubmit}
                className={`button ${isSubmitting ? 'disabled' : 'hover-orange'}`}
                buttonName="Submit Post"
                disabled={isSubmitting}
            />
        </div>
    );
}