import {Button, Form, FormGroup, Card} from "react-bootstrap";
import {useState, useEffect} from "react";
import {getFunctions, httpsCallable, connectFunctionsEmulator} from "firebase/functions";
import { useRef } from "react";

import ReCAPTCHA from "react-google-recaptcha";

const Node = (props) => {
  const [data, setData] = useState(null);
  const [functions, setFunctions] = useState(null);

  const captchaRef = useRef(null)

  let helloFunction;
  let verify;

  useEffect(() => {
    if (props.app) {
      const functions = getFunctions(props.app);
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);
      setFunctions(functions);
    }
  }, [props]);

  useEffect(() => {
    if (functions) {
      helloFunction = httpsCallable(functions, "helloWorld");
      verify =  httpsCallable(functions, "verify");
    }
  }, [functions]);

  const dev = () => {
    helloFunction &&
      helloFunction("foo")
        .then((result) => {
          console.log(result);
          setData(result.data);
        })
        .catch((error) => console.log(error));
  };

  const submit = () => {
    const token = captchaRef.current.getValue();
    captchaRef.current.reset();
    verify && verify(token)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log(error));
  }

  return (
    <section id="server">
      <Card className="mb-3">
        <Card.Header>
          <h1>Firebase Cloud Function test</h1>
        </Card.Header>
        <Card.Body>
          <h2>
            Message: <span>{data}</span>
          </h2>
          <Button onClick={dev} variant="primary" type="">
            dev
          </Button>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <h1>reCAPTCHA test</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="h-100 carousel-item-contents-container" controlId="shape">
              <Button className="mb-3" onClick={submit} variant="primary" type="">Submit</Button>
              <ReCAPTCHA ref={captchaRef} sitekey={process.env.REACT_APP_SITE_KEY}/>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </section>
  );
};

export default Node;

//<Form className="w-100 h-100" onSubmit={(e)=>e.preventDefault()}>
