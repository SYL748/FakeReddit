import Button from '../general/Button';
import Delimiter from '../general/Delimiter'
import './navbar.css'
import { sortNewest } from '../utils/SortingUtil';

function NavBar(props) {
    const isHomeView = props.currentView.type === 'home';
    const isCreateCommunityView = props.currentView.type === 'create-community';
    console.log(props.communities);
    return (
        <div className="nav-bar">
            <Button onClick={() => {
                    props.setPosts(sortNewest(props.posts));  // Sort posts by newest
                    props.setView({type: 'home', id: null}); // Navigate to home view
                }}
                className={`button ${isHomeView ? 'home-active' : 'hover-orange'}`}
                buttonName="Home"
            />
            <Delimiter />
            <h2>Communities</h2>
            <Button onClick={() => props.setView({type:'create-community', id: null})}
                className={`button ${isCreateCommunityView ? 'create-community-active' : 'hover-orange'}`}
                buttonName="Create Community"
            />

            {props.communities.map((community) => {
                const isActiveCommunity = props.currentView.id === community._id;
                return (
                    <Button onClick={() => props.setView({type: "community", id:community._id})}
                        // className="button hover-gray"
                        className={`fix-overflow button ${isActiveCommunity ? 'community-active' : 'hover-gray'}`}
                        buttonName={community.name}
                        key={community._id}
                    />
                );
            })}
        </div>
    );
}

export default NavBar