import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SyncModel} from './sync';

export interface ContactSession {
  sessionID: string;
  deviceAddress: string;
}

export interface Contact {
  inputText: string;
  online: true | string | null;
  sessions: ContactSession[];
  nickname?: string;
  sync: SyncModel;
}

export interface ProtocolState {
  advertising: boolean;
  contacts: {
    [keyof: string]: Contact;
  };
  peers: string[];
}

const initialState: ProtocolState = {
  advertising: false,
  contacts: {},
  peers: [],
};

// const initialState: ProtocolState = {
//   advertising: false,
//   contacts: {
//     'zTQqNOqW+SesYWCzczG3Tw9JbtdsduvvDBWf1tS5Hg8=': {
//       inputText: '',
//       online: null,
//       sessions: [],
//     },
//   },
//   peers: [],
// };

export const protocolSlice = createSlice({
  name: 'protocol',
  initialState,
  reducers: {
    startAdvertising: state => {
      state.advertising = true;
    },
    stopAdvertising: state => {
      state.advertising = false;

      // disconnect all active sessions
      for (const contact of Object.keys(state.contacts)) {
        if (state.contacts[contact].online === true) {
          state.contacts[contact].online = new Date().toISOString();
        }
      }
    },
    setAdvertising: (state, action: PayloadAction<boolean>) => {
      state.advertising = action.payload;
    },
    deviceConnected: (state, action: PayloadAction<string>) => {
      const alreadyExists = !!state.peers.find(val => val === action.payload);
      if (!alreadyExists) {
        state.peers.push(action.payload);
      }
    },
    deviceDisconnected: (state, action: PayloadAction<string>) => {
      const index = state.peers.findIndex(val => val === action.payload);
      if (index >= 0) {
        state.peers.splice(index, 1);
      }
    },
    changeInputText: (
      state,
      action: PayloadAction<{contactID: string; value: string}>,
    ) => {
      state.contacts[action.payload.contactID].inputText = action.payload.value;
    },
    setNickname: (
      state,
      action: PayloadAction<{contactID: string; nickname?: string}>,
    ) => {
      state.contacts[action.payload.contactID].nickname =
        action.payload.nickname;
    },
    contactDeleted: (state, action: PayloadAction<{contactID: string}>) => {
      delete state.contacts[action.payload.contactID];
      // console.log('CONTACTS DELETE', action.payload.contactID, state.contacts);

      // const contacts = {...state.contacts};
      // delete contacts[action.payload.contactID];
      // state.contacts = contacts;
    },
    contactStateUpdated: (
      state,
      action: PayloadAction<{
        contactID: string;
        stateUpdate: SyncModel;
        stateDefaults: Partial<Contact>;
      }>,
    ) => {
      if (action.payload.contactID in state.contacts) {
        state.contacts[action.payload.contactID].sync =
          action.payload.stateUpdate;
        return;
      }

      const defaults = action.payload.stateDefaults;

      state.contacts[action.payload.contactID] = {
        inputText: defaults.inputText ?? '',
        online: defaults.online ?? null,
        nickname: defaults.nickname ?? undefined,
        sessions: [],
        sync: action.payload.stateUpdate,
      };
    },
    sessionEstablished: (
      state,
      action: PayloadAction<{
        sessionID: string;
        contactID: string;
        deviceAddress: string;
      }>,
    ) => {
      if (action.payload.contactID in state.contacts) {
        state.contacts[action.payload.contactID].online = true;
        state.contacts[action.payload.contactID].sessions.push({
          sessionID: action.payload.sessionID,
          deviceAddress: action.payload.deviceAddress,
        });
      }
    },
    sessionBroken: (state, action: PayloadAction<{sessionID: string}>) => {
      for (const contactID in state.contacts) {
        const sessionIdx = state.contacts[contactID].sessions.findIndex(
          sess => sess.sessionID === action.payload.sessionID,
        );
        if (sessionIdx != -1) {
          state.contacts[contactID].sessions.splice(sessionIdx, 1);
          if (state.contacts[contactID].sessions.length === 0) {
            state.contacts[contactID].online = new Date().toISOString();
          }
          break;
        }
      }
    },
  },
});

export const {
  startAdvertising,
  stopAdvertising,
  setAdvertising,
  deviceConnected,
  deviceDisconnected,
  changeInputText,
  setNickname,
  contactDeleted,
  contactStateUpdated,
  sessionEstablished,
  sessionBroken,
} = protocolSlice.actions;

export default protocolSlice.reducer;
