import {ListenerMiddleware, configureStore} from '@reduxjs/toolkit';
import protocolSlice, {Contact} from './state/protocol/protocolSlice';
import linkingSlice from './state/linking/linkingSlice';
import debugSlice from './state/debug/debugSlice';
import persistence, {PersistenceKey} from './persistence';

// const logger = createLogger({
//   colors: false,
// });

const persistenceMiddleware: ListenerMiddleware<RootState, AppDispatch> =
  api => next => action => {
    const actionType = action.type as string;

    const oldState = api.getState();

    let result;
    if (
      actionType == 'protocol/contactStateUpdated' &&
      action?.payload?.contactID
    ) {
      const contactID = action.payload.contactID;

      result = next({
        ...action,
        payload: {
          ...action.payload,
          stateDefaults: persistence.get(
            `${PersistenceKey.CONTACT_STATE}_${contactID}`,
            {},
          ),
        },
      });
    } else {
      result = next(action);
    }

    if (actionType.startsWith('protocol/')) {
      let contactID = action?.payload?.contactID;

      if (actionType == 'protocol/sessionBroken') {
        for (const sessionContactID in oldState.protocol.contacts) {
          const sessionIdx = oldState.protocol.contacts[
            sessionContactID
          ].sessions.findIndex(
            sess => sess.sessionID === action.payload.sessionID,
          );
          if (sessionIdx != -1) {
            contactID = sessionContactID;
          }
        }
      }

      const contact: Contact | undefined =
        api.getState()?.protocol?.contacts[contactID];

      if (contact) {
        const {sync, sessions, ...persistenceState} = contact;

        persistence.set(
          `${PersistenceKey.CONTACT_STATE}_${contactID}`,
          persistenceState,
        );
      }
    }
    return result;
  };

const reducer = {
  protocol: protocolSlice,
  linking: linkingSlice,
  debug: debugSlice,
};

const storeType = configureStore({
  reducer,
});

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    persistenceMiddleware,
  ],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof storeType.getState>;
export type AppDispatch = typeof storeType.dispatch;
