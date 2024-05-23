import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {SyncModelType} from './protocol/sync';

export const connectionsSelector = (contactType: SyncModelType) =>
  createSelector([(state: RootState) => state.protocol.contacts], contacts => {
    return Object.keys(contacts).filter(
      id => contacts[id].sync.type === contactType,
    );
  });
