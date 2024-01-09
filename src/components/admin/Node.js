import { Button, Stack, Card } from "react-bootstrap";
import { useState, useEffect } from "react";

const Node = (props) => {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <section id="server">
      <Card>
        <Card.Header>
          <h1>
            Node server test
          </h1>
        </Card.Header>
        <Card.Body>
          <h2>Message: <span>{data}</span></h2>
        </Card.Body>
      </Card>
    </section>
  );
};

export default Node;