import Logo from './Logo.js'
import SearchBar from './SearchBox'
import Button from '../general/Button'
import './pagebanner.css'
import { sortNewest } from '../utils/SortingUtil';
import axios from 'axios';

function PageBanner(props) {
    const isCreatePostView = props.currentView.type === 'create-post';
    const isProfileView = props.currentView.type === 'profile';
    if(props.user){
        const userName = props.user.displayName;
    }

    const handleLogout = async () => {
        try {
            console.log("here in client");
            await axios.post('http://localhost:8000/logout');
            props.setLoggedIn(false);
            console.log("set logged out" + props.isLoggedIn);
            props.setView({ type: 'login', id: null });
        } catch (error) {
            console.error("error in logout" + error);
        }
    };
    
    console.log(props.isLoggedIn);
    return (
        <header className="banner">
            <Logo setView={() => {
                props.setPosts(sortNewest(props.posts));  // Sort posts by newest when clicking the logo
                props.setView({ type: 'home', id: null });  // Navigate to home view
            }} />
            <SearchBar
                setView={props.setView}
                posts={props.posts}
                comments={props.comments}
                setSearchResults={props.setSearchResults}
                setQuery={props.setQuery}
                query={props.query}
            />
            <div className="banner-buttons">
                <Button
                    onClick={() => props.setView({ type: 'create-post', id: null })}
                    className={`button ${isCreatePostView ? 'create-post-active' : 'hover-orange'}`}
                    buttonName="Create Post" />
                {props.isLoggedIn ? (
                    <>
                    <Button
                    onClick={() => props.setView({type: 'profile', id: null})}
                    className={`button ${isProfileView ? 'profile-active' : 'hover-orange'}`}
                    buttonName="aaa" />
                    <Button 
                    onClick={handleLogout}
                    className={'button hover-orange'}
                    buttonName="Log Out"/>
                    </>
                ) : null}
            </div>
        </header>
    );
}

export default PageBanner