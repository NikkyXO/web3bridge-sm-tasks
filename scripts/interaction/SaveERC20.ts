import { web3 } from "hardhat";
import erc20Artifacts from "../../artifacts/contracts/SaveERC20.sol/SaveERC20.json";
import addresses from "../../ignition/deployments/chain-4202/deployed_addresses.json"
import web3CXIArtifacts from "../../artifacts/contracts/Web3CXI.sol/Web3CXI.json";

// Reference: https://docs.web3js.org/guides/hardhat_tutorial/

async function main() {
    const Web3CXIContract = new web3.eth.Contract(web3CXIArtifacts.abi, addresses['Web3CXIModule#Web3CXI']);
    const erc20Contract = new web3.eth.Contract(erc20Artifacts.abi, addresses['SaveERC20Module#SaveERC20']);
    erc20Contract.handleRevert = true;

    
    const [deployer, otherAccount] = await web3.eth.getAccounts();
    console.log({ deployer, otherAccount });
    const approvalAmount = web3.utils.toWei("0.001", 'ether');

    const approveTx = await Web3CXIContract.methods.approve(erc20Contract.options.address, approvalAmount).send({
        from: deployer,
    });
    console.log("Approve transaction hash:", approveTx.transactionHash);


    //1. Check contract balance before deposit
    //  const contractBalanceBefore = await erc20Contract.methods.getContractBalance().call();
    //  console.log("Contract balance before deposit:", contractBalanceBefore);

 
     //2. Deposit tokens to SaveERC20 contract
     const depositAmount = web3.utils.toWei("150", 'ether'); // 150 tokens

     const depositTx = await erc20Contract.methods.deposit(depositAmount).send({
         from: deployer,
         gas: (await erc20Contract.methods.deposit(depositAmount).estimateGas({ from: deployer })).toString()
     });
     console.log("Deposit transaction hash:", depositTx.transactionHash);
 

     // Check contract balance after deposit
    //  const contractBalanceAfter = await erc20Contract.methods.getContractBalance().call();
    //  console.log("Contract balance after deposit:", contractBalanceAfter);
 
     // Withdrawal and interaction logic can follow here as needed


    // Withdrawal Interaction
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
