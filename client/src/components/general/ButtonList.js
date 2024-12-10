import './buttonlist.css'
import Button from "./Button";
import { sortNewest, sortOldest, sortActive } from '../utils/SortingUtil'

function ButtonList(props) {
    return (
        <div className="button-list">
            {props.loggedIn ? (
                <>
                <Button onClick={
                    () => {
                            console.log("newest logged in");
                            if (props.userPosts.length !== 0) {
                                props.setUserPostList(sortNewest(props.userPosts));
                            }
                            if (props.otherPosts.length !== 0) {
                                props.setOtherPostList(sortNewest(props.otherPosts));
                            }
                        }
                    } 
                    className="button hover-orange" 
                    buttonName="NEWEST"/>
                <Button onClick={
                    () => {
                            console.log("oldest logged in");
                            if (props.userPosts.length !== 0) {
                                props.setUserPostList(sortOldest(props.userPosts));
                            }
                            if (props.otherPosts.length !== 0) {
                                props.setOtherPostList(sortOldest(props.otherPosts));
                            }
                        }
                    } 
                    className="button hover-orange" 
                    buttonName="OLDEST"/>
                <Button onClick={
                    () => {
                            console.log(Array.isArray(props.userPosts));
                            if (props.userPosts.length !== 0) {
                            console.log(props.userPosts);
                                props.setUserPostList(sortActive(props.comments, props.userPosts));
                            }
                            if (props.otherPosts.length !== 0) {
                                props.setOtherPostList(sortActive(props.comments, props.otherPosts));
                            }
                        }
                    } 
                    className="button hover-orange"
                    buttonName="ACTIVE"/>
                </>

            ) : (
                <>
                <Button onClick={
                    () => {props.setPosts(sortNewest(props.posts));
                         console.log("newest")}
                    } 
                    className="button hover-orange" 
                    buttonName="NEWEST"/>
                <Button onClick={
                    () => {props.setPosts(sortOldest(props.posts));
                         console.log("oldest")}
                    } 
                    className="button hover-orange" 
                    buttonName="OLDEST"/>
                <Button onClick={
                    () => props.setPosts(sortActive(props.comments, props.posts))
                    } className="button hover-orange"
                     buttonName="ACTIVE"/>
                </>
            )}
        </div>
    );
}

export default ButtonList