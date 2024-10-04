import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const FractionalNFTModule = buildModule("FractionalNFTModule", (m) => {


  const fractionalNFT = m.contract("FractionalNFT");

  return { fractionalNFT };
});

export default FractionalNFTModule;
