// bootstrap
import { Container, Col, Row, Card, Stack, Button, Form } from "react-bootstrap";

// app
import { colours, shapes, fonts, paths, randomMessages } from './../../constants/constants';
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

// components
import Post from "../wall/Post";

const MakePostAdmin = () => {

    const [ message, setMessage ] = useState('default message');
    const [ font, setFont ] = useState(0);
    const [ shape, setShape ] = useState(0);
    const [ textColour, setTextColour ] = useState(0);
    const [ backgroundColour, setBackgroundColour ] = useState(1);
    const [ borderColour, setBorderColour ] = useState(2);

    const [,, savePost] = useOutletContext();

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

    const changeFont = (event) => {
        setFont(parseInt(event.target.value));
    }
    const selectFont = fonts.map((font) => <option key={`font-${font.label.slice(0, 3)}-${font.value}`} value={font.value}>{font.label}</option>)

    const changeShape = (index) => {
        setShape(index);
    }
    const selectShape = shapes.map((thisShape, i) => {
        let path;
        switch (thisShape.value) {
            case 0:
                path = paths.square.path;
                break;
            case 1:
                path = paths.circle.path;
                break;
            case 2:
                path = paths.heart.path;
                break;
            case 3:
                path = paths.rosette.path;
                break;
            default:
                path = paths.square.path;
                break;
        }

        const fill = colours.find((colour) => colour.value === backgroundColour)?.hex;
        let stroke = "none";
        let strokeWidth = 0;
        if(backgroundColour === 5) {
            strokeWidth = 8;
            stroke = colours.find((colour) => colour.value === backgroundColour)?.borderColor;
        }

        const svg = `<svg version="1.1" id="shape" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" viewBox="0 0 344 351">
                        <path fill="${fill}" opacity="1.000000" stroke-width="${strokeWidth}" stroke="${stroke}" d="${path}"/>
                    </svg>`;

        const encoded = window.btoa(svg);
        const shapeStyle = { backgroundImage: `url(data:image/svg+xml;base64,${encoded})`}
        const key = `shape-${thisShape.label.slice(0, 3)}-${thisShape.value}`;
        return <Form.Check style={shapeStyle} className={`shape app`} checked={i === shape} onChange={() => changeShape(i)} key={key} type="radio" name="shape"/>
    })

    const changeTextColour = (index) => {
        setTextColour(index);
    }
    const selectTextColour = colours.map((colour, i) => {
        const colourStyle = { borderColor: colour.borderColor, backgroundColor: colour.hex}
        const key = `colour-${colour.label.slice(0, 3)}-${colour.value}`;
        return <Form.Check style={colourStyle} className={`colour-swatch app`} checked={i === textColour} onChange={() => changeTextColour(i)}  key={key} type="radio" name="textColour"/>
    })

    const changeBackgroundColour = (index) => {
        setBackgroundColour(index);
    }
    const selectBackgroundColour = colours.map((colour, i) => {
        const colourStyle = { borderColor: colour.borderColor, backgroundColor: colour.hex}
        const key = `colour-${colour.label.slice(0, 3)}-${colour.value}`;
        return <Form.Check style={colourStyle} className={`colour-swatch app`} checked={i === backgroundColour} onChange={() => changeBackgroundColour(i)} key={key} type="radio" name="backgroundColour"/>
    })

    const changeBorderColour = (index) => {
        setBorderColour(index);
    }
    const selectBorderColour = colours.map((colour, i) => {
        const colourStyle = { borderColor: colour.borderColor, backgroundColor: colour.hex}
        const key = `colour-${colour.label.slice(0, 3)}-${colour.value}`;
        return <Form.Check style={colourStyle} className={`colour-swatch app`} checked={i === borderColour} onChange={() => changeBorderColour(i)}  key={key} type="radio" name="borderColour"/>
    })

    const fill = colours.find((colour) => colour.value === backgroundColour)?.hex;
    const stroke = colours.find((colour) => colour.value === borderColour)?.hex;
    const preview = <div>
        <Post mode="preview" context="app" font={font} message={message} textColour={textColour} fill={fill} strokeWidth="5" stroke={stroke} shape={shape}/>
    </div>

    const form =
        <Form onSubmit={saveHandler}>
            <Form.Group className="mb-3" controlId="message">
                <Form.Label>Message</Form.Label>
                <Form.Control onChange={changeMessage} value={message} type="text"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="font">
                <Form.Label>Font</Form.Label>
                <Form.Select onChange={changeFont} value={font}>
                    {selectFont}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" value={1} controlId="shape">
                <Form.Label>Shape</Form.Label>
                <Stack direction="horizontal" gap={3}>
                    {selectShape}
                </Stack>
            </Form.Group>
            <Form.Group className="mb-3" controlId="textColour">
                <Form.Label>Text colour</Form.Label>
                <Stack direction="horizontal" gap={3}>
                    {selectTextColour}
                </Stack>
            </Form.Group>
            <Form.Group className="mb-3" controlId="backgroundColour">
                <Form.Label>Background colour</Form.Label>
                <Stack direction="horizontal" gap={3}>
                    {selectBackgroundColour}
                </Stack>
            </Form.Group>
            <Form.Group className="mb-3" controlId="borderColour">
                <Form.Label>Border colour</Form.Label>
                <Stack direction="horizontal" gap={3}>
                    {selectBorderColour}
                </Stack>
            </Form.Group>
            <Stack direction="horizontal" gap={2}>
                <Button variant="primary" type="submit">Save</Button>
                <Button variant="secondary" onClick={rand}>Rand</Button>
            </Stack>
        </Form>

        return <Container fluid className="postapp">
            <Row className="mt-3">
                <Col>
                    <Card>
                        {/* <Card.Header>App</Card.Header> */}
                        <Card.Body>
                            <Stack direction="vertical" gap={3}>
                                {preview}
                                {form}
                            </Stack>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
}

export default MakePostAdmin;