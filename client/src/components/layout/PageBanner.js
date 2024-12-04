import Logo from './Logo.js'
import SearchBar from './SearchBox'
import Button from '../general/Button'
import './pagebanner.css'
import { sortNewest } from '../utils/SortingUtil';

function PageBanner(props) {
    const isCreatePostView = props.currentView.type === 'create-post';
    const isProfileView = props.currentView.type === 'profile';
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
                <Button
                    onClick={() => props.setView({type: 'profile', id: null})}
                    className={`button ${isProfileView ? 'profile-active' : 'hover-orange'}`}
                    buttonName="Profile" />
            </div>
        </header>
    );
}

export default PageBanner