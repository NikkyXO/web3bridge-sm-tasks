// import {
//     time,
//     loadFixture,
//   } from "@nomicfoundation/hardhat-toolbox/network-helpers";
//   import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
//   import { expect } from "chai";
//   import hre from "hardhat";
  
//   describe("MyMSGWallet", function () {

//     async function deployMyMSGWalletFixture() {
//       const QUORUM = 6;
//       const validSigners: string[] = [ '0x', ]
  
//       const [owner, otherAccount] = await hre.ethers.getSigners();
  
//       const MyMSGWallet = await hre.ethers.getContractFactory("MyMSGWallet")
//       const myMSGWallet = await MyMSGWallet.deploy(QUORUM, validSigners);
  
//       return { myMSGWallet, validSigners, MyMSGWallet, QUORUM, owner, otherAccount };
//     }
  
//     describe("Deployment", function () {
//       it("Should set the right quorum", async function () {
//         const { myMSGWallet, QUORUM } = await loadFixture(deployMyMSGWalletFixture);
  
//         expect(await myMSGWallet.quorum()).to.equal(QUORUM);
//       });
  
//       it("Should set the right validSigners count", async function () {
//         const { validSigners, myMSGWallet } = await loadFixture(deployMyMSGWalletFixture);
  
//         expect(await myMSGWallet.noOfValidSigners()).to.equal(validSigners.length + 1);
//       });

//       it("Should set the right owner", async function () {
//         const { owner, myMSGWallet } = await loadFixture(deployMyMSGWalletFixture);
  
//         expect(await myMSGWallet.owner()).to.equal(owner);
//       });
  
//       it("transaction should be equal to zero", async function () {
//         const { myMSGWallet } = await loadFixture(deployMyMSGWalletFixture);
  
//         expect(await myMSGWallet.txCount()).to.equal(0);
//       });
//     });
  
//     describe("InitiateTransactionForUpdateQuorum", function () {

//       it("Should revert with the right error passed with 0 amount", async function () {
//         const { myMSGWallet} = await loadFixture(deployMyMSGWalletFixture);
        
//         const newQuorum = 0;
//         await expect(myMSGWallet.initiateTransactionForQuorum(newQuorum)).to.be.revertedWith(
//           `InvalidQuorumAmount`
//         );
//       });

//       it("Should emit an event on initiateTransactionForQuorum", async function () {
//         const { myMSGWallet} = await loadFixture(deployMyMSGWalletFixture);
//         const newQuorum = 9;

//         await expect(myMSGWallet.initiateTransactionForQuorum(newQuorum))
//         .to.emit(myMSGWallet, "TransactionCreated")
//         .withArgs(anyValue);
//       });
        

//           // it("Should emit an event on successfully transferred when approvalNos equals quorum", async function () {
//           //     const { myMSGWallet, owner, QUORUM} = await loadFixture(deployMyMSGWalletFixture);
  
//           //     const txCount = 1;
    
    
//           //   await expect(myMSGWallet.approveTx(txCount))
//           //     .to.emit(myMSGWallet, "TransferSuccessful")
//           //     .withArgs(owner, txCount, anyValue);
//           // });
  

//         // await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWith(`AlreadyListed`)
//         // Error with args: 
//         // expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWithCustomError(nftMarketplace, `AlreadyListed`).withArgs(basicNft.address, TOKEN_ID)
//         // for Events:
//         // await expect(contract.emitUint(2))
//         //   .to.emit(contract, "Uint")
//         //   .withArgs(isEven);
//     });
  
//     // describe("Events", function () {
//     //     it("Should emit an event on initiateTransaction", async function () {
//     //         const { myMSGWallet} = await loadFixture(deployMyMSGWalletFixture);

//     //         const amount = 2;
//     //         const recipient = '';
//     //         const tokenAddress = '';
//     //         const txCount = 1;
  
  
//     //       await expect(myMSGWallet.initiateTransaction(amount, recipient, tokenAddress))
//     //         .to.emit(myMSGWallet, "TransactionCreated")
//     //         .withArgs(txCount, anyValue);
//     //     });

//     //     it("Should emit an event on approve Transaction", async function () {
//     //         const { myMSGWallet, owner} = await loadFixture(deployMyMSGWalletFixture);

//     //         const txCount = 1;
  
  
//     //       await expect(myMSGWallet.approveTx(txCount))
//     //         .to.emit(myMSGWallet, "SignerApprovedTransactionSuccessfully")
//     //         .withArgs(owner, txCount, anyValue);
//     //     });

//     //     // it("Should emit an event on successfully transferred when approvalNos equals quorum", async function () {
//     //     //     const { myMSGWallet, owner, QUORUM} = await loadFixture(deployMyMSGWalletFixture);

//     //     //     const txCount = 1;
  
  
//     //     //   await expect(myMSGWallet.approveTx(txCount))
//     //     //     .to.emit(myMSGWallet, "TransferSuccessful")
//     //     //     .withArgs(owner, txCount, anyValue);
//     //     // });

        
//     // });
  
//     // describe("ApproveTransaction", function () {
//     //     it("Should approve transaction", async function () {
//     //       const { myMSGWallet,  } = await loadFixture(deployMyMSGWalletFixture);
  
//     //       const txCount = 1;
  
//     //       await expect(myMSGWallet.approveTx(txCount)).to.changeEtherBalances(
//     //         [owner, lock],
//     //         [lockedAmount, -lockedAmount]
//     //       );
//     //     });
//     // });
  
//   });


// hre.ethers.Wallet.createRandom().address,
//         hre.ethers.Wallet.createRandom().address,
//         hre.ethers.Wallet.createRandom().address,
//         hre.ethers.Wallet.createRandom().address,



  