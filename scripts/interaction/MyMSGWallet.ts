import { ethers } from "hardhat";


async function main() {
    const MSGWalletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const wallet = await ethers.getContractAt("MyMSGWallet", MSGWalletAddress);

    const web3CXIAddress = "0xD410219f5C87247d3F109695275A70Da7805f1b1";
    const web3CXI  = await ethers.getContractAt("Web3CXI", web3CXIAddress);

    const [owner, signer1, signer2, signer3, recipient] = await ethers.getSigners();
    
    const approvalAmount = ethers.parseUnits("1000", 18);

    await web3CXI.transfer(MSGWalletAddress, approvalAmount);

    const txAmount = ethers.parseUnits("1000", 18);

    await wallet.initiateTransactionForTransfer(txAmount, recipient.address, web3CXIAddress);

    await wallet.connect(signer1).approveTx(1);
    await wallet.connect(signer2).approveTx(1);

    const trx = await wallet.transactions(1);
    trx.isCompleted == true;


    await wallet.initiateTransactionForQuorum(3);
    await wallet.connect(signer1).approveTx(1);
    await wallet.connect(signer2).approveTx(1);

    const newQuorum = wallet.quorum();

    console.log(newQuorum);
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
