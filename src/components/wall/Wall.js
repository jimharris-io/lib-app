// components
import Post from "../wall/Post";
import Join from "../campaign/Join";
import Tagline from "../campaign/Tagline";
import CompositeLogo from "../campaign/CompositeLogo";

// app
import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { grids, walks, Internal } from './../../constants/constants';

// firebase
import { getFirestore, getDocs, writeBatch, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";


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

    const [posts,,,,,,,,,,,,,,,,,,,, app, settingsId] = useOutletContext();
    
    const [idle, setIdle] = useState({value:false});

    useEffect(()=>{
        console.log("// wall: init timeout");
        const timeout = setTimeout(()=>{
            if(!idle.value){
                setIdle({...{value:true}});
                console.log("// wall: executed timeout, set idle");
            } else {
                console.log("// wall: executed timeout, nothing to do");
            }
        }, 30000)
        return () => {
            console.log("// wall: cleared timeout");
            clearTimeout(timeout);
        }
    }, [idle])

    useEffect(()=>{
        if(!app) return;
        // clearMessage();
        let unsubscribe = onSnapshot(collection(getFirestore(app), "settings"), (snapshot)=>{
            // for admin
            const settings = snapshot.docs.map((doc) => ({...doc.data(), id: settingsId }))[0];
            if(settings.internal === Internal.WAKE_WALL){
                setIdle({...{value:false}});
                const reset = async () => {
                    await updateDoc(doc(getFirestore(app), "settings", settingsId), {
                        internal: Internal.NONE
                    })
                }
                reset();
            }
        })
        return () => {
          unsubscribe();
        }
      }, [app, idle, settingsId])

    const wake = () => {
        setIdle({...{value:false}});
    }

    let sorted = posts.sort((a, b) => (a.created.seconds > b.created.seconds) ? 1 : -1);
    // sorted = sorted.splice(0, 2); // dev

    let wallPosts = sorted.map((post, i) => {
        const wallPost = <Post key={`post-${i}`} classList="wall display" font={post.font} message={post.message} textColour={post.textColour} fill={post.backgroundColour} strokeWidth="5" stroke={post.borderColour} shape={post.shape}/>
        return wallPost;
    })

    const grid = (walks[0][wallPosts.length - 1])?.grid || 0;

    const gridWidth = grids[grid].width;
    const gridHeight = grids[grid].height;

    let containers = wallPosts.map((post, i) => {
        const position = {
            gridColumn: walks[0][i].column - grids[grid].column + 1,
            gridRow: walks[0][i].row - grids[grid].row + 1
        }
        let anim = "";
        if(i === wallPosts.length - 1) {
            // console.log(walks[0][i].column, walks[0][i].row);
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
    
    const idleMarkup = <h1 onClick={wake} style={{padding: "3rem", color: "white"}}>idle</h1>;

    const wallMarkup = <div style={wallStyle} className="wall h-100">
        <div style={gridStyle} className="grid">
            {containers}
        </div>
        <Tagline context="wall"/>
        <Join context="wall"/>
        <CompositeLogo context="wall"/>
    </div>

    return idle.value ? idleMarkup : wallMarkup;
}

export default Wall;