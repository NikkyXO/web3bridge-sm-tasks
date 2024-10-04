import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const OnChainNFTModule = buildModule("OnChainNFTModule", (m) => {


  const onchainNft = m.contract("OnChainNFT");

  return { onchainNft };
});

export default OnChainNFTModule;
