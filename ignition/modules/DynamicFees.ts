import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress1 = "0x5cD571919dF92B190850157BB2bC2f2e1a1e4245";
const tokenAddress2 = "0x6E49838243c3576F48ADd1DE56d9CCf6A2520072";
const DynamicFeeAMMModule = buildModule("DynamicFeeAMMModule", (m) => {


  const dynamicFeeAMM = m.contract("DynamicFeeAMM", [tokenAddress1, tokenAddress2]);

  return { dynamicFeeAMM };
});

export default DynamicFeeAMMModule;
