import { Button, Stack, Card } from "react-bootstrap";
import { useState } from "react";
import { getDistanceBetweenTwoPoints } from "calculate-distance-between-coordinates";

const Location = (props) => {

  const [permission, setPermission] = useState(false);
  const [error, setError] = useState("Permission pending")

  const [location, setLocation] = useState({
    lat: 0,
    lon: 0,
  });
  const [home, setHome] = useState({
    lat: 50.8249162,
    lon: -0.1410777,
  });

  const success = (position) => {
    setPermission(true);
    setError("success")
    setLocation({
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    });
  };

  const err = () => {
    setLocation("error");
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, err);
    } else {
      setError("Geolocation not supported");
    }
  };
  
  const distance = getDistanceBetweenTwoPoints(home, location, "km");

  return (
    <section id="location">
      <Card>
        <Card.Header>
          <h1>
            Geo-location test <span className="muted"></span>
          </h1>
        </Card.Header>
        <Card.Body>
          <Stack direction="vertical" gap={2}>
            <p>Status: <span>{error}</span></p>
            <p>Home: lat: <span>{home.lat}</span> long: <span>{home.lon}</span></p>
            {permission === true ?
                <p>Location: lat: <span>{location.lat}</span> long: <span>{location.lon}</span></p> : <p>Location: <span>pending</span></p>
            }
            {permission === true ?
                <h2>Distance: <span>{(distance * 1000).toFixed(2)}m</span></h2> : <h2>Distance: <span>pending</span></h2>
            }
            
            <Button onClick={getLocation} cvariant="primary" type="">
              Get location
            </Button>
          </Stack>
        </Card.Body>
      </Card>
    </section>
  );
};

export default Location;
