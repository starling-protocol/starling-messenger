import {EmitterSubscription, NativeEventEmitter} from 'react-native';
import {
  StarlingEventType,
  Starling,
  loadPersistedState,
} from 'react-native-starling';

import {store} from './store';
import {
  // contactCreatedAction,
  contactDeleted,
  contactStateUpdated,
  deviceConnected,
  deviceDisconnected,
  sessionBroken,
  sessionEstablished,
  startAdvertising,
  stopAdvertising,
} from './state/protocol/protocolSlice';
import {appendLog} from './state/debug/debugSlice';
import log from './logger';
import persistence, {PersistenceKey} from './persistence';
// import {deleteSyncContact, mergeSyncStateUpdate} from './state/sync/syncSlice';

function registerNativeEvents(): () => void {
  const eventEmitter = new NativeEventEmitter(Starling);

  const listeners: EmitterSubscription[] = [];

  listeners.push(
    eventEmitter.addListener(StarlingEventType.AdvertisingStarted, () => {
      store.dispatch(startAdvertising());
    }),
  );

  listeners.push(
    eventEmitter.addListener(
      StarlingEventType.AdvertisingEnded,
      (reason: string) => {
        log(`advertising ended: ${reason}`);
        store.dispatch(stopAdvertising());
      },
    ),
  );

  listeners.push(
    eventEmitter.addListener(
      StarlingEventType.DeviceConnected,
      (deviceID: string) => {
        store.dispatch(deviceConnected(deviceID));
      },
    ),
  );

  listeners.push(
    eventEmitter.addListener(
      StarlingEventType.DeviceDisconnected,
      (deviceID: string) => {
        store.dispatch(deviceDisconnected(deviceID));
      },
    ),
  );

  listeners.push(
    eventEmitter.addListener(
      StarlingEventType.SessionEstablished,
      (sessionEstablishedData: {
        sessionID: string;
        contactID: string;
        deviceAddress: string;
      }) => {
        store.dispatch(sessionEstablished(sessionEstablishedData));
      },
    ),
  );

  listeners.push(
    eventEmitter.addListener(
      StarlingEventType.SessionBroken,
      (sessionID: string) => {
        store.dispatch(sessionBroken({sessionID}));
      },
    ),
  );

  listeners.push(
    eventEmitter.addListener(
      StarlingEventType.SyncStateChange,
      ({contactID, stateUpdate}: {contactID: string; stateUpdate: string}) => {
        if (stateUpdate) {
          const state = JSON.parse(stateUpdate);
          store.dispatch(
            contactStateUpdated({
              contactID,
              stateUpdate: state,
              stateDefaults: {},
            }),
          );
        } else {
          log(`contact deleted: ${contactID}`);
          store.dispatch(contactDeleted({contactID}));

          persistence.set(
            `${PersistenceKey.CONTACT_STATE}_${contactID}`,
            undefined,
          );
        }
      },
    ),
  );

  listeners.push(
    eventEmitter.addListener(
      StarlingEventType.DebugLog,
      (args: {tag: string; body: string}) => {
        store.dispatch(appendLog(args));
      },
    ),
  );

  loadPersistedState();

  return () => {
    listeners.forEach(listener => listener.remove());
  };
}

export default registerNativeEvents;
