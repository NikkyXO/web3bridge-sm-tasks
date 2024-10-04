import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const DAQuadraticVotingModule = buildModule("DAQuadraticVotingModule", (m) => {


  const daouadraticVoting = m.contract("DAOQuadraticVoting");

  return { daouadraticVoting  };
});

export default DAQuadraticVotingModule;
