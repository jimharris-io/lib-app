import { Button, Stack, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

const Node = (props) => {

  const [data, setData] = useState(null);
  const [functions, setFunctions] = useState(null);

  let helloFunction;

  useEffect(()=>{
    if(props.app) {
      const functions = getFunctions(props.app)
      connectFunctionsEmulator(functions, "localhost", 5001);
      setFunctions(functions);
    }
  }, [props])

  useEffect(()=>{
    if(functions){
      helloFunction = httpsCallable(functions, 'helloWorld');
    }
  }, [functions])

  // useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  const dev = () => {
    helloFunction && helloFunction({ text: "foo" })
      .then(result => {console.log(result);setData(result.data)})
      .catch(error => console.log(error))
  }

  return (
    <section id="server">
      <Card>
        <Card.Header>
          <h1>
            Firebase Cloud Function test
          </h1>
        </Card.Header>
        <Card.Body>
          <h2>Message: <span>{data}</span></h2>
          <Button onClick={dev} variant="primary" type="">dev</Button>
        </Card.Body>
      </Card>
    </section>
  );
};

export default Node;