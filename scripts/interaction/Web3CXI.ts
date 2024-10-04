import { web3 } from "hardhat";
import erc20Artifacts from "../../artifacts/contracts/SaveERC20.sol/SaveERC20.json";
import artifacts from "../../artifacts/contracts/Web3CXI.sol/Web3CXI.json";
import addresses from "../../ignition/deployments/chain-4202/deployed_addresses.json"

async function main() {
    const web3Token = new web3.eth.Contract(artifacts.abi, addresses["Web3CXIModule#Web3CXI"]);
    const saveERC20 = new web3.eth.Contract(erc20Artifacts.abi, addresses['SaveERC20Module#SaveERC20']);
    web3Token.handleRevert = true;

    const [deployer, otherAccount] = await web3.eth.getAccounts();

    console.log({ deployer, otherAccount });


    // const mintTx = await web3Token.methods.mint(2000000).send({
    //     from: deployer,
    // });

    // Approve savings contract to spend token
    const approvalAmount = web3.utils.toWei("1000", 'ether');

    const approveTx = await web3Token.methods.approve(saveERC20.options.address, approvalAmount).send({
        from: deployer,
    });

    console.log("transaction:", approveTx);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});