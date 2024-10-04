import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import addresses from "../ignition/deployments/chain-4202/deployed_addresses.json";
import { Contract } from "ethers";
import { expect } from "chai";
import hre from "hardhat";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("SolomonMSG", function () {
  async function deploySolomonMSG() {
    const signers = await hre.ethers.getSigners();
    const SolomonMSG = await hre.ethers.getContractFactory("OriginalMultiSig");
    const web3CXI = await hre.ethers.getContractFactory("Web3CXI");

    const QUORUM = 2;
    const validSigners = [
      signers[0].address,
      signers[1].address,
      signers[2].address,
    ];
    const transferAmount = hre.ethers.parseEther("1000");

    const solomonMSG = await SolomonMSG.deploy(QUORUM, validSigners);
    const web3CXIContract = await web3CXI.deploy();
    await web3CXIContract.transfer(
      await solomonMSG.getAddress(),
      transferAmount
    );

    return {
      QUORUM,
      validSigners,
      solomonMSG,
      web3CXIContract,
      transferAmount,
      signers,
    };
  }
  describe("Deployment", function () {
    it("should set the right quorum", async function () {
      const { QUORUM, validSigners, solomonMSG } = await loadFixture(
        deploySolomonMSG
      );

      expect(await solomonMSG.quorum()).to.greaterThan(1);
      expect(await solomonMSG.quorum()).to.equal(QUORUM);
      expect(await solomonMSG.quorum()).to.lessThanOrEqual(validSigners.length);
    });

    it("should recognize valid signers", async function () {
      const { QUORUM, validSigners, solomonMSG } = await loadFixture(
        deploySolomonMSG
      );

      expect(await solomonMSG.isValidSigner(validSigners[0])).to.be.true;
      expect(await solomonMSG.isValidSigner(validSigners[1])).to.be.true;
      expect(await solomonMSG.isValidSigner(validSigners[2])).to.be.true;
    });
  });

  describe("Transaction Submission", function () {
    it("it should submit submits a transaction", async function () {
      const { solomonMSG, web3CXIContract, signers } = await loadFixture(
        deploySolomonMSG
      );
      const amount = hre.ethers.parseEther("100");
      await solomonMSG.transfer(
        amount,
        signers[3].address,
        await web3CXIContract.getAddress()
      );
      const tx = await solomonMSG.transactions(1);
      expect(tx.recipient).to.equal(signers[3].address);
      expect(tx.amount).to.equal(amount);
      expect(tx.isCompleted).to.be.false;
    });
    it("it should revert if a non signer submits a transaction", async function () {
      const { solomonMSG, web3CXIContract, signers } = await loadFixture(
        deploySolomonMSG
      );
      const amount = hre.ethers.parseEther("10");
      await expect(
        solomonMSG
          .connect(signers[4])
          .transfer(
            amount,
            signers[4].address,
            await web3CXIContract.getAddress()
          )
      ).to.be.revertedWith("invalid signer");
    });
  });

  describe("Transaction Approval and execution", function () {
    let solomonMSG: any;
    let web3CXIContract: any;
    let signers: any[];
    beforeEach(async function () {
      const amount = hre.ethers.parseEther("10");
      ({ solomonMSG, web3CXIContract, signers } = await loadFixture(
        deploySolomonMSG
      ));
      await solomonMSG.transfer(
        amount,
        signers[3].address,
        await web3CXIContract.getAddress()
      );
    });
    it("it should allow signers to approve a transaction", async function () {
      await solomonMSG.connect(signers[1]).approveTx(1);
      const tx = await solomonMSG.transactions(1);
      expect(tx.noOfApproval).to.equal(2);
    });

    it("it should executes the transaction after quorum approval", async function() {
      const initialRecipientBalance = await web3CXIContract.balanceOf(signers[3].address);
      await solomonMSG.connect(signers[1]).approveTx(1);

      const finalRecipientBalance = await web3CXIContract.balanceOf(signers[3].address);

      const amount = hre.ethers.parseEther("10");
      expect( finalRecipientBalance - initialRecipientBalance).to.equal(amount)

      const tx = await solomonMSG.transactions(1);
      expect(tx.noOfApproval).to.equal(2);

    });

    it("it should revert if a signer tries to approve twice", async function() {
      await solomonMSG.connect(signers[1]).approveTx(1);
      await expect( solomonMSG.connect(signers[1]).approveTx(1)).to.be.revertedWith("can't sign twice");

    });
  });

  describe("update of Quorum", function () {});
});
