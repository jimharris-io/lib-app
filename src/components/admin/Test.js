import { Button, Stack, Card, Form, FormGroup, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { randomMessages } from '../../constants/constants';

const Test = (props) => {
    const [running, setRunning] = useState(false);
    const [frequency, setFrequency] = useState(2);
    const [probability, setProbability] = useState(0);
    const [intervalRef, setIntervalRef] = useState(0);
    const [testBegan, setTestBegan] = useState(new Date().toLocaleTimeString('en-GB'));

    useEffect(() => {
        if(running){
            clearInterval(intervalRef);
            const interval = setInterval(()=>{
                post();
            }, frequency * 1000);
            setIntervalRef(interval);
        } else {
            clearInterval(intervalRef);
        }
    }, [frequency, probability, running]);

    const changeFrequencyRange = (e) => {
        setFrequency(e.target.value);
    };

    const changeProbabilityRange = (e) => {
        setProbability(parseInt(e.target.value));
    };

    const start = (val) => {
        setRunning(true);
        setTestBegan(new Date().toLocaleTimeString('en-GB'));
    };

    const stop = (val) => {
        setRunning(false);
    };

    const post = () => {

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
        const backgroundColour = colours.pop();
        const borderColour = colours.pop();

        // text colour can be black
        colours.push(5);
        colours = shuffleArray(colours);
        const textColour = colours.pop();

        const shape = parseInt(Math.random() * 4);
        const font = parseInt(Math.random() * 2);

        const message = randomMessages[parseInt(Math.random() * randomMessages.length)];

        const data = {
            message: message,
            font: font,
            shape: shape,
            textColour: textColour,
            backgroundColour: backgroundColour,
            borderColour: borderColour,
            created: new Date(),
            favourite: Math.random() < (probability / 100)
        }

        props.save(data);
    }


    const manual = (val) => {
        post();
    };

  return (

        <Card className="admin mb-3">
            <Card.Header>
                <Stack className="justify-content-between" direction="horizontal">
                    <span>Test{running ? `: began: ${testBegan}` : ''}</span>
                </Stack>
            </Card.Header>
            <Card.Body>
                <Stack className="justify-content-between" direction="horizontal" gap={3}>
                    <FormGroup controlId="frequency">
                        <Form.Label>Frequency: {frequency} secs</Form.Label>
                        <Form.Range step="1" min="2" max="300" onChange={changeFrequencyRange} value={frequency}/>
                    </FormGroup>
                    <FormGroup controlId="probabilty">
                        <Form.Label>Probabilty of a favourite: {probability}%</Form.Label>
                        <Form.Range step="5" min="0" max="100" onChange={changeProbabilityRange} value={probability}/>
                    </FormGroup>
                    <FormGroup controlId="test">
                        <Stack direction="horizontal" gap={2}>
                            <Button onClick={start} disabled={running} className="" variant="primary" type="">Start</Button>
                            <Button onClick={stop} disabled={!running} className="" variant="primary" type="">Stop</Button>
                            <Button onClick={manual} disabled={running} className="" variant="primary" type="">Manual</Button>
                        </Stack>
                    </FormGroup>
                </Stack>
            </Card.Body>
        </Card>


  );
};

export default Test;
