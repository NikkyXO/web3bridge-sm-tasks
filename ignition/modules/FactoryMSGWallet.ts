
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const MyMSGFactoryWalletModule = buildModule("MyMSGFactoryWalletModule", (m) => {
  const msgFactory = m.contract("MultiSigWalletFactory");

  return { msgFactory };
});

export default MyMSGFactoryWalletModule;
