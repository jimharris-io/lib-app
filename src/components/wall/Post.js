// app
import { colours, fonts, shapes } from './../../constants/constants';
import { useState, useCallback, useLayoutEffect, useEffect, useRef } from "react";

import { Textfit } from 'react-textfit';
import ResizeObserver from 'resize-observer-polyfill';

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
 
    let fontInfo;
    if(props.font !== undefined){
        fontInfo = fonts.find(f => f.value === props.font);
    } else {
        fontInfo = {
            label: "",
            className: "system",
            lineHeight: 1
        }
    }

    let shapeInfo;
    if(props.shape !== undefined){
        shapeInfo = shapes.find(s => s.value === props.shape);
    } else {
        shapeInfo = shapes.find(s => s.value === 0);
    }

    const width = parseInt(offsetWidth * shapeInfo.textArea.width);
    const height = parseInt(offsetHeight * shapeInfo.textArea.height);
    const size = height;

    let textColour;
    if(props.textColour !== undefined){
        textColour = colours.find((colour) => colour.value === props.textColour)?.hex;
    } else {
        textColour = `rgba(255, 255, 255, 0.85)`
    }

    let fill;
    if(props.fill !== undefined){
        fill = colours.find((colour) => colour.value === props.fill)?.hex;
    } else {
        fill = 'black';
    }

    let strokeWidth;
    let stroke; // borderColour
    let dashed;
    if(props.stroke !== undefined) {
        stroke = colours.find((colour) => colour.value === props.stroke)?.hex;
        strokeWidth = props.strokeWidth;
        dashed = "";
    } else {
        stroke = "white";
        strokeWidth = "2";
        dashed = "10,10";
    }

    if(props.fill !== undefined && props.stroke === undefined){
        stroke = "none";
        strokeWidth = "0";
        dashed = "";
    }
        
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
            <path fill={fill} opacity="1.000000" strokeWidth={strokeWidth} strokeDasharray={dashed} stroke={stroke} d={shapeInfo.path}/>
        </svg>
        { size > 0 && <Textfit mode="multi" style={postStyle} className={`test message ${fontInfo.className}`}>{props.message}</Textfit> }
    </div>
}

export default Post;