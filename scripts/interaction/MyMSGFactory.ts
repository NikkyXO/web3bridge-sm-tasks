import { ethers } from "hardhat";


async function main() {
    const MSGWalletFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const walletFactory = await ethers.getContractAt("MultiSigWalletFactory", MSGWalletFactoryAddress);


    const [owner, signer1, signer2, signer3, recipient] = await ethers.getSigners();

    const deployedAddress = await walletFactory.createMultiSigWallet([owner, signer1, signer2, signer3, recipient], 2)
    

    console.log({ deployedAddress });

    const cloneAddress = await walletFactory.multisigClones(1);
    console.log({ cloneAddress });


    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
