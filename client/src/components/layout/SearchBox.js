import { useState } from 'react';
import './SearchBox.css';
import { searchPostsAndComments } from '../utils/SearchingUtil';
export default function SearchBar({ posts, comments, setSearchResults, setView, query, setQuery}) {
    const [currInput, setInput] = useState(query);
    
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            const trimmedQuery = currInput.trim();
            console.log('Entered text:', trimmedQuery);
            if (trimmedQuery) {
                const results = searchPostsAndComments(trimmedQuery, posts, comments);
                setQuery(trimmedQuery);
                setSearchResults(results);
                setView({type: 'search-view', id: null});
            } else {
                alert('Please enter a search query.');
            }
        }
    }

    return (
        <div className="search-box-container">
            <input
                type="text"
                id="search-box"
                placeholder="Search Phreddit..."
                value={currInput}
                onChange={(e) => setInput(e.target.value)}  // Update query on input change
                onKeyDown={handleKeyDown}  // Trigger search on "Enter" key press
            />
        </div>
    );
}
