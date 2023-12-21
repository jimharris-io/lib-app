// bootstrap
import { Container, Col, Row, Card, Stack, Button, Form } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';

// app
import { colours, shapes, fonts, randomMessages } from '../../constants/constants';
import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";

// components
import Post from "../wall/Post";
import LibraryOn from "../campaign/LibraryOn"
import About from "../campaign/About";
import Join from "../campaign/Join";
import ArtsCouncil from "../campaign/ArtsCouncil";
import Bhcc from "../campaign/Bhcc";
import Submit from "./Submit";
import Next from "./Next";
import Previous from "./Previous";

import {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} from 'obscenity';

const matcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers,
})

const PostingApp = () => {

    const [ message, setMessage ] = useState('Type your message here');
    const [ font, setFont ] = useState(0);
    const [ shape, setShape ] = useState(0);
    const [ textColour, setTextColour ] = useState(0);
    const [ backgroundColour, setBackgroundColour ] = useState(1);
    const [ borderColour, setBorderColour ] = useState(2);
    const [ idle, setIdle ] = useState(true);

    const ref = useRef(null);

    const [,,, savePost,, setShowModal, setModalContents, setModalPromise,,, confirmation, setConfirmation] = useOutletContext();

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    const saveHandler = (event) => {
        event.preventDefault();
        if(matcher.hasMatch(message)){
            setShowModal(true);
            setModalContents({
                customClass: "posting",
                title: "Profanity found",
                body: <span>Whoa! You need to change that.</span>,
                reject: null,
                resolve: "Ok"
            })
            setModalPromise(null);
            return;
        }
        savePost({
            message: message,
            font: font,
            shape: shape,
            textColour: textColour,
            backgroundColour: backgroundColour,
            borderColour: borderColour
        });
    }

    const rand = () => {

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
    }

    const changeMessage = (event) => {
        setMessage(event.target.value);
    }

    const changeFont = (index) => {
        setFont(index);
    }
    const selectFont = fonts.map((thisFont, i) => {
        const key = `font-${thisFont.value}`;
        return <Form.Check className={`font-select${i === font ? ' checked' : ''}`} checked={i === font} key={key} type="radio" name="font">
                <div className={`font-label ${thisFont.className}`} onClick={() => changeFont(i)}  >{thisFont.label}</div>
            </Form.Check>
    })
    
    const changeShape = (index) => {
        setShape(index);
    }
    const selectShape = shapes.map((thisShape, i) => {   
        const fill = colours.find((colour) => colour.value === backgroundColour)?.hex;
        let stroke = "none";
        let strokeWidth = 0;
        if(backgroundColour === 5) {
            strokeWidth = 8;
            stroke = colours.find((colour) => colour.value === backgroundColour)?.borderColor;
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
        // if(index === borderColour || index === textColour) {
        //     const msg = index === borderColour ? 'border' : 'text';
        //     const step = index === borderColour ? 'three' : 'four';
        //     setShowModal(true);
        //     setModalContents({
        //         customClass: "posting",
        //         title: "Choose another colour",
        //         body: <span>{`That's the current ${msg} colour.`}<br/>{`Change it in step ${step} or choose another colour`}</span>,
        //         reject: null,
        //         resolve: "Ok"
        //     })
        //     setModalPromise(null);
        //     return;
        // }
        setBackgroundColour(index);
    }
    const selectBackgroundColour = colours.map((colour, i) => {
        if(colour.value === 5) return;
        if(colour.value === 6) return;
        if(colour.value === borderColour) return;
        if(colour.value === textColour) return;
        const colourStyle = { borderColor: colour.borderColor, backgroundColor: colour.hex}
        const key = `colour-${colour.label.slice(0, 3)}-${colour.value}`;
        return <Form.Check style={colourStyle} className={`colour-swatch${i === backgroundColour ? ' checked' : ''}`} checked={i === backgroundColour} onChange={(e) => changeBackgroundColour(i, e)} key={key} type="radio" name="backgroundColour"/>
    })

    const changeBorderColour = (index) => {
        // if(index === backgroundColour) {
        //     setShowModal(true);
        //     setModalContents({
        //         customClass: "posting",
        //         title: "Choose another colour",
        //         body: <span>{`That's the current shape colour.`}<br/>{`Change it in step two or choose another colour`}</span>,
        //         reject: null,
        //         resolve: "Ok"
        //     })
        //     setModalPromise(null);
        //     return;
        // }
        setBorderColour(index);
    }
    const selectBorderColour = colours.map((colour, i) => {
        if(colour.value === 5) return;
        if(colour.value === backgroundColour) return;
        const colourStyle = { borderColor: colour.borderColor, backgroundColor: colour.hex}
        const key = `colour-${colour.label.slice(0, 3)}-${colour.value}`;
        return <Form.Check style={colourStyle} className={`colour-swatch${i === borderColour ? ' checked' : ''}`} checked={i === borderColour} onChange={() => changeBorderColour(i)}  key={key} type="radio" name="borderColour"/>
    })

    const changeTextColour = (index) => {
        // if(index === backgroundColour) {
        //     setShowModal(true);
        //     setModalContents({
        //         customClass: "posting",
        //         title: "Choose another colour",
        //         body: <span>{`That's the current shape colour.`}<br/>{`Change it in step two or choose another colour`}</span>,
        //         reject: null,
        //         resolve: "Ok"
        //     })
        //     setModalPromise(null);
        //     return;
        // }
        setTextColour(index);
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

    const textfocus = () => {
        ref.current.focus();
    }

    const dismissKeyboard = (e) => {
        if (e.key === 'Enter') {
           e.target.blur();
        }
    }

    const reset = () => {
        // setIndex(0);
        setConfirmation(false);
        // setIdle(true);
        setFont(0);
        setShape(0);
        setTextColour(0);
        setBackgroundColour(1);
        setBorderColour(2);
        setMessage("Type your message here");
    }

    const dismissIdle = () => {
        setIdle(false);
    }

    const dismissConfirmation = () => {
        reset();
    }


        const data = [
            {
                jsx: <Form.Group className="h-100" controlId="shape">
                        <Stack className="h-100 justify-content-evenly" direction="vertical">
                            <Form.Label><span className="sohne-leicht">Step one</span><br/>Choose a shape</Form.Label>
                            <Stack className="justify-content-center" direction="horizontal" gap={4}>
                                {selectShape}
                            </Stack>
                        </Stack>
                    </Form.Group>
            },
            {
                jsx: <Form.Group className="h-100" controlId="backgroundColour">
                        <Stack className="h-100 justify-content-evenly" direction="vertical">
                            <Form.Label><span className="sohne-leicht">Step two</span><br/>Choose a colour for the shape's background</Form.Label>
                            <Stack className="justify-content-center" direction="horizontal" gap={4}>
                                {selectBackgroundColour}
                            </Stack>
                        </Stack>
                    </Form.Group>
            },
            {
                jsx: <Form.Group className="h-100" controlId="borderColour">
                        <Stack className="h-100 justify-content-evenly" direction="vertical">
                            <Form.Label><span className="sohne-leicht">Step three</span><br/>Choose a colour for the shape's border</Form.Label>
                            <Stack className="justify-content-center" direction="horizontal" gap={4}>
                                {selectBorderColour}
                            </Stack>
                        </Stack>
                    </Form.Group>
            },
            {
                jsx:  <Form.Group className="h-100" controlId="textColour">
                        <Stack className="h-100 justify-content-evenly" direction="vertical">
                            <Form.Label><span className="sohne-leicht">Step four</span><br/>Choose a colour for your message</Form.Label>
                            <Stack className="justify-content-center" direction="horizontal" gap={4}>
                                {selectTextColour}
                            </Stack>
                        </Stack>
                    </Form.Group>
            },
            {
                jsx: <Form.Group className="h-100" controlId="font">
                        <Stack className="h-100 justify-content-evenly" direction="vertical">
                            <Form.Label><span className="sohne-leicht">Step five</span><br/>Choose a font for your message</Form.Label>
                            <Stack className="justify-content-center" direction="horizontal" gap={4}>
                                {selectFont}
                            </Stack>
                        </Stack>
                    </Form.Group>
            },
            {
                jsx: <Form.Group className="h-100" controlId="font">
                        <Stack className="h-100 justify-content-evenly" direction="vertical">
                            <Form.Label>Submit your message</Form.Label>
                            <Stack className="justify-content-center" direction="horizontal" gap={4}>
                                <button className="submit-button" type="submit"><Submit context="app"/></button>
                                {/* <Button variant="secondary" onClick={rand}>Rand</Button> */}
                            </Stack>
                        </Stack>
                    </Form.Group>
            }
        ]

        const idleScreen = <main className="container-fluid" id="posting-app-idle">
            <section onClick={dismissIdle}>
                <LibraryOn context="idle"/>
                <About context="idle"/>
                <span>Tap to begin</span>
                {/* <Button variant="primary" onClick={dismissIdle}>Continue</Button> */}
            </section>
        </main>

        const confirmationScreen = <main className="container-fluid" id="posting-app-confirmation">
            <section onClick={dismissConfirmation}>
                <LibraryOn context="confirmation"/>
                <span>Thanks!</span>
                <Join context="confirmation"/>
                {/* <Button variant="primary" onClick={dismissConfirmation}>Continue</Button> */}
            </section>
        </main>

        const main = <main className="container-lg" id="posting-app">
            <header>
                <About context="header"/>
                {/* <LibraryOn context="header"/> */}
            </header>
            <div id="contents">

                <section onClick={textfocus} id="preview">
                    <div>{preview}</div>
                </section>

                <section id="editor">

                    <Form className="w-100 h-100" onSubmit={saveHandler}>

                        <button type="submit" disabled style={{display: "none"}} aria-hidden="true"></button>

                        <Form.Group controlId="message">
                            <Form.Control /*pattern="[a-zA-Z\s&\d]"*/ autoComplete="off" ref={ref} onKeyUp={dismissKeyboard} onChange={changeMessage} value={message} type="text"/>
                        </Form.Group>

                        <Carousel nextIcon={<Next context="app"/>} prevIcon={<Previous context="app"/>} wrap={false} interval={null} indicators={false} activeIndex={index} onSelect={handleSelect}>
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
                    </Form>

                </section>
            </div>
            <footer onClick={rand}>
                <LibraryOn context="footer"/>
                <ArtsCouncil context="footer"/>
                <Bhcc context="footer"/>
            </footer>
        </main>

        if(idle) return idleScreen;
        // if(confirmation) return confirmationScreen;
        return main;
}

export default PostingApp;