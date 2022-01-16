pragma solidity ^0.8.10;

contract PredictionMarket {
  address public oracle;
  bool public isOpen=true;
  enum Side { Biden, Trump }
  struct Result {
    Side winner;
    Side loser;
  }

  Result public result;
  mapping(Side => uint) public totalBetAmount;
  mapping(address => mapping(Side => uint)) public betAmounts;

  constructor(address _oracle){
    oracle = _oracle;
  }

  function placeBet(Side _side) external payable {
    require(msg.value > 0, "Bet amount must be greater than 0");
    require(isOpen, "Prediction market is not open");
    totalBetAmount[_side] += msg.value;
    betAmounts[msg.sender][_side] += msg.value;
  }

  function withdrawGain() external {
    uint gamblerBet = betAmounts[msg.sender][result.winner];
    require(gamblerBet > 0, "You have no gain to withdraw");
    require(!isOpen, "The market is still open");
    uint gain = gamblerBet + gamblerBet*totalBetAmount[result.loser]/totalBetAmount[result.winner];
    betAmounts[msg.sender][result.winner] = 0;
    betAmounts[msg.sender][result.loser] = 0;
    payable(msg.sender).transfer(gain);
  }

  function reportResult(Side _winner, Side _loser) external {
    require(isOpen, "Prediction market is finished");
    require(msg.sender == oracle, "Only oracle can report the result");
    result.winner = _winner;
    result.loser = _loser;
    isOpen = false;
  }
}

