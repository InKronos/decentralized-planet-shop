import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { getPlanetsContract, getUserPlanetsContract, init } from './Web3Client';
import { Button, Table } from 'react-bootstrap';

const App = () => {
 
  const provideUrl = 'http://localhost:7545';
  const [web3, setWeb3] = useState();
  const [loading, setLoading] = useState(true);
  const [isUserCard, setIsUserCard] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [planets, setPlanets] = useState();
  const [userPlanets, setUserPlanets] = useState();
  const getPlanets = () => {
    getPlanetsContract().then(_planets => {
      setPlanets(_planets);
      setLoading(false);
    })
  }

  const getUserPlanets = () => {
    getUserPlanetsContract().then(_userPlanets => {
      setUserPlanets(_userPlanets);
    })
  }
  
  const [account, setAccount] = useState();
  useEffect(() => {
    init();
    getPlanets();
    getUserPlanets();
  },[]);

  return (
    <div className="App">
      <header className="App-header">
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
              <td><Button>Kup</Button></td>
            </tr>
          )}
          </tbody>
        </Table>
        
      </header>
    </div>
  );
}

export default App;
