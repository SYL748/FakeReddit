import './buttonlist.css'
import Button from "./Button";
import { sortNewest, sortOldest, sortActive } from '../utils/SortingUtil'

function ButtonList(props) {
    return (
        <div className="button-list">
            <Button onClick={() => {props.setPosts(sortNewest(props.posts)); console.log("newest")}} className="button hover-orange" buttonName="NEWEST"/>
            <Button onClick={() => {props.setPosts(sortOldest(props.posts)); console.log("oldest")}} className="button hover-orange" buttonName="OLDEST"/>
            <Button onClick={() => props.setPosts(sortActive(props.comments, props.posts))} className="button hover-orange" buttonName="ACTIVE"/>
        </div>
    );
}

export default ButtonList