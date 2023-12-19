// bootstrap
import { Container, Col, Row, Card, Stack, Button, Form } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';

// app
import { colours, shapes, fonts, randomMessages } from '../../constants/constants';
import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";

// components
import Post from "../wall/Post";

const PostingApp = () => {

    const [ message, setMessage ] = useState('Type your message here');
    const [ font, setFont ] = useState(0);
    const [ shape, setShape ] = useState(0);
    const [ textColour, setTextColour ] = useState(0);
    const [ backgroundColour, setBackgroundColour ] = useState(1);
    const [ borderColour, setBorderColour ] = useState(2);

    const ref = useRef(null);

    const [,, savePost,, setShowModal, setModalContents, setModalPromise] = useOutletContext();

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    const saveHandler = (event) => {
        event.preventDefault();
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

        // background and border colour should not be black
        let colours = [0, 1, 2, 3, 4, 6];
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
        if(colour.value === borderColour) return;
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

    // const form =
    //     <Form onSubmit={saveHandler}>
    //         <Form.Group className="mb-3" controlId="message">
    //             <Form.Label>Message</Form.Label>
    //             <Form.Control onChange={changeMessage} value={message} type="text"/>
    //         </Form.Group>
    //         <Form.Group className="mb-3" controlId="font">
    //             <Form.Label>Font</Form.Label>
    //             <Form.Select onChange={changeFont} value={font}>
    //                 {selectFont}
    //             </Form.Select>
    //         </Form.Group>
    //         <Form.Group className="mb-3" value={1} controlId="shape">
    //             <Form.Label>Shape</Form.Label>
    //             <Stack direction="horizontal" gap={3}>
    //                 {selectShape}
    //             </Stack>
    //         </Form.Group>
    //         <Form.Group className="mb-3" controlId="textColour">
    //             <Form.Label>Text colour</Form.Label>
    //             <Stack direction="horizontal" gap={3}>
    //                 {selectTextColour}
    //             </Stack>
    //         </Form.Group>
    //         <Form.Group className="mb-3" controlId="backgroundColour">
    //             <Form.Label>Background colour</Form.Label>
    //             <Stack direction="horizontal" gap={3}>
    //                 {selectBackgroundColour}
    //             </Stack>
    //         </Form.Group>
    //         <Form.Group className="mb-3" controlId="borderColour">
    //             <Form.Label>Border colour</Form.Label>
    //             <Stack direction="horizontal" gap={3}>
    //                 {selectBorderColour}
    //             </Stack>
    //         </Form.Group>
    //         <Stack direction="horizontal" gap={2}>
    //             <Button variant="primary" type="submit">Save</Button>
    //             <Button variant="secondary" onClick={rand}>Rand</Button>
    //         </Stack>
    //     </Form>

        const data = [
            {
                jsx: <Form.Group className="h-100" controlId="shape">
                        <Stack className="h-100 justify-content-evenly" direction="vertical">
                            <Form.Label><span className="sohne-leicht">Step one</span><br/>Choose a shape</Form.Label>
                            <Stack direction="horizontal" gap={4}>
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
                            <Stack direction="horizontal" gap={4}>
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
                                <Button variant="primary" type="submit">Save</Button>
                                <Button variant="secondary" onClick={rand}>Rand</Button>
                            </Stack>
                        </Stack>
                    </Form.Group>
            }
        ]

        return <main className="container-lg" id="posting-app">
            <header>
                <div>header</div>
            </header>
            <div id="contents">

                <section onClick={textfocus} id="preview">
                    <div>{preview}</div>
                </section>

                <section id="editor">

                    <Form className="w-100 h-100" onSubmit={saveHandler}>

                        <Form.Group controlId="message">
                            <Form.Control ref={ref} onChange={changeMessage} value={message} type="text"/>
                        </Form.Group>

                        <Carousel wrap={false} interval={null} indicators={false} activeIndex={index} onSelect={handleSelect}>
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
            <footer>
                <div>footer</div>
            </footer>
        </main>
}

export default PostingApp;