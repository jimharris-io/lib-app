// app
import { colours, fonts, shapes } from './../../constants/constants';
import { useState, useCallback, useLayoutEffect, useEffect, useRef } from "react";

import { Textfit } from 'react-textfit';

// bootstrap
import { Form } from "react-bootstrap";

const Post = (props) => {

    const [offsetWidth, setOffsetWidth] = useState(0);
    const [offsetHeight, setOffsetHeight] = useState(0);

    const ref = useCallback(node => {
        if(!node) return;
        const resizeObserver = new ResizeObserver(() => {
            setOffsetWidth(node.offsetWidth);
            setOffsetHeight(node.offsetHeight);
        });
        resizeObserver.observe(node);
    }, [])
 
    const fontInfo = fonts.find(f => f.value === props.font);
    const shapeInfo = shapes.find(s => s.value === props.shape);
    const width = parseInt(offsetWidth * shapeInfo.textArea.width);
    const height = parseInt(offsetHeight * shapeInfo.textArea.height);
    const size = height;
    const textColour = colours.find((colour) => colour.value === props.textColour)?.hex;
    const fill = colours.find((colour) => colour.value === props.fill)?.hex;
    const stroke = colours.find((colour) => colour.value === props.stroke)?.hex;
    
    const postStyle = {};

    postStyle.color = textColour;
    postStyle.fontSize = `${size}px`;
    postStyle.lineHeight = fontInfo.lineHeight;
    postStyle.width = `${width}px`;
    postStyle.height = `${height}px`;
    // postStyle.background = `rgba(0, 255, 0, .5)`;
    postStyle.left = `${shapeInfo.textArea.left}%`;
    postStyle.top = `${shapeInfo.textArea.top}%`;

    return <div ref={ref} className={`post ${props.classList}`}>
        <svg version="1.1" id="shape" xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 350 350">
            <path fill={fill} opacity="1.000000" strokeWidth={props.strokeWidth} stroke={stroke} d={shapeInfo.path}/>
        </svg>
        { size > 0 && <Textfit mode="multi" style={postStyle} className={`test message ${fontInfo.className}`}>{props.message}</Textfit> }
    </div>
}

export default Post;