import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile(props) {
    const [activeTab, setActiveTab] = useState("posts");
    const handleTabChange = (tab) => setActiveTab(tab);
    const user = props.user;

    const [userCreationDate, setUserCreationDate] = useState('');
    const getUserCreation = async () => {
        try {
            const res = await axios.get('http://localhost:8000/user-creation-date');
            setUserCreationDate(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const [communities, setCommunities] = useState([]);

    const getCommunities = async () => {
        try {
            console.log("GETTING COMMUNITIES");
            const res = await axios.get('http://localhost:8000/user-communities', {
                withCredentials: true,
              });
            setCommunities(res.data.communities);
        } catch (error) {
            console.log(error);
        }
    }

    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        try {
            const res = await axios.get('http://localhost:8000/user-posts', {
                withCredentials: true,
              });
            setPosts(res.data.posts);
        } catch (error) {
            console.log(error);
        }
    }

    const [comments, setComments] = useState([]);

    const getComments = async () => {
        try {
            const res = await axios.get('http://localhost:8000/user-comments', {
                withCredentials: true,
              });
            setComments(res.data.comments);
        } catch (error) {
            console.log(error);
        }
    }

    const [isAdmin, setAdmin] = useState(false);

    const checkAdmin = async () => {
        try {
            console.log("BEFORE ADMIN CHECK");
            const res = await axios.post('http://localhost:8000/check-admin');
            console.log("AFTER ADMIN CHECK");
            setAdmin(res.data.isAdmin);
        } catch (error) {
            console.log(error);
        }
    }

    const [users, setUsers] = useState([]);
    
    const getUsers = async () => {
        try {
            const res = await axios.post('http://localhost:8000/get-users');
            setUsers(res.data.users);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkAdmin();
    }, []);

    useEffect(() => {
        getUserCreation();
        getCommunities();
        getPosts();
        getComments();
        getUsers();
    }, [activeTab]);

    return (
        <>
            <h2>{user.displayName}</h2>
            <p>Email: {user.email}</p>
            <p>Member since: {userCreationDate}</p>
            <p>Reputation: {user.reputation}</p>

            <div>
                {isAdmin ? (
                    <button onClick={() => handleTabChange('users')}>Users</button>
                ) : null}
                <button onClick={() => handleTabChange("communities")}>Communities</button>
                <button onClick={() => handleTabChange("posts")}>Posts</button>
                <button onClick={() => handleTabChange("comments")}>Comments</button>
            </div>

            {/* Listings */}

            {activeTab === "users" && isAdmin && (
            <>    
            <h2>Users</h2>
                <ol>
                    {users.map((user) => (
                    <li key={user._id}>
                        <span>
                        <a
                            href="#"
                            onClick={(e) => {
                            e.preventDefault();
                            //temp view
                            props.setView({ type: 'edit-community', id: user._id });
                            }}
                        >
                            {user.displayName}
                        </a>
                        </span>
                    </li>
                    ))}
                </ol>
            </>
            )} 
            {activeTab === "communities" && (
            <>    
            <h2>Communities</h2>
                <ol>
                    {communities.map((community) => (
                    <li key={community._id}>
                        <span>
                        <a
                            href="#"
                            onClick={(e) => {
                            e.preventDefault();
                            props.setView({ type: 'edit-community', id: community._id });
                            }}
                        >
                            {community.name}
                        </a>
                        </span>
                    </li>
                    ))}
                </ol>
            </>
            )}
            {activeTab === "posts" && (
            <>    
            <h2>Posts</h2>
                <ol>
                    {posts.map((post) => (
                        <li key={post._id}>
                            <span>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.setView({ type: 'edit-post', id: post._id });
                                    }}
                                >
                                    {post.title}
                                </a>
                            </span>
                        </li>
                    ))}
                </ol>
            </>
            )}
            {activeTab === "comments" && (
            <>
            <h2>Comments</h2>
                <ul>
                    {comments.map((c) => (
                        <li key={c._id}>
                            <span>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.setView({ type: "edit-comment", id: c._id });
                                    }}
                                >
                                    {c.content.slice(0,20)}...
                                </a>
                            </span>
                        </li>
                    ))}
                </ul>
            </>
            )}

        </>
    );
}

