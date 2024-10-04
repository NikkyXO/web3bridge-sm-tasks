import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("MyMSGWallet", function () {

    async function deployMyMSGWalletFixture() {
      const QUORUM = 2;
      const [owner, signer1, signer2, recipient] = await hre.ethers.getSigners();
      console.log( owner.address, signer1.address, signer2.address, recipient.address);
      const web3CXI = await hre.ethers.getContractFactory("Web3CXI");
      const web3CXIContract = await web3CXI.deploy();

      const MyMSGWallet = await hre.ethers.getContractFactory("MyMSGWallet")
      const wallet = await MyMSGWallet.deploy(2, [owner.address, signer1.address, signer2.address]);

      const transferAmount = hre.ethers.parseEther("1000");
      await web3CXIContract.transfer(await wallet.getAddress(), transferAmount);

  
      return { wallet, signer1, signer2, recipient, web3CXIContract, QUORUM, owner };
    }
  
    describe("Deployment", function () {
      it("Should set the right quorum and valid signers", async function () {
        const { wallet, signer1, signer2, owner } = await loadFixture(deployMyMSGWalletFixture);
        expect(await wallet.quorum()).to.equal(2);
        expect(await wallet.validSigners(owner.address)).to.be.true;
        expect(await wallet.validSigners(signer1.address)).to.be.true;
        expect(await wallet.validSigners(signer2.address)).to.be.true;
      });
  
    });


    describe("Transaction Approval for Transfer", function () {
      it("Should allow valid signers to approve a transaction", async function () {
        const { wallet, signer1, signer2, recipient, owner, web3CXIContract } = await loadFixture(deployMyMSGWalletFixture);
        await wallet.initiateTransactionForTransfer(hre.ethers.parseEther("1000"), recipient.address, await web3CXIContract.getAddress());

        await wallet.connect(signer1).approveTx(1);
        await wallet.connect(signer2).approveTx(1);

        const tx = await wallet.transactions(1);
        expect(tx.isCompleted).to.be.true;
      });

      it("Should revert if a signer tries to approve twice", async function () {
        const { wallet, signer1, recipient, web3CXIContract } = await loadFixture(deployMyMSGWalletFixture);
        await wallet.initiateTransactionForTransfer(hre.ethers.parseEther("10"), recipient.address, await web3CXIContract.getAddress());
        await wallet.connect(signer1).approveTx(1);
        await expect(wallet.connect(signer1).approveTx(1)).to.be.revertedWithCustomError(wallet, `SignerAlreadySigned()`);
      });
  
    });


    describe("Transaction Approval for Quorum Update", function () {
      it("Should update the quorum", async function () {
        const { wallet, signer1, signer2 } = await loadFixture(deployMyMSGWalletFixture);
        await wallet.initiateTransactionForQuorum(3);
        await wallet.connect(signer1).approveTx(1);
        await wallet.connect(signer2).approveTx(1);
  
        expect(await wallet.quorum()).to.equal(3);
      });
  
    });
  });

  