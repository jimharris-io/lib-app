// bootstrap
import { Stack, Form } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';

// firebase
import { getFirestore, collection, addDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import {getFunctions, httpsCallable, connectFunctionsEmulator} from "firebase/functions";

// app
import { colours, shapes, fonts, randomMessages, Internal, confirmationTimeout, version } from '../../constants/constants';
import { useState, useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { connect } from "react-redux";
import * as actionTypes from "./../../store/actions";
import ReCAPTCHA from "react-google-recaptcha"

// components
import Post from "../wall/Post";
import LibraryOn from "../campaign/LibraryOn"
import About from "../campaign/About";
import Join from "../campaign/Join";
import ArtsCouncil from "../campaign/ArtsCouncil";
import Everyones from "../campaign/Everyones";
import Bhcc from "../campaign/Bhcc";
import Submit from "./Submit";
import Next from "./Next";
import Previous from "./Previous";
import Ok from "./Ok";
import JoinQR from "../campaign/JoinQR";
// import Continue from "./Continue"

// profanity
import { RegExpMatcher, pattern, DataSet, assignIncrementingIds, englishDataset, englishRecommendedTransformers } from 'obscenity';

const dictionary = new DataSet()
    .addAll(englishDataset)
    // .removePhrasesIf((phrase) => phrase.metadata.originalWord === 'fuck') /* eg, removals */
    .addPhrase((phrase) => /* eg, additions */
        phrase
            // .setMetadata({ originalWord: 'shit' })
            .addPattern(pattern`shit`)
            .addPattern(pattern`piss`)
            .addPattern(pattern`arse`)
            .addPattern(pattern`ass`)
            .addPattern(pattern`bollocks`)
            .addPattern(pattern`wank`)
            // .addWhitelistedTerm('simple'), /* eg, exceptions */
        );

const matcher = new RegExpMatcher({
    ...dictionary.build(),
    ...englishRecommendedTransformers
})

const PostingApp = (props) => {

    const [message, setMessage] = useState("");
    const [font, setFont] = useState();
    const [shape, setShape] = useState();
    const [textColour, setTextColour] = useState();
    const [backgroundColour, setBackgroundColour] = useState();
    const [borderColour, setBorderColour] = useState();
    const [idle, setIdle] = useState({value: true});
    const [confirmation, setConfirmation] = useState(false);
    const [index, setIndex] = useState(0);
    const [nextDisabled, setNextDisabled] = useState(true);
    const [appTimeout, setAppTimeout] = useState(5);

    const params = useParams();
    const [usingCAPTCHA, setUsingCAPTCHA] = useState(params.option !== "onsite");
    const [functions, setFunctions] = useState(null);
    const [verify, setVerify] = useState(null);
    const captchaRef = useRef(null)
    
    const ref = useRef(null);

    useEffect(()=>{
        // overscroll bounce
        const html = document.getElementsByTagName("html");
        html[0].style.overflow = "hidden";
    }, [])

    useEffect(() => {
        if (props.app) {
            const functions = getFunctions(props.app);
            // connectFunctionsEmulator(functions, "127.0.0.1", 5001);
            setFunctions(functions);
        }
    }, [props]);

    useEffect(()=>{
        // console.log("// app: init timeout");
        const timeout = setTimeout(()=>{
            if(!idle.value){
                reset();
                // console.log("// app: executed timeout, set idle");
            }/* else {
                console.log("// app: executed timeout, nothing to do");
            }*/
        }, appTimeout * 60 * 1000)
        return () => {
            // console.log("// app: cleared timeout");
            clearTimeout(timeout);
        }
    }, [idle, appTimeout])

    // settings
    useEffect(()=>{
        if(!props.app) return;
        let unsubscribe = onSnapshot(collection(getFirestore(props.app), "settings"), (snapshot)=>{
            const settings = snapshot.docs.map((doc) => ({...doc.data(), id: props.app.options.settingsId }))[0];
            setAppTimeout(settings.appTimeout);
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

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    const warnProfanity = () => { 
        props.onOpenModal({
            type: actionTypes.OPEN_MODAL,
            contents: {
                customClass: "posting",
                title: "Profanity found",
                body: <span>Whoa! You need to change that.</span>,
                reject: null,
                resolve: "",
                customButton: <Ok context="app"/>
            },
            resolve: null
        })
    }

    const save = async () => {
        props.onShowLoading({type: actionTypes.SHOW_LOADING});

        await addDoc(collection(getFirestore(props.app), "posts"), {
            message: message,
            font: font,
            shape: shape,
            textColour: textColour,
            backgroundColour: backgroundColour,
            borderColour: borderColour,
            created: new Date(),
            favourite: false
        }).then(()=>{
            setConfirmation(true);
            setTimeout(()=>{
                dismissConfirmation();
            }, confirmationTimeout * 1000)

        }).catch((err)=>{
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "saving post",
                error: err
            })
        }).finally(()=>{
            props.onHideLoading({type: actionTypes.HIDE_LOADING});
        })
    }

    const passCaptcha = () => {
        const token = captchaRef.current.getValue();
        const verify =  httpsCallable(functions, "verify", {region:""});
        captchaRef.current.reset();
        verify && verify(token)
            .then((result) => {
                // console.log(result);
                if(result.data.pass === false){
                    props.onOpenModal({
                        type: actionTypes.OPEN_MODAL,
                        contents: {
                            customClass: "posting",
                            title: "Complete reCAPTCHA",
                            body: <span>Please complete reCAPTCHA to continue.</span>,
                            reject: null,
                            resolve: "",
                            customButton: <Ok context="app"/>
                        },
                        resolve: null
                    })
                } else {
                    if(result.data.pass === true){
                        save();
                    }
                }
            })
        .catch((error) => {
            // console.log("//", error);
            props.onOpenModal({
                type: actionTypes.OPEN_MODAL,
                contents: {
                    customClass: "posting",
                    title: "reCAPTCHA",
                    body: <span>{error.toString()}</span>,
                    reject: null,
                    resolve: "",
                    customButton: <Ok context="app"/>
                },
                resolve: null
            })
        });
    }

    const saveHandler = async (event) => {
        event.preventDefault();

        if(index !== 5) return; // handle ios submitting on return key
        if(message === "") return;

        const matchAll = require('string.prototype.matchall') // support older ipad for demo
        matchAll.shim()

        if(new String().matchAll && matcher.hasMatch(message)){
            warnProfanity();
            return;
        }

        if(usingCAPTCHA){
            passCaptcha();
        } else {
            save();
        }

    }

    const rand = () => {
 
        if(!version[props.server].cheatMode) return;

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // background and border colour should not be black or white
        let colours = [0, 1, 2, 3, 4];
        colours = shuffleArray(colours);
        setBackgroundColour(colours.pop());
        setBorderColour(colours.pop());

        // text colour can be black
        colours.push(5);
        colours = shuffleArray(colours);
        setTextColour(colours.pop());

        setShape(parseInt(Math.random() * 4));
        setFont(parseInt(Math.random() * 2));
        
        setMessage(randomMessages[parseInt(Math.random() * randomMessages.length)])

        setIndex(5);
    }

    const changeMessage = (event) => {

        let strip_emojis = event.target.value.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u2018]|[\u2020-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            ''
        )

        let single = strip_emojis.replace(
            /(['])/g,
            '\u2019'
        )

        setMessage(single);
        awake();
    }

    const changeFont = (index) => {
        setFont(index);
        setNextDisabled(false);
    }

    const selectFont = fonts.map((thisFont, i) => {
        const key = `font-${thisFont.value}`;
        return <Form.Check className={`font-select${i === font ? ' checked' : ''}`} checked={i === font} key={key} type="radio" name="font">
                <div className={`font-label ${thisFont.className}`} onClick={() => changeFont(i)}  >{thisFont.label}</div>
            </Form.Check>
    })
    
    const changeShape = (index) => {
        setShape(index);
        setNextDisabled(false);
    }

    const selectShape = shapes.map((thisShape, i) => {

        let stroke = "none";
        let strokeWidth = 0;
        if(backgroundColour === 5) {
            strokeWidth = 8;
            stroke = colours.find((colour) => colour.value === backgroundColour)?.borderColor;
        }

        let fill;
        if(backgroundColour){
            fill = colours.find((colour) => colour.value === backgroundColour)?.hex;
        } else {
            fill = "black";
            stroke = "white";
            strokeWidth = 2;
        }

        const shapeInfo = shapes.find(s => s.value === thisShape.value);
        const svg = `<svg version="1.1" id="shape" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" viewBox="0 0 344 351">
                        <path fill="${fill}" opacity="1.000000" stroke-width="${strokeWidth}" stroke="${stroke}" d="${shapeInfo.path}"/>
                    </svg>`;
        const encoded = window.btoa(svg);
        const shapeStyle = { backgroundImage: `url(data:image/svg+xml;base64,${encoded})`}
        const key = `shape-${thisShape.label.slice(0, 3)}-${thisShape.value}`;
        return <Form.Check style={shapeStyle} className={`shape${i === shape ? ' checked' : ''}`} checked={i === shape} onChange={() => changeShape(i)} key={key} type="radio" name="shape"/>
    })

    const changeBackgroundColour = (index, e) => {
        setBackgroundColour(index);
        setNextDisabled(false);
    }

    const selectBackgroundColour = colours.map((colour, i) => {
        if(colour.value === 5) return; // background cannot be black
        if(colour.value === 6) return; // background cannot be white
        if(colour.value === borderColour) return; // cannot be border colour if one chosen
        if(colour.value === textColour) return; // cannot be text colour if one chosen
        const colourStyle = { borderColor: colour.borderColor, backgroundColor: colour.hex}
        const key = `colour-${colour.label.slice(0, 3)}-${colour.value}`;
        return <Form.Check style={colourStyle} className={`colour-swatch${i === backgroundColour ? ' checked' : ''}`} checked={i === backgroundColour} onChange={(e) => changeBackgroundColour(i, e)} key={key} type="radio" name="backgroundColour"/>
    })

    const changeBorderColour = (index) => {
        setBorderColour(index);
        setNextDisabled(false);
    }

    const selectBorderColour = colours.map((colour, i) => {
        if(colour.value === 5) return;
        if(colour.value === backgroundColour) return;
        const colourStyle = { borderColor: colour.borderColor, backgroundColor: colour.hex}
        const key = `colour-${colour.label.slice(0, 3)}-${colour.value}`;
        return <Form.Check style={colourStyle} className={`colour-swatch${i === borderColour ? ' checked' : ''}`} checked={i === borderColour} onChange={() => changeBorderColour(i)}  key={key} type="radio" name="borderColour"/>
    })

    const changeTextColour = (index) => {
        setTextColour(index);
        setNextDisabled(false);
    }
    
    const selectTextColour = colours.map((colour, i) => {
        // if(colour.value === borderColour) return;
        if(colour.value === backgroundColour) return;
        const colourStyle = { borderColor: colour.borderColor, backgroundColor: colour.hex}
        const key = `colour-${colour.label.slice(0, 3)}-${colour.value}`;
        return <Form.Check style={colourStyle} className={`colour-swatch${i === textColour ? ' checked' : ''}`} checked={i === textColour} onChange={() => changeTextColour(i)}  key={key} type="radio" name="textColour"/>
    })

    const preview = <div>
        <Post change={changeMessage} classList="app" font={font} message={message} textColour={textColour} fill={backgroundColour} strokeWidth="8" stroke={borderColour} shape={shape}/>
    </div>

    // const textfocus = () => {
    //     ref.current.focus();
    // }

    const dismissKeyboard = (e) => {
        if (e.key === 'Enter') {
           e.target.blur();
        }
    }

    const reset = () => {
        setIndex(0);
        setConfirmation(false);
        setIdle({...{value: true}});
        setFont();
        setShape();
        setTextColour();
        setBackgroundColour();
        setBorderColour();
        setMessage("");
    }

    const dismissIdle = async () => {
        awake();
    }

    const awake = async () => {
        setIdle({...{value: false}});
        await updateDoc(doc(getFirestore(props.app), "settings", props.app.options.settingsId), {
            internal: Internal.WAKE_WALL
        }).then((res)=>{})
        .catch((err)=>{
            props.onErrorMessage({
                type: actionTypes.ERROR_MESSAGE,
                title: "waking wall",
                error: err
            })
        }).finally(()=>{})
    }

    const dismissConfirmation = () => {
        reset();
    }

    let data = [
        {
            jsx: <Form.Group className="h-100 carousel-item-contents-container" controlId="shape">
                    {/* <Stack className="h-100 justify-content-evenly" direction="vertical"> */}
                        <Form.Label><span className="sohne-leicht">Step one</span><br/>Choose a shape</Form.Label>
                        <Stack className="justify-content-center" direction="horizontal">
                            {selectShape}
                            {/* <div className="text-center">shape</div> */}
                        </Stack>
                    {/* </Stack> */}
                </Form.Group>
        },
        {
            jsx: <Form.Group className="h-100 carousel-item-contents-container" controlId="backgroundColour">
                    {/* <Stack className="h-100 justify-content-evenly" direction="vertical"> */}
                        <Form.Label><span className="sohne-leicht">Step two</span><br/>Choose a background colour</Form.Label>
                        <Stack className="justify-content-center" direction="horizontal">
                            {selectBackgroundColour}
                            {/* <div className="text-center">background colour</div> */}
                        </Stack>
                    {/* </Stack> */}
                </Form.Group>
        },
        {
            jsx: <Form.Group className="h-100 carousel-item-contents-container" controlId="borderColour">
                    {/* <Stack className="h-100 justify-content-evenly" direction="vertical"> */}
                        <Form.Label><span className="sohne-leicht">Step three</span><br/>Choose a border colour</Form.Label>
                        <Stack className="justify-content-center" direction="horizontal">
                            {selectBorderColour}
                            {/* <div className="text-center">border colour</div> */}
                        </Stack>
                    {/* </Stack> */}
                </Form.Group>
        },
        {
            jsx:  <Form.Group className="h-100 carousel-item-contents-container" controlId="textColour">
                    {/* <Stack className="h-100 justify-content-evenly" direction="vertical"> */}
                        <Form.Label><span className="sohne-leicht">Step four</span><br/>Choose a text colour</Form.Label>
                        <Stack className="justify-content-center" direction="horizontal">
                            {selectTextColour}
                            {/* <div className="text-center">text colour</div> */}
                        </Stack>
                    {/* </Stack> */}
                </Form.Group>
        },
        {
            jsx: <Form.Group className="h-100 carousel-item-contents-container" controlId="font">
                    {/* <Stack className="h-100 justify-content-evenly" direction="vertical"> */}
                        <Form.Label><span className="sohne-leicht">Step five</span><br/>Choose a font</Form.Label>
                        <Stack className="justify-content-center" direction="horizontal">
                            {selectFont}
                            {/* <div className="text-center">font</div> */}
                        </Stack>
                    {/* </Stack> */}
                </Form.Group>
        },
        {
            jsx: <Form.Group className="h-100 carousel-item-contents-container" controlId="font">
                    {/* <Stack className="h-100 justify-content-evenly" direction="vertical"> */}
                        <Form.Label style={usingCAPTCHA ? {width:"80%", margin: "0 auto"}:{}}>{usingCAPTCHA ? "Complete reCAPTCHA and s":"S"}ubmit your message</Form.Label>
                        <Stack className="align-items-center" direction="vertical">
                            <button onClick={saveHandler} disabled={message === "" && "disabled"} className="submit-button" type="button"><Submit context={`app ${message === "" && 'disabled'}`}/></button>
                        </Stack>
                    {/* </Stack> */}
                </Form.Group>
        }
    ]

    const idleScreen =
        <main className={`container-fluid ${params.option === "onsite" && 'onsite'}`} id="posting-app-idle">

            <div className="portrait-only">
                <Everyones context="warning"/>
                <span>Please rotate your device</span>
            </div>

            <section onClick={dismissIdle}>
                {/* <LibraryOn context="idle"/> */}
                <Everyones context="idle"/>
                <About context="idle"/>
                <span className="idle">Tap to begin</span>
            </section>
        </main>

    const confirmationScreen =
        <main className={`container-fluid ${params.option === "onsite" && 'onsite'}`} id="posting-app-confirmation">

            <div className="portrait-only">
                <Everyones context="warning"/>
                <span>Please rotate your device</span>
            </div>

            <section onClick={dismissConfirmation}>
                {/* <LibraryOn context="confirmation"/> */}
                <Everyones context="confirmation"/>
                <span className="confirmation">Thanks!</span>
                <Join context="confirmation"/>
                <JoinQR context="confirmation"/>
            </section>
        </main>

    const slid = (index) => {
        let disable = false;
        if(((index === 0 && shape === undefined)
            || (index === 1 && backgroundColour === undefined)
            || (index === 2 && borderColour === undefined)
            || (index === 3 && textColour === undefined)
            || (index === 4 && font === undefined))
            && (!nextDisabled)
        ){
            disable = true;
        }
        setNextDisabled(disable);
    }

    const messageMarkup = 
        <section id="message">
            {index === 5 ?
            <Form.Group className="message-input" controlId="message">
                <Form.Control enterKeyHint="done" placeholder="Tap to type your message" autoComplete="off" ref={ref} onKeyUp={dismissKeyboard} onChange={changeMessage} value={message} type="text"/>
            </Form.Group> : ''}
        </section>;

    // const messageMarkup = index === 5 ?
    //     <section id="message">
    //         <Form.Group className="message-input" controlId="message">
    //             <Form.Control enterKeyHint="done" placeholder="Tap to type your message" autoComplete="off" ref={ref} onKeyUp={dismissKeyboard} onChange={changeMessage} value={message} type="text"/>
    //         </Form.Group>
    //     </section> : '';

    // {usingCAPTCHA ? <ReCAPTCHA theme="dark" sitekey={process.env.REACT_APP_SITE_KEY} ref={captchaRef} /> : ''}

    const main =
        <Form className="w-100 h-100" onSubmit={(e)=>e.preventDefault()}>
            <main onClick={awake} className={`container-md ${params.option === "onsite" && 'onsite'}`} id="posting-app">

                <div className="portrait-only">
                    <Everyones context="warning"/>
                    <span>Please rotate your device</span>
                </div>

                <header className="justify-content-center" onClick={rand}>
                    {usingCAPTCHA && index === 5 ?
                        <ReCAPTCHA theme="dark" sitekey={process.env.REACT_APP_SITE_KEY} ref={captchaRef} />:
                        <About context="header"/>
                    }
                </header>    

                <div id="contents" className={`w-100 step-${index}`}>

                    <section /*onClick={textfocus}*/ id="preview">
                        <div>{preview}</div>
                        {/* <span>preview</span> */}
                    </section>

                    {messageMarkup}

                    <section id="editor">

                        <button type="submit" disabled style={{display: "none"}} aria-hidden="true"></button>

                        <Carousel touch={!nextDisabled} className={nextDisabled && 'disabled'} onSlid={slid} nextIcon={<Next context="app"/>} prevIcon={<Previous context="app"/>} wrap={false} interval={null} indicators={false} activeIndex={index} onSelect={handleSelect}>
                            {data.map((slide, i) => {
                                return (
                                    <Carousel.Item key={`slide-${i}`}>
                                        <div className="carousel-item-contents">
                                            {slide.jsx}
                                        </div>
                                    </Carousel.Item>
                                )
                            })}
                        </Carousel>
                        
                    </section>
                </div>

                <div></div>
                
            </main>
            <footer id="posting-app-footer">
                <div className="container-md h-100" >
                    <LibraryOn context="footer"/>
                    <ArtsCouncil context="footer"/>
                    <Bhcc context="footer"/>
                </div>
            </footer>

        </Form>

    if(idle.value) return idleScreen;
    if(confirmation) return confirmationScreen;
    return main;
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

export default connect(mapStateToProps, mapDispatchToProps)(PostingApp);