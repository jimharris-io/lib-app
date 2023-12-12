// bootstrap
import { Stack } from "react-bootstrap";
import { Trash3, Heart, Camera, HeartFill } from 'react-bootstrap-icons';

// app
import { adminMessageLength, colours, fonts, shapes } from './../../constants/constants';

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

    const backgroundColour = colours.find((colour) => colour.value === props.post.backgroundColour);
    const textColour = colours.find((colour) => colour.value === props.post.textColour);;  
    const borderColour = colours.find((colour) => colour.value === props.post.borderColour);
    const font = fonts.find((font) => font.value === props.post.font);
    let fontFamily;
    switch (font.value) {
        case 0:
            fontFamily = "cursive";
            break;
        case 1:
            fontFamily = "brush";
            break;
        case 2:
            fontFamily = "serif";
            break;
        case 3:
            fontFamily = "sans-serif";
            break;
        default:
            fontFamily = "sans-serif";
            break;
    }
    let textStyle = { color: textColour.hex};
    if(textColour.value === 6) {
        textStyle = { background: 'black', ...textStyle }
    }
    const shape = shapes.find((shape) => shape.value === props.post.shape);
    const preview = <div>
        <Post mode="preview" context="admin" font={font.value} message="" textColour={0} fill={backgroundColour.hex} strokeWidth="24" stroke={borderColour.hex} shape={shape.value}/>
    </div>

    const suffix = props.post.message.length > adminMessageLength ? "..." : "";

    const fave = props.post.favourite ?
        <HeartFill className="use-cursor" onClick={toggleFavouriteHandler} size={24}/> :
        <Heart className="use-cursor" onClick={toggleFavouriteHandler} size={24}/>

    const date = props.post.created.toDate();
    const when = `${date.toLocaleString('en-gb', {weekday: 'short'})}
        ${date.toLocaleString('en-gb', {month:'short'})}
        ${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}`

    return (
        <Stack className="admin justify-content-between" direction="horizontal" gap={3}>
            <Stack className="admin justify-content-between" direction="horizontal" gap={3}>
                <span>{when}</span>
                <span className="message">
                    {`${props.post.message.slice(0, adminMessageLength)}${suffix}`}
                </span>
            </Stack>
            <Stack direction="horizontal" gap={3}>
                <span style={textStyle} className={`font-family ${fontFamily}`}>
                    Abc
                </span>
                <span>{preview}</span>
                <Camera className="use-cursor" onClick={cameraHandler} size={24}/>
                {fave}
                <Trash3 className="use-cursor" onClick={deleteHandler} size={24}/>
            </Stack>
        </Stack>
    )
}

export default PostAdmin;

