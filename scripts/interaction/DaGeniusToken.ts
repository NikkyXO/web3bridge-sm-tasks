import { ethers } from "hardhat";
import { EventLog } from "ethers";

// // 'TransferSingle' 'MintSuccessful'


async function main() {
    console.log('interacting');
    const DGeniusAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const testAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
    const token = await ethers.getContractAt("DaGeniusToken", DGeniusAddress);

    console.log({ token: token });

    const price = ethers.parseEther("0.0001");
    const [signer, signer1, signer2 ] = await ethers.getSigners();
    // const gasPrice = ethers.parseUnits("10", "ether");
    // gasPrice

    const tx = await token.connect(signer1).mint(1, 1, { value: price,  });
    console.log({ tx });

    const receipt = await tx.wait();
    console.log({ receipt });
    console.log(receipt?.logs);

    // 'MintSuccessful'

    const logsFragments = receipt?.logs.find((log) => {
        if (log && typeof log === 'object' && 'fragment' in log) {
            return (log as EventLog).fragment?.name != undefined;
        }
        return false;
    });

    console.log({ logsFragments });

    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
