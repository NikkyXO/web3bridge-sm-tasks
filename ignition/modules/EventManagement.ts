import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const EventManagementModule = buildModule("EventManagementModule", (m) => {


  const eventManagement = m.contract("EventManagement");

  return { eventManagement  };
});

export default EventManagementModule;
