import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const NikTokenTokenModule = buildModule("NikToken3Module", (m) => {


  const nikToken = m.contract("NIkToken");

  return { nikToken};
});

export default NikTokenTokenModule;
