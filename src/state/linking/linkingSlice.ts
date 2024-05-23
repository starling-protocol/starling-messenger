import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface LinkingState {
  sessionURL?: string;
}

const initialState: LinkingState = {
  sessionURL: undefined,
};

export const linkingSlice = createSlice({
  name: 'linking',
  initialState,
  reducers: {
    startLinking: (state, action: PayloadAction<{url: string}>) => {
      state.sessionURL = action.payload.url;
    },
    stopLinking: state => {
      state.sessionURL = undefined;
    },
  },
});

export const {startLinking, stopLinking} = linkingSlice.actions;

export default linkingSlice.reducer;
