import Web3 from 'web3'
import LandContractBuild from 'contracts/Land.json';

let selectedAccount;
let landContract;
let isInitialized = false;

export const init = async() => {
    let provider = window.ethereum;

    if (typeof provider !== 'undefined') {
    
    provider
    .request({method: 'eth_requestAccounts' })
    .then((accounts) => {
      selectedAccount = accounts[0];
      console.log(`Selected account is ${selectedAccount}`);
    })
    .catch((err) => {
      console.log(err);
    });
    window.ethereum.on('accountsChanged', function (accounts){
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  }
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  landContract = new web3.eth.Contract(LandContractBuild.abi, LandContractBuild.networks[networkId].address);
};

export const getPlanetsContract  = async () => {
    if (!isInitialized) {
      await init();
  }
    return landContract.methods
      .getPlanets().call();
  };

  export const getUserPlanetsContract  = async () => {
    if (!isInitialized) {
      await init();
  }
    return landContract.methods
      .getUserPlanets().call();
  }

  