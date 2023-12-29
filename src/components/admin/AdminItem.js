// bootstrap
import { Stack } from "react-bootstrap";
import { Trash3, Heart, Camera, HeartFill } from 'react-bootstrap-icons';

// app
import { adminMessageLength } from '../../constants/constants';

// components
import Post from "../wall/Post";

const PostAdmin = (props) => {

    const deleteHandler = () => {
        props.delete(props.post.id);
    }

    const toggleFavouriteHandler = () => {
        props.updateFavourite(props.post.id, !props.post.favourite);
    }

    const cameraHandler = () => {
        props.downloadPost(props.post)
    }

    const preview = <div>
        <Post classList="item admin" font={props.post.font} message="Abc" textColour={props.post.textColour} fill={props.post.backgroundColour} strokeWidth="24" stroke={props.post.borderColour} shape={props.post.shape}/>
    </div>

    const suffix = props.post.message.length > adminMessageLength ? "..." : "";

    const fave = props.post.favourite ?
        <HeartFill alt="Unlike" title="Unlike" className="use-cursor" onClick={toggleFavouriteHandler} size={24}/> :
        <Heart alt="Like" title="Like" className="use-cursor" onClick={toggleFavouriteHandler} size={24}/>

    const date = props.post.created.toDate();
    const when = date.toLocaleString("en-us", {month: 'short', weekday: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'});

    return (
        <Stack className="justify-content-between" direction="horizontal" gap={3}>
            <Stack className="justify-content-between" direction="horizontal" gap={3}>
                <span>{when}</span>
                <span className="message">
                    {`${props.post.message.slice(0, adminMessageLength)}${suffix}`}
                </span>
            </Stack>
            <Stack direction="horizontal" gap={3}>
                <span>{preview}</span>
                <Camera alt="Download image" title="Download image" className="use-cursor" onClick={cameraHandler} size={24}/>
                {fave}
                <Trash3 alt="Delete" title="Delete" className="use-cursor" onClick={deleteHandler} size={24}/>
            </Stack>
        </Stack>
    )
}

export default PostAdmin;

