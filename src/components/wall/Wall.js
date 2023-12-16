// components
import Post from "../wall/Post";
import Cta from "./Cta";
import Logos from "./Logos";

// app
import { useOutletContext } from "react-router-dom";
import { colours, grids, walks } from './../../constants/constants';
import { useState } from 'react';

document.addEventListener("keydown", (e) => {
    if (e.getModifierState && e.getModifierState("Control") && e.code === "Space") {
        toggleFullScreen();
    }
})

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

const Wall = () => {

    const [posts,,,,,,,,,grid] = useOutletContext();

    let sorted = posts.sort((a, b) => (a.created.seconds > b.created.seconds) ? 1 : -1);
    // sorted = sorted.splice(0, 2); // dev
    
    let wallPosts = sorted.map((post, i) => {
        const fill = colours.find((colour) => colour.value === post.backgroundColour)?.hex;
        const stroke = colours.find((colour) => colour.value === post.borderColour)?.hex;
        const wallPost = <Post key={`post-${grid}-${i}`} mode="display" font={post.font} message={post.message} textColour={post.textColour} fill={fill} strokeWidth="5" stroke={stroke} shape={post.shape}/>
        return wallPost;
    })

    const gridWidth = grids[grid].width;
    const gridHeight = grids[grid].height;

    let containers = wallPosts.map((post, i) => {
        const position = {
            gridColumn: walks[0][i].column - grids[grid].column + 1,
            gridRow: walks[0][i].row - grids[grid].row + 1
        }
        let anim = "";
        if(i === wallPosts.length - 1) {
            if(Math.random() < .5){
                anim = "wobble";
            } else {
                anim = "pulse";
            }
        }
        return <div style={position} className={`cell ${anim}`} key={`container-${i}`}>
            {post}
        </div>
    })

    // dynamic grid layout
    const gridScale = 1;

    // .wall
    const wallStyle = {
        maxWidth: `${(100 / (gridHeight / gridWidth)) * gridScale}vh`
    }

    // .grid
    const gridStyle = {
        maxHeight: `${gridScale * 100}vh`,
        height: `calc((100vw * (${gridHeight}/${gridWidth}) )`,
        gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
        gridTemplateRows: `repeat(${gridHeight}, 1fr)`
    }
    
    // let draw = [];
    // for(let j = 0; j < 15; j++){
    //     draw.push(<div className="cell" key={`empty-${j}`}></div>)
    // }
    // const order = [7, 8, 13, 2, 1, 0, 11, 12, 10, 6, 14, 9, 4, 5, 3]
    // for(let i = 0; i < wallPosts.length; i++) {
    //     draw[order[i]] = wallPosts[i];
    // }

    // style={{background: `rgba(${256 - ((128 / 16) * j)}, 0, ${((128 / 16) * j) + 128}`}}
    
    return <div style={wallStyle} className="wall h-100">
        <div style={gridStyle} className="grid">
            {/* {draw} */}
            {containers}
        </div>
        <Cta context="wall"/>
        <Logos context="wall"/>
    </div>
}

export default Wall;