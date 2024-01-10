import { version } from '../../constants/constants';
import { useState, useEffect } from 'react';

const Version = (props) => {

    const [show, setShow] = useState(false);

    useEffect(()=>{
        console.log(`Everyone's Library: project: '${props.server}' version: v${version[props.server].release}`);
    }, [])

    useEffect(()=>{
        setShow(version[props.server].show);
        if(version[props.server].dismiss > 0){
            setTimeout(()=>{
                setShow(false);
            }, version[props.server].dismiss * 1000)
        }
    }, [props.server])

    return show && <section id="version">v{version[props.server].release}</section>
}

export default Version;