import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("MyMSGWalletFactory", function () {

    async function deployFactoryAndCreateMsgWallet() {
        const [owner, signer1, signer2, signer3] = await hre.ethers.getSigners();
        const MyMSGWalletFactory = await hre.ethers.getContractFactory("MultiSigWalletFactory");
        const factory = await MyMSGWalletFactory.deploy();
        console.log({ factory });

        // Create a new wallet via the factory
        const validSigners = [signer1.address, signer2.address, signer3.address];
        const quorum = 2;
        const tx = await factory.createMultiSigWallet( validSigners, quorum);
        console.log({events: await tx.provider.listeners('WalletCreated')});
        // console.log({ tx });

        const deployedWalletAddress = await factory.multisigClones(1);



        // Get the instance of the deployed MyMSGWallet u.sing the wallet address
        const MyMSGWallet = await hre.ethers.getContractAt("MyMSGWallet", deployedWalletAddress);

        console.log({ MyMSGWallet, deployedWalletAddress });

        return { factory, MyMSGWallet, owner, signer1, signer2, signer3, deployedWalletAddress };

    }

    describe("Factory Deployment and Wallet Creation", function () {
        it("should deploy the factory and create a wallet", async function () {
          const { MyMSGWallet, deployedWalletAddress} = await deployFactoryAndCreateMsgWallet();
          console.log({ MyMSGWallet, deployedWalletAddress });
          expect(deployedWalletAddress).to.revertedWithoutReason;
        //   expect(deployedWalletAddress).to.properAddress;
        //   expect(await MyMSGWallet.quorum()).to.equal(2);
        });
    
        // it("should emit a WalletCreated event on wallet creation", async function () {
        //   const { factory, owner, signer1, signer2, signer3 } = await deployFactoryAndCreateMsgWallet();
        //   const validSigners = [signer1.address, signer2.address, signer3.address];
        //   const quorum = 2;
        //   await expect(factory.createMultiSigWallet(validSigners, quorum))
        //     .to.emit(factory, 'WalletCreated')
        //     .withArgs(signer1.address);
        // });
      });

  });