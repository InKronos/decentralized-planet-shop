import logo from './jupiter.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { buyPlanetsContract, getPlanetsContract, getUserPlanetsContract, init } from './Web3Client';
import { Button, Container, Form, Modal, Nav, Navbar, Table } from 'react-bootstrap';

const App = () => {
 
  const provideUrl = 'http://localhost:7545';
  const [web3, setWeb3] = useState();
  const [loading, setLoading] = useState(true);
  const [isUserCard, setIsUserCard] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [planets, setPlanets] = useState();
  const [planetLandLeftToBuy, setPlanetLandLeftToBuy] = useState();
  const [userPlanets, setUserPlanets] = useState();
  const [show, setShow] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [showBuy, setShowBuy] = useState(true);
  const [showUser, setShowUser] = useState(false);

  const handleUser = () => {setShowUser(true); setShowBuy(false)};
  const handleShop = () => {setShowUser(false); setShowBuy(true)};

  const [planetNameToBuy, setPlanetNameToBuy] = useState("");
  const [planetIdToBuy, setPlanetIdToBuy] = useState("");
  const handleClose = () => setShow(false);
  const handleCloseAlert = () => setShowAlert(false);
  const handleShow = (planetName, planetLandLeft, planetId) => {setPlanetIdToBuy(planetId);setPlanetNameToBuy(planetName); setPlanetLandLeftToBuy(planetLandLeft);setShow(true)};
  const [formData, setFormData] = useState({
    numberBought: "",
});
  const { numberBought } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPlanets = () => {
    getPlanetsContract().then(_planets => {
      setPlanets(_planets);
      setLoading(false);
    })
  }

  const getUserPlanets = () => {
    getUserPlanetsContract().then(_userPlanets => {
      setUserPlanets(_userPlanets);
      console.log("What");
      console.log(_userPlanets);
    })
  }
  
  useEffect(() => {
    init();
    getPlanets();
    getUserPlanets();
  },[]);

  const buyLand = () => {
    console.log(userPlanets[planetIdToBuy-1]);
    console.log(numberBought);
    
    if(parseInt(numberBought) + parseInt(userPlanets[planetIdToBuy-1].landBought) >= 501){
        setShow(false);
        setShowAlert(true);
    }
    else{
      buyPlanetsContract(parseInt(planetIdToBuy), parseInt(numberBought)).then(tx => {
        console.log(tx);
        setShow(false);
        getPlanets();
        getUserPlanets();
      })
    }
    
  }

  return (
    <div className="App">
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              className="App-logo d-inline-block align-top"
              width="30"
              height="30"
            />{'            '}
                Planet land shop
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={handleShop}>Kupuj</Nav.Link>
            <Nav.Link onClick={handleUser}>Moje zakupy</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <header className="App-header">
        {showBuy ?
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nazwa planety</th>
              <th>Pozostało ziemi do kupienia</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
          { !loading && planets.map(planet => 
            <tr>
              <td>{planet.planetName}  </td>
              <td>{planet.landLeft} </td>
              <td><Button onClick={() => handleShow(planet.planetName, planet.landLeft, planet.planetId)}>Kup</Button></td>
            </tr>
          )}
          </tbody>
        </Table>
       :null }
       { showUser ? 
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nazwa planety</th>
              <th>Kupiłeś ziemi</th>
            </tr>
          </thead>
          <tbody>
          { !loading && userPlanets.map(userPlanet => 
            <tr>
              <td>{userPlanet.planetName}  </td>
              <td>{userPlanet.landBought} </td>
            </tr>
          )}
          </tbody>
        </Table>
        : null}
      </header>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{planetNameToBuy}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Widzę, że chcesz kupić kawełek planety {planetNameToBuy} <br></br>
        Ile kawałków chcesz kupić?
        <Form.Control type="number" min={0} max={planetLandLeftToBuy} placeholder="ilość" onChange={onChange} value={numberBought} name="numberBought"/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Rezygnuje
          </Button>
          <Button variant="primary" onClick={buyLand}>
            Kup
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAlert} onHide={handleCloseAlert}>
      <Modal.Header closeButton>
        <Modal.Title>Stop!</Modal.Title>
      </Modal.Header>
      <Modal.Body>Nie możesz kupić więcej niż 51% ziemi.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCloseAlert}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>

    </div>
  );
}

export default App;
