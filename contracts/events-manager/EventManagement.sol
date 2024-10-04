// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract EventManagement {
  
  // State Variables
  address eventManager;
  uint24 public eventCount;
  uint24 public completed;
  uint24 public pending;
  uint24 public canceled;

  struct Event {
    uint24 eventId;
    string eventName;
    uint32 maxAttendies;
    address tokenAddress;
    bool completed;
    uint24 attendance;
    uint time;
  }

  Event[] private viewAllEvents;

  // CUSTOM ERRORS
  error notEventManager();
  error addressZeroDetected();
  error shouldBeMoreThanTen();
  error mustMintNFTToAttend();
  error eventClosed();
  error userHasRegisteredEvent();

  // EVENTS
  event eventCreationSuccessful(uint24 indexed eventId, string indexed eventName, uint32 maxAttendies, address indexed tokenAddress, uint256 timestamp);
  event registrationSuccessful(uint indexed eventId, string indexed eventName, uint attendance, uint indexed maxAttendies);
  event eventDeleted(uint indexed eventId, string eventName, uint indexed time, uint attendance, uint indexed maxAttendies);
  event eventIsClosed(uint indexed eventId, string eventName, uint indexed time, uint attendance, uint indexed maxAttendies);

  constructor() {
    eventManager = msg.sender;
  }

  // MAPPINGS
  mapping(uint => Event) public events;
  mapping(address => mapping(uint => bool)) public hasRegistered;

  // FUNCTIONAL CHECKS
  function zeroAddressCheck() view private {
    if(msg.sender == address(0)) { revert addressZeroDetected(); }
  }

  function confirmManager() view private {
   if(eventManager != msg.sender) { revert notEventManager(); } 
  }

  function createEvent(string memory _name, uint32 _maxAttendies, address _token) external {
    zeroAddressCheck();
    confirmManager();
    if(_maxAttendies <= 10) { revert shouldBeMoreThanTen(); }
    if(_token == address(0)) { revert addressZeroDetected(); }

    uint24 _getId = eventCount + 1;
    uint _getTime = block.timestamp;

    Event storage newEvent = events[_getId];

    newEvent.eventId = _getId;
    newEvent.eventName = _name;
    newEvent.maxAttendies = _maxAttendies;
    newEvent.tokenAddress = _token;
    newEvent.time = _getTime;

    eventCount += 1;
    pending = eventCount;

    viewAllEvents.push(Event(_getId, _name, _maxAttendies, _token, false, 0, _getTime));

    emit eventCreationSuccessful(_getId, _name, _maxAttendies, _token, _getTime);

  }

  function registerForEvent(uint24 eventId) external {
    zeroAddressCheck();

    Event storage chosenEvent = events[eventId];
    if(!chosenEvent.completed) { 
      pending -= 1;
      completed += 1;
      chosenEvent.completed = true;
      revert eventClosed();
    }
    if(!hasRegistered[msg.sender][chosenEvent.eventId]) { revert userHasRegisteredEvent(); }

    address tokenAddress = chosenEvent.tokenAddress;
    uint attendeeBalance = IERC721(tokenAddress).balanceOf(msg.sender);

    if(!(attendeeBalance >= 1)) { revert mustMintNFTToAttend(); }

    hasRegistered[msg.sender][chosenEvent.eventId] == true;
    chosenEvent.attendance += 1;

    emit registrationSuccessful(chosenEvent.eventId, chosenEvent.eventName, chosenEvent.attendance, chosenEvent.maxAttendies);

  }

  function closeEvent(uint24 eventId) external {
    zeroAddressCheck();
    confirmManager();

    Event storage chosenEvent = events[eventId];

    chosenEvent.completed = true;


    pending -= 1;
    completed += 1;

    emit eventIsClosed(chosenEvent.eventId, chosenEvent.eventName, chosenEvent.time, chosenEvent.attendance, chosenEvent.maxAttendies);
  }

  function deleteEvent(uint24 eventId) external {
    zeroAddressCheck();
    confirmManager();

    Event storage chosenEvent = events[eventId];

    delete events[eventId];
    // viewAllEvents.pop(Event(eventId));

    pending -= 1;
    canceled += 1;

    emit eventDeleted(chosenEvent.eventId, chosenEvent.eventName, chosenEvent.time, chosenEvent.attendance, chosenEvent.maxAttendies);
  }

}