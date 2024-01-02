// components
import Post from "../wall/Post";
import Join from "../campaign/Join";
import Tagline from "../campaign/Tagline";
import CompositeLogo from "../campaign/CompositeLogo";

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
    const [wallTimeout, setWallTimeout] = useState(30);

    const [idle, setIdle] = useState({value:false});

    //sleep
    useEffect(()=>{
        // console.log("// wall: init timeout");
        const timeout = setTimeout(()=>{
            if(!idle.value){
                setIdle({...{value:true}});
                // console.log("// wall: executed timeout, set idle");
            }/* else {
                console.log("// wall: executed timeout, nothing to do");
            }*/
        }, 30000)
        return () => {
            // console.log("// wall: cleared timeout");
            clearTimeout(timeout);
        }
    }, [idle])

    // wake
    useEffect(()=>{
        if(!props.app) return;
        let unsubscribe = onSnapshot(collection(getFirestore(props.app), "settings"), (snapshot)=>{
            const settings = snapshot.docs.map((doc) => ({...doc.data(), id: props.app.options.settingsId }))[0];
            if(settings.internal === Internal.WAKE_WALL){
                setIdle({...{value:false}});
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

    // posts // QUERY
    useEffect(() => {
        if(!props.app) return;
        const colRef = collection(getFirestore(props.app), "posts");
        const q = query(colRef, orderBy('created', 'desc'), where('favourite', '==', false));
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

    // favourites

    const currentGrid = (walks[0][posts.length - 1])?.grid || 0;
    const currentThreshold = grids[currentGrid].threshold;
    const remainingSlots = currentThreshold - posts.length;
    const favesShown = faves.slice(0, remainingSlots)
    console.log(`thresh:${currentThreshold}, posts:${posts.length}, slots:${remainingSlots}, shown:${favesShown.length}`);

    const aggregate = [
        ...favesShown,
        ...posts
    ];

    let sorted = aggregate.sort((a, b) => (a.created.seconds > b.created.seconds) ? 1 : -1);

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