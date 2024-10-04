import { ethers } from "hardhat";
import { EventLog } from "ethers";

// // 'TransferSingle' 'MintSuccessful'

async function main() {
  console.log("interacting");
  const EventManagementAddress = "0x13599B98Bfe524c301E6f6476C39988595FBBC02";
  const web3CXITokenAddress = "0x181a3b2169bA6ED1E9c6941a1B38f4fBAc330AC8";
  const nftToken = await ethers.getContractAt("IERC20", web3CXITokenAddress);
  const eventContract = await ethers.getContractAt(
    "EventManagement",
    EventManagementAddress
  );
  
  const [signer, signer2] = await ethers.getSigners();

  console.log({ eventContract, nftToken });

  const approvalAmount = ethers.parseUnits("1000", 18);

    const approveTx = await nftToken.approve(eventContract, approvalAmount);
    await approveTx.wait(); 

  console.log("Creating event ********************* ");

  const createTx = await eventContract.createEvent("Solomon", 10, web3CXITokenAddress);
  const createTxReceipt = await createTx.wait();
  console.log({ createTxReceipt});
//   console.log(createTxReceipt?.logs);
//   const createEventsLogs = createTxReceipt?.logs.find((log) => {
//       if (log && typeof log === 'object' && 'fragment' in log) {
//           return (log as EventLog).fragment?.name != undefined;
//       }
//       return false;
//   });


//   console.log({ createEventsLogs });
  console.log(await eventContract.events(1));


  console.log("Register event ********************* ");

  const registerTx = await eventContract.registerForEvent(1);

  const registerTxReceipt = await registerTx.wait();
  console.log(registerTxReceipt?.logs);
  const registerLogs = registerTxReceipt?.logs.find((log) => {
      if (log && typeof log === 'object' && 'fragment' in log) {
          return (log as EventLog).fragment?.name != undefined;
      }
      return false;
  });

  console.log({ registerLogs });


  console.log("Close Event ********************* ");
  const closeEventTx = await eventContract.closeEvent(1);

  const closeEventTxReceipt = await closeEventTx.wait();
  console.log(closeEventTxReceipt?.logs);
  const closeEventLogs = closeEventTxReceipt?.logs.find((log) => {
      if (log && typeof log === 'object' && 'fragment' in log) {
          return (log as EventLog).fragment?.name != undefined;
      }
      return false;
  });

  console.log({ closeEventLogs });


  console.log("Delete Event ********************* ");
  const deleteEventTx = await eventContract.deleteEvent(1);

  const deleteEventTxReceipt = await deleteEventTx.wait();
  const deleteEventLogs = deleteEventTxReceipt?.logs.find((log) => {
      if (log && typeof log === 'object' && 'fragment' in log) {
          return (log as EventLog).fragment?.name != undefined;
      }
      return false;
  });

  console.log({ deleteEventLogs});

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
