import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress1 = "0x5cD571919dF92B190850157BB2bC2f2e1a1e4245";
const DAQuadraticVotingModule = buildModule("DAQuadraticVotingModule", (m) => {


  const daouadraticVoting = m.contract("DAOQuadraticVoting", [tokenAddress1]);

  return { daouadraticVoting  };
});

export default DAQuadraticVotingModule;
