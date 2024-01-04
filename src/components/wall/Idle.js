import video from "./../../media/video/everyoneslibrary.mp4";
import { useRef, useEffect } from "react";

const Idle = (props) => {

    useEffect(()=>{
        // ref.current.
    }, [])
    const ref = useRef(null);

    return <section id="video" onClick={props.wake}>
            <video ref={ref} width="100%" height="100%" autoPlay muted loop preload="metadata">
                <source src={video} type="video/mp4"/>
            </video>
        </section>
}

export default Idle;