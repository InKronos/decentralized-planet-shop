// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

contract Land {

    struct Planet {
        uint planetId;
        string planetName;
        uint landLeft;
    }

    struct PlanetProduct {
        string planetName;
        uint landBought;
    }

    mapping(uint => Planet) public planets;
    mapping(address => mapping(uint => PlanetProduct)) public userPlanets;

    uint public planetCounter;

    event LandBought(address indexed buyer, uint indexed _planetId, uint indexed quantity);

    constructor () public {
        addPlanet(unicode"Jowisz");
        addPlanet(unicode"Mars");
        addPlanet(unicode"Księżyc");
    }

    function addPlanet(string memory _planetName) public {
        planetCounter ++;
        planets[planetCounter] = Planet(planetCounter, _planetName,  1000);
    }

    function getPlanets () public view returns(Planet [] memory){
        Planet[] memory returnPlanets = new Planet[](planetCounter);
        for (uint i = 0; i < planetCounter; i++) {
            returnPlanets[i] = planets[i+1];
        }
        return returnPlanets;
    }

    function getUserPlanets () public view returns(PlanetProduct [] memory){
        PlanetProduct[] memory returnUserPlanets = new PlanetProduct[](planetCounter);
        for (uint i = 0; i < planetCounter; i++) {
            returnUserPlanets[i] = userPlanets[msg.sender][i+1];
        }
        return returnUserPlanets;
    }

    function buyLand(uint _planetId, uint amount) public {
            require(planets[_planetId].landLeft > amount, unicode"Kocham Piwo");
            require(address(msg.sender).balance > amount, unicode"Kocham Piwo jeszcze bardziej");
            planets[_planetId].landLeft -= amount;
            if(userPlanets[msg.sender][_planetId].landBought != 0){
                userPlanets[msg.sender][_planetId].landBought+= amount;
            }
            else{
                userPlanets[msg.sender][_planetId] = PlanetProduct(planets[_planetId].planetName, amount);
            }

            emit LandBought(msg.sender,  _planetId, amount);
    }
}