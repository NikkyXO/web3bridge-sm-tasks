import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const DaGeniusTokenModule = buildModule("DaGeniusTokenModule", (m) => {


  const daGeniusToken = m.contract("DaGeniusToken");

  return { daGeniusToken };
});

export default DaGeniusTokenModule;
