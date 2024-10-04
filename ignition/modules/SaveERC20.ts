import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0x1E78d975362F9e4184c89CaeCfB8eb6Ef64527C8";

const SaveERC20Module = buildModule("SaveERC20Module", (m) => {

    const save = m.contract("SaveERC20", [tokenAddress]);

    return { save };
});

export default SaveERC20Module;

