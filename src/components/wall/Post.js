// shapes
import { paths } from './../../constants/constants';

// app
import { colours, fonts, shapes } from './../../constants/constants';
import { useLayoutEffect, useState, useEffect, useRef, useCallback } from "react";

// const fit = (width, height, text, fontInfo, shapeInfo) => {
    
//     // prep
//     const div = document.createElement('div');
//     div.className = `fit ${fontInfo.className}`;
//     const textAreaWidth = parseInt(width * shapeInfo.textArea.width);
//     div.style.width = `${textAreaWidth}px`;
//     div.style.lineHeight = fontInfo.lineHeight;
//     div.innerHTML = text;
//     const body = document.getElementsByTagName('body')[0];
//     body.append(div);
//     const textAreaHeight = parseInt(height * shapeInfo.textArea.height);

//     // calculate
//     div.style.fontSize = `${textAreaHeight}px`;

//     let size = textAreaHeight;
//     let h = div.offsetHeight;

//     do {
//         size = size - 0.5;
//         div.style.fontSize = `${size}px`
//         h = div.offsetHeight;
//         if(h <= textAreaHeight){
//             break;
//         }
//     } while(size > 0);
    
//     let w = div.scrollWidth;
    
//     if(w > textAreaWidth){
//         do {
//             size = size - 0.5;
//             div.style.fontSize = `${size}px`
//             w = div.scrollWidth;
//             if(w <= textAreaWidth){
//                 break;
//             }
//         } while(size > 0);
//     }
    
//     div.style.height = `${textAreaHeight}px`;

//     // clean up
//     div.remove();

//     return [size, textAreaWidth, textAreaHeight];
// }

const Post = (props) => {

    const [offsetWidth, setOffsetWidth] = useState(0);
    const [offsetHeight, setOffsetHeight] = useState(0);

    useLayoutEffect(() => {
        const offsetWidth = ref.current.offsetWidth;
        const offsetHeight = ref.current.offsetHeight;
        setOffsetWidth(offsetWidth);
        setOffsetHeight(offsetHeight);
    }, [offsetWidth, offsetHeight, setOffsetWidth, setOffsetHeight]);

    // useEffect(()=>{
    //     const fontInfo = fonts.find(f => f.value === props.font);
    //     const shapeInfo = shapes.find(s => s.value === props.shape);
    //     const [size, width, height] = fit(ref.current.offsetWidth, ref.current.offsetHeight, props.message, fontInfo, shapeInfo);
    //     const textColour = colours.find((colour) => colour.value === props.textColour)?.hex;
    //     const dom = ref.current.querySelector(".message");
    //     dom.style.color = textColour;
    //     dom.style.fontSize = `${size * shapeInfo.magicNumber}px`;
    //     dom.style.lineHeight = fontInfo.lineHeight;
    //     dom.style.width = `${width}px`;
    //     dom.style.height = `${height}px`;
    //     // dom.style.background = `rgba(0, 255, 0, .5)`;
    //     dom.style.left = `${shapeInfo.textArea.left}%`;
    //     // const adj = shapeInfo.value === 2 ? 1.375 : 0.8;
    //     const top = shapeInfo.textArea.top /* * adj */;
    //     dom.style.top = `${top}%`;
    // })

    const ref = useRef(null); 

    let path;
    switch (props.shape) {
        case 0:
            path = paths.square.path;
            break;
        case 1:
            path = paths.circle.path;
            break;
        case 2:
            path = paths.heart.path;
            break;
        case 3:
            path = paths.rosette.path;
            break;
        default:
            path = paths.square.path;
            break;
    }

    const fit = (width, height, text, fontInfo, shapeInfo) => {

        // prep
        const div = document.createElement('div');
        div.className = `fit ${fontInfo.className}`;
        const textAreaWidth = parseInt(width * shapeInfo.textArea.width);
        div.style.opacity = 0;
        div.style.width = `${textAreaWidth}px`;
        div.style.lineHeight = fontInfo.lineHeight;
        div.innerHTML = text;
        const body = document.getElementsByTagName('body')[0];
        body.append(div);
        const textAreaHeight = parseInt(height * shapeInfo.textArea.height);
    
        // calculate
        div.style.fontSize = `${textAreaHeight}px`;
    
        let size = textAreaHeight;
        let h = div.offsetHeight;
    
        do {
            size = size - 0.5;
            div.style.fontSize = `${size}px`
            h = div.offsetHeight;
            if(h <= textAreaHeight){
                break;
            }
        } while(size > 0);
        
        let w = div.scrollWidth;
        
        if(w > textAreaWidth){
            do {
                size = size - 0.5;
                div.style.fontSize = `${size}px`
                w = div.scrollWidth;
                if(w <= textAreaWidth){
                    break;
                }
            } while(size > 0);
        }
        
        div.style.height = `${textAreaHeight}px`;
    
        // clean up
        div.remove();
    
        return [size, textAreaWidth, textAreaHeight];
    }

    // const fontInfo = fonts.find(f => f.value === props.font);

    const fontInfo = fonts.find(f => f.value === props.font);
    const shapeInfo = shapes.find(s => s.value === props.shape);
    // console.time("draw");
    const [size, width, height] = fit(offsetWidth, offsetHeight, props.message, fontInfo, shapeInfo);
    // console.timeEnd("draw");
    
    const textColour = colours.find((colour) => colour.value === props.textColour)?.hex;
    
    const postStyle = {};

    postStyle.color = textColour;
    postStyle.fontSize = `${size * shapeInfo.magicNumber}px`;
    postStyle.lineHeight = fontInfo.lineHeight;
    postStyle.width = `${width}px`;
    postStyle.height = `${height}px`;
    postStyle.background = `rgba(0, 255, 0, .5)`;
    postStyle.left = `${shapeInfo.textArea.left}%`;
    // const adj = shapeInfo.value === 2 ? 1.375 : 0.8;
    const top = shapeInfo.textArea.top /* * adj */;
    postStyle.top = `${top}%`;

    return <div ref={ref} className={`${props.mode} ${props.context}`}>
        <svg version="1.1" id="shape" xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 350 350">
            <path fill={props.fill} opacity="1.000000" strokeWidth={props.strokeWidth} stroke={props.stroke} d={path}/>
        </svg>
        { size > 0 && <div style={postStyle} className={`message ${fontInfo.className}`}>{props.message}</div> }
    </div>
}

export default Post;