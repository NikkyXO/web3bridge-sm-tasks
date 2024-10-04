import hre from "hardhat";
import { EventLog } from "ethers";

async function main() {
    console.log('interacting');
    const NikAddress = "0x2d709D30c8C65b43A5f5b87C1539B305370aC9fa";
    const token = await hre.ethers.getContractAt("NIkToken", NikAddress);
    // const token = tokenFactory.attach(NikAddress);

    console.log({ token: token });

    const setPublicTx = await token.editMintWindows(true, true);
    await setPublicTx.wait();

    console.log(await token.publicMintOpen());


    const price = hre.ethers.parseEther("0.01");
    const gasPrice = hre.ethers.parseUnits("5", "gwei");
    const tx = await token.publicMint({ value: price, gasPrice });
    console.log({ tx });
    
    const receipt = await tx.wait(2);

    console.log(receipt?.logs);
    const logsFragments = receipt?.logs.find((log) => {
        if (log && typeof log === 'object' && 'fragment' in log) {
            return (log as EventLog).fragment?.name === "Transfer";
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
