import {Linking} from 'react-native';
import {startLinking, stopLinking} from './state/linking/linkingSlice';
import hapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {Dispatch} from '@reduxjs/toolkit';
import {connectLinkSession, startLinkSession} from 'react-native-starling';
import {store} from './store';
import log from './logger';

export function startLink(dispatch: Dispatch): Promise<string> {
  return new Promise((resolve, reject) => {
    startLinkSession()
      .then(url => {
        log(`Starting linking with url: ${url}`);
        dispatch(startLinking({url}));
        resolve(url);
      })
      .catch(err => {
        log(`ERROR: Failed to start linking session: ${err}`);
        dispatch(stopLinking());
        reject(err);
      });
  });
}

export function contactCreated(contactID: string) {
  log(`Contact created: ${contactID}`);
  hapticFeedback.trigger(HapticFeedbackTypes.notificationSuccess);
  // store.dispatch(contactCreatedAction({contactID}));
}

function registerAppLinks() {
  const handleAppLink = (remoteURL: string) => {
    log(`Handle URL ${remoteURL}`);

    const createContact = () => {
      connectLinkSession(remoteURL)
        .then(contactID => {
          contactCreated(contactID);
        })
        .catch(err => log(`failed to connect to link session: ${err}`));
    };

    const isLinking = store.getState().linking.sessionURL !== undefined;
    if (isLinking) {
      createContact();
      store.dispatch(stopLinking());
    } else {
      startLink(store.dispatch).then(_ => {
        createContact();
      });
    }
  };

  Linking.getInitialURL().then(url => {
    if (url) {
      handleAppLink(url);
    }
  });

  const handle = Linking.addEventListener('url', event => {
    handleAppLink(event.url);
  });

  return () => {
    handle.remove();
  };
}

export default registerAppLinks;
