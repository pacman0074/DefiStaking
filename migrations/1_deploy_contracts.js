var LiquidityExamples = artifacts.require("../contracts/LiquidityExamples.sol")
const addressNonfungiblePositionManager = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

module.exports = function(deployer) {
  deployer.deploy(LiquidityExamples, addressNonfungiblePositionManager);
};
