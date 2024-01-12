// components
import Post from "../wall/Post";
import JoinAlt from "../campaign/JoinAlt";
import Tagline from "../campaign/Tagline";
import CompositeLogo from "../campaign/CompositeLogo";
import Bhcc from "../campaign/Bhcc";
import LibraryOn from "../campaign/LibraryOn";
import Everyones from "../campaign/Everyones";
import Idle from "./Idle";

// app
import { useState, useEffect } from "react";
import { grids, walks, Internal } from './../../constants/constants';
import * as actionTypes from "./../../store/actions";
import { connect } from "react-redux";

// firebase
import { or, and, where, query, limit, orderBy, getFirestore, collection, doc, updateDoc, onSnapshot } from "firebase/firestore";

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

const Wall = (props) => {

    const [posts, setPosts] =  useState([]);
    const [faves, setFaves] =  useState([]);
    const [minGrid, setMinGrid] = useState(0);
    const [maxGrid, setMaxGrid] = useState(4);
    const [wallTimeout, setWallTimeout] = useState(5);
    const [videoTimeout, setVideoTimeout] = useState(1);

    const [idle, setIdle] = useState({value: false});
    const [videoPlaying, setVideoPlaying] = useState({value: false});

    const [debug, ] = useState(false);

    //sleep
    useEffect(()=>{
        // console.log("// wall: init timeout");
        const timeout = setTimeout(()=>{
            if(!idle.value){
                setIdle({...{value: true}});
                setVideoPlaying({...{value: true}});
                // console.log("// wall: executed timeout, set idle");
            }/* else {
                console.log("// wall: executed timeout, nothing to do");
            }*/
        }, wallTimeout * 60 * 1000)
        return () => {
            // console.log("// wall: cleared timeout");
            clearTimeout(timeout);
        }
    }, [idle, wallTimeout])

    // video timeout
    useEffect(()=>{
        // console.log("// video: init timeout");
        const timeout = setTimeout(()=>{
            if(videoPlaying.value){
                setVideoPlaying({...{value: false}});
                wake();
                // console.log("// video: executed timeout, called wake");
            } else {
                // console.log("// video: executed timeout, nothing to do");
            }
        }, videoTimeout * 60 * 1000)
        return () => {
            // console.log("// video: cleared timeout");
            clearTimeout(timeout);
        }
    }, [videoPlaying, videoTimeout])

    // wake
    useEffect(()=>{
        if(!props.app) return;
        let unsubscribe = onSnapshot(collection(getFirestore(props.app), "settings"), (snapshot)=>{
            const settings = snapshot.docs.map((doc) => ({...doc.data(), id: props.app.options.settingsId }))[0];
            // if(settings.internal === Internal.TOGGLE_DEBUG){
            //     if(debug) {
            //         setDebug(false);
            //     } else {
            //         setDebug(true);
            //     }
            // }
            if(settings.internal === Internal.WAKE_WALL){
                setIdle({...{value:false}});
                setVideoPlaying({...{value: false}});
                const reset = async () => {
                    await updateDoc(doc(getFirestore(props.app), "settings", props.app.options.settingsId), {
                        internal: Internal.NONE
                    }).then((res)=>{
                        //
                    }).catch((err)=>{
                        props.onErrorMessage({
                            type: actionTypes.ERROR_MESSAGE,
                            title: "acknowledging wake",
                            error: err
                        })
                    }).finally(()=>{})
                }
                reset();
            }
        }, (err) => {
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "listening to wake notice",
                error: err
            })
        })
        return () => {
            unsubscribe();
        }
    }, [props, idle])

    // posts
    useEffect(() => {
        if(!props.app) return;
        const colRef = collection(getFirestore(props.app), "posts");
        const q = query(colRef, orderBy('created', 'desc')/*, where('favourite', '==', false)*/);
        let unsubscribe = onSnapshot(q, (snapshot)=>{
            const posts = snapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
            let sorted = posts.sort((a, b) => (a.created.seconds > b.created.seconds) ? 1 : -1);
            // threshold is always length of the walk but the walk can't exceed the grid
            const threshold = grids[maxGrid].threshold
            const chunked = sorted.map((e, i) => i % threshold ? null : posts.slice(i, i + threshold))
                .filter(e => e)
                .pop() || [];
            setPosts(chunked);
        }, (err) => {
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "listening to posts",
                error: err
            })
        })
        return () => {
            unsubscribe();
        }
    }, [props, maxGrid])

    // favourites
    useEffect(() => {
        if(!props.app) return;
        const colRef = collection(getFirestore(props.app), "posts");
        const q = query(colRef, orderBy('created', 'desc'), where('favourite', '==', true));
        let unsubscribe = onSnapshot(q, (snapshot)=>{
            const faves = snapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
            setFaves(faves);
        }, (err) => {
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "listening to favourites",
                error: err
            })
        })
        return () => {
            unsubscribe();
        }
    }, [props])
    
    // settings
    useEffect(()=>{
        if(!props.app) return;
        let unsubscribe = onSnapshot(collection(getFirestore(props.app), "settings"), (snapshot)=>{
            const settings = snapshot.docs.map((doc) => ({...doc.data(), id: props.app.options.settingsId }))[0];
            setMinGrid(settings.gridMin);
            setMaxGrid(settings.gridMax);
            setWallTimeout(settings.wallTimeout);
            setVideoTimeout(settings.videoTimeout);
        }, (err) => {
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "listening to settings",
                error: err
            })
        })
        return () => {
            unsubscribe();
        }
    }, [props])

    const wake = () => {
        setIdle({...{value:false}});
    }

    // render wall
    
    // const currentGrid = (walks[0][posts.length - 1])?.grid || 0;
    // const currentThreshold = grids[currentGrid].threshold;
    // const maxThreshold = grids[maxGrid].threshold;
    // const remainingSlots = currentThreshold - posts.length;
    // const favesShown = faves.slice(0, remainingSlots)
    // console.log(`thresh:${currentThreshold}, chunked posts:${posts.length}, faves: ${faves.length}`);

    // all we care about are the favourites that can't be shown
    // posts, are the chunked posts to be shown, may include favourites
    // faves, are all favourites for all time currently in database
    // first, we want to isolate the unshown favourites
    
    let sorted = posts.sort((a, b) => (a.created.seconds > b.created.seconds) ? 1 : -1);

    let wallPosts = sorted.map((post, i) => {
        const wallPost = <Post favourite={post.favourite} key={`post-${i}`} classList="wall display" font={post.font} message={post.message} textColour={post.textColour} fill={post.backgroundColour} strokeWidth="5" stroke={post.borderColour} shape={post.shape}/>
        return wallPost;
    })

    const grid = (walks[0][wallPosts.length - 1])?.grid || 0;

    const gridWidth = grids[grid].width;
    const gridHeight = grids[grid].height;

    let containers = wallPosts.map((post, i) => {
        let position = {
            gridColumn: walks[0][i].column - grids[grid].column + 1,
            gridRow: walks[0][i].row - grids[grid].row + 1
        }
        if(debug && post.props.favourite){
            position = {
                ...position,
                background: "red"
            }
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

    if(debug){
        for(let k = 0; k < grids[grid].height; k++){
            for(let l = 0; l < grids[grid].width; l++){
                const empty = grids[grid].empty.filter(e=> e.column === grids[grid].column + l && e.row === grids[grid].row + k)
                const style = {
                    color: "darkgray",
                    gridColumn: l + 1,
                    gridRow: k + 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "2rem",
                    border: "1px dashed white",
                    borderRight: "none",
                    borderBottom: "none",
                    background: empty.length > 0 ? "green" : "none"
                }
                containers.push(<div onClick={()=>console.log(grids[grid].column + l, grids[grid].row + k)} style={style} key={`container-${l}-${k}`}>{`(${grids[grid].column + l}, ${grids[grid].row + k})`}</div>)
            }
        }
    }

    // favourites

    const favesShown = posts.filter(post => post.favourite);
    const favesNotShown = faves.filter((fave)=>{
        return favesShown.filter(post => post.id === fave.id).length === 0;
    })

    let favourites = favesNotShown.map((post, i) => {
        const wallPost = <Post favourite={post.favourite} key={`post-${i}`} classList="wall display" font={post.font} message={post.message} textColour={post.textColour} fill={post.backgroundColour} strokeWidth="5" stroke={post.borderColour} shape={post.shape}/>
        return wallPost;
    })

    let favouritesContainers = favourites.slice(0, grids[grid].empty.length).map((post, i) => {
        let position = {
            gridColumn: grids[grid].empty[i].column - grids[grid].column + 1,
            gridRow: grids[grid].empty[i].row - grids[grid].row + 1
        }
        if(debug && post.props.favourite){
            position = {
                ...position,
                background: "rgba(255, 0, 0, .5)"
            }
        }
        return <div style={position} key={`fcontainer-${i}`}>
                {post}
            </div>
    })

    containers = [
        ...containers,
        ...favouritesContainers
    ]
    console.log(favesNotShown.length, favouritesContainers, favesNotShown);

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
    
    const idleMarkup = idle.value ? <Idle wake={wake}/> : <div className="idle-false"/>

    const wallMarkup = <div style={wallStyle} className="wall h-100">
        <div style={gridStyle} className="grid">
            {containers}
        </div>
        {idleMarkup}
        <div className="top-left">
            <Everyones context="on-wall"/>
            <Tagline context="on-wall"/>
        </div>
        <div className="bottom-left">
            <Bhcc context="on-wall"/>
            <LibraryOn context="on-wall"/>
        </div>
        <div className="bottom-right">
            <JoinAlt context="on-wall"/>
        </div>
    </div>

    return wallMarkup;
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        onShowLoading: (action) => dispatch(action),
        onHideLoading: (action) => dispatch(action),
        onOpenModal: (action) => dispatch(action),
        onErrorMessage: (action) => dispatch(action)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wall);