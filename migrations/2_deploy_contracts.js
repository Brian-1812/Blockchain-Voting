const PredictionMarket = artifacts.require('PredictionMarket');

const Sides = {
  Biden: 0,
  Trump: 1,
}

module.exports = async function(deployer, _network, addresses){
  const [owner, oracle, user1, user2, user3, user4, _] = addresses;
  await deployer.deploy(PredictionMarket, oracle);
  const predictionMarket = await PredictionMarket.deployed();

  await predictionMarket.placeBet(Sides.Biden, { from: user1, value: web3.utils.toWei('3', 'ether')});
  await predictionMarket.placeBet(Sides.Biden, { from: user2, value: web3.utils.toWei('5', 'ether')});
  await predictionMarket.placeBet(Sides.Trump, { from: user3, value: web3.utils.toWei('1', 'ether')});
  await predictionMarket.placeBet(Sides.Trump, { from: user4, value: web3.utils.toWei('6', 'ether')});
}