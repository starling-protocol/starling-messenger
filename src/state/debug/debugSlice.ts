import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface DebugLog {
  tag: string;
  body: string;
  timestamp: string;
}

export interface DebugState {
  logs: DebugLog[];
}

const initialState: DebugState = {
  logs: [],
};

export const protocolSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    appendLog: (state, action: PayloadAction<{tag: string; body: string}>) => {
      state.logs.push({
        tag: action.payload.tag,
        body: action.payload.body,
        timestamp: new Date().toISOString(),
      });
      state.logs = state.logs.slice(-200);
    },
    clearLogs: state => {
      state.logs = [];
    },
  },
});

export const {appendLog, clearLogs} = protocolSlice.actions;

export default protocolSlice.reducer;
