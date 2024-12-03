import ButtonList from "../general/ButtonList";
import './searchpage.css'
import PostCount from "../posts/PostCount";
import Delimiter from "../general/Delimiter";
import PostList from "../posts/PostList";

function SearchPage(props) {
    let resultsFound = true;

    if (props.posts.length === 0) {
        resultsFound = false;
    }

    return (
        <div>
            <div className="search-heading">
                <h2>Search results for: "{props.query}"</h2>
                <ButtonList posts={props.posts} setPosts={props.setPosts} comments={props.comments}/>
            </div>
            <PostCount currPostCount={props.posts.length} />
            <Delimiter />
            {resultsFound ? 
            <PostList posts={props.posts} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
            : <p>No results found for your search.</p>
            }
            
        </div>  
    );
}

export default SearchPage