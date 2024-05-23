import {Settings} from 'react-native';
import log from './logger';

export enum PersistenceKey {
  WELCOME_DISMISSED = 'welcome-dismissed',
  CONTACT_STATE = 'contact-state',
}

const persistence = {
  set: (key: PersistenceKey | string, value: any) => {
    log(`Set persistence '${key}': ${JSON.stringify(value)}`);
    Settings.set({[key]: value});
  },
  get<T>(key: PersistenceKey | string, defaultValue: T): T {
    const value = Settings.get(key) ?? defaultValue;
    log(`Get persistence '${key}': ${JSON.stringify(value)}`);
    return value;
  },
};

export default persistence;
