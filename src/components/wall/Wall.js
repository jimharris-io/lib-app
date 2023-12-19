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
        const wallPost = <Post key={`post-${grid}-${i}`} classList="wall display" font={post.font} message={post.message} textColour={post.textColour} fill={post.backgroundColour} strokeWidth="5" stroke={post.borderColour} shape={post.shape}/>
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
        return <div style={position} className={`${anim}`} key={`container-${i}`}>
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
    
    return <div style={wallStyle} className="wall h-100">
        <div style={gridStyle} className="grid">
            {containers}
        </div>
        <Cta context="wall"/>
        <Logos context="wall"/>
    </div>
}

export default Wall;