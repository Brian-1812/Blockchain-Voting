const PredictionMarket = artifacts.require("PredictionMarket");

const SIDE = {
  BIDEN: 1,
  TRUMP: 0,
}

contract("PredictionMarket", addresses => {
  const [owner, oracle, user1, user2, user3, user4, _] = addresses;

  it("should work", async () => {
    const predictionMarket = await PredictionMarket.new(oracle);

    const beforeGain = (await Promise.all(
      [user1, user2, user3, user4].map(user => web3.eth.getBalance(user))
    )).map(balance => web3.utils.toBN(balance).toString())

    await predictionMarket.placeBet(SIDE.BIDEN,
      { from: user1, value: web3.utils.toWei('3', 'ether')}
    )

    await predictionMarket.placeBet(SIDE.BIDEN,
      { from: user2, value: web3.utils.toWei('4', 'ether')}
    )

    await predictionMarket.placeBet(SIDE.TRUMP,
      { from: user3, value: web3.utils.toWei('1', 'ether')}
    )

    await predictionMarket.placeBet(SIDE.TRUMP,
      { from: user4, value: web3.utils.toWei('2', 'ether')}
    )

    const afterBet = (await Promise.all(
      [user1, user2, user3, user4].map(user => web3.eth.getBalance(user))
    )).map(balance => web3.utils.toBN(balance).toString())

    await predictionMarket.reportResult(SIDE.BIDEN, SIDE.TRUMP, 
      { from: oracle }  
    )

    await Promise.all(
      [user1, user2].map(user => predictionMarket.withdrawGain(
        { from: user }
      ))
    )

    const afterGain = (await Promise.all(
      [user1, user2, user3, user4].map(user => web3.eth.getBalance(user))
    )).map(balance => web3.utils.toBN(balance).toString())

    console.log('beforeGain', beforeGain);
    console.log('afterBet', afterBet);
    console.log('afterGain', afterGain);
  })
})