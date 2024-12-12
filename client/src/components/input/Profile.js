import React, { useEffect, useState } from "react";
import axios from "axios";
import './Profile.css';

export default function Profile(props) {
    const [activeTab, setActiveTab] = useState("posts");
    const handleTabChange = (tab) => setActiveTab(tab);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);

    const [userCreationDate, setUserCreationDate] = useState('');
    const [communities, setCommunities] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [isAdmin, setAdmin] = useState(false);
    const [users, setUsers] = useState([]);
    const [adminID, setAdminID] = useState(null);

    const onMount = async () => {
        try {
            //console.log("get current user before");
            const currentUserRes = await axios.get('http://localhost:8000/current-user');
            //console.log("get current user after");
            setSelectedUser(currentUserRes.data);
            //console.log(currentUserRes);
            //console.log(currentUserRes.data.id);
            setUserID(currentUserRes.data.id);
            setAdminID(currentUserRes.data.id);
            setLoading(false);
            const adminRes = await axios.post('http://localhost:8000/check-admin');
            setAdmin(adminRes.data.isAdmin);
        } catch (error) {
            console.log(error);
        }
    }

    const getCurrentUser = async () => {
        try {
            const currentUserRes = await axios.get('http://localhost:8000/current-user');
            setSelectedUser(currentUserRes.data);
            setUserID(currentUserRes.data.id);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        onMount();
    }, []);

    const fetchData = async () => {
        try {
            if (!selectedUser || !userID) return;
            const userCreationRes = await axios.get(`http://localhost:8000/user-creation-date/${userID}`);
            setUserCreationDate(userCreationRes.data);
            const getCommunitiesRes = await axios.get(`http://localhost:8000/user-communities/${userID}`, {withCredentials: true});
            setCommunities(getCommunitiesRes.data.communities);
            const getPostsRes = await axios.get(`http://localhost:8000/user-posts/${userID}`, {withCredentials: true});
            setPosts(getPostsRes.data.posts);
            const getCommentsRes = await axios.get(`http://localhost:8000/user-comments/${userID}`, {withCredentials: true});
            setComments(getCommentsRes.data.comments);
            const getUsersRes = await axios.post('http://localhost:8000/get-users');
            setUsers(getUsersRes.data.users);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, selectedUser]);

    const deleteUser = async (deleteUser) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            if (!confirmDelete) return;
        
            //console.log("BEFORE DELETE");
            await axios.delete(`http://localhost:8000/delete-user/${deleteUser}`);
            //console.log("AFTER DELETE");
        
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deleteUser));

            if (deleteUser === adminID) {
                props.setView({ type: "login", id: null });
            } else {
                setActiveTab("users");
                props.setView({ type: "profile", id: null });
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) {
        return <p>bruh.</p>;
    }

    return (
        <>
            <h2>{selectedUser.displayName}</h2>
            <p>Email: {selectedUser.email}</p>
            <p>Member since: {userCreationDate}</p>
            <p>Reputation: {selectedUser.reputation}</p>

            <div>
                {isAdmin && selectedUser.id === adminID && (
                    <button className="button-margin" onClick={() => handleTabChange('users')}>Users</button>
                )}
                <button className="button-margin" onClick={() => handleTabChange("communities")}>Communities</button>
                <button className="button-margin" onClick={() => handleTabChange("posts")}>Posts</button>
                <button className="button-margin" onClick={() => handleTabChange("comments")}>Comments</button>

                {isAdmin && selectedUser.id !== adminID && (
                    <button className="button-margin" onClick={() => getCurrentUser()}>Back to Admin Profile</button>
                )}
            </div>

            {/* Listings */}

            {activeTab === "users" && isAdmin && (
                <>
                    <h2>Users</h2>
                    <ol>
                        {users.map((user) => (
                            <li key={user._id}>
                                <span>
                                    <button
                                        className="no-style"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedUser(user);
                                            setUserID(user._id);
                                            setActiveTab("posts");
                                            props.setView({ type: "profile", id: null });
                                        }}
                                    >
                                        {user.displayName}
                                     </button>
                                </span>
                                <p>Email: {user.email}</p>
                                <p>Reputation: {user.reputation}</p>
                                <button onClick={() => deleteUser(user._id)}>Delete User</button>
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
                        <button
                            className="no-style"
                            onClick={(e) => {
                            e.preventDefault();
                            props.setView({ type: 'edit-community', id: community._id });
                            }}
                        >
                            {community.name}
                        </button>
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
                            <button
                                    className="no-style"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.setView({ type: 'edit-post', id: post._id });
                                    }}
                                >
                                    {post.title}
                                </button>
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
                                <button
                                    className="no-style"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.setView({ type: "edit-comment", id: c._id });
                                    }}
                                >
                                 {c.content.length > 20 ? (c.content.slice(0,20)) : c.content}
                                 {c.content.length > 20 ? "..." : ''}
                                </button>
                            </span>
                        </li>
                    ))}
                </ul>
            </>
            )}

        </>
    );
}

