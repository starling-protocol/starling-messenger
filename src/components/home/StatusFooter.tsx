import React, {useCallback} from 'react';
import {
  Platform,
  Switch,
  SwitchChangeEvent,
  SwitchProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import * as starling from 'react-native-starling';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import log from '../../logger';
import stylesBuilder from '../../stylesBuilder';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackParamList} from '../Navigation';

function NotConnectedWarning(): JSX.Element {
  const styles = createStyles();

  return (
    <View style={styles.warningWrapper}>
      <Text style={styles.warningText}>
        You are not connected to the Starling network.
      </Text>
      <Text style={styles.warningText}>Connect to exchange messages.</Text>
    </View>
  );
}

function StatusFooter(): JSX.Element {
  const safeInsets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const styles = createStyles();

  const advertising = useSelector(
    (state: RootState) => state.protocol.advertising,
  );

  const peerCount = useSelector(
    (state: RootState) => state.protocol.peers.length,
  );

  const sessionCount = useSelector(
    (state: RootState) =>
      Object.values(state.protocol.contacts).filter(x => x.online === true)
        .length,
  );

  const onAdvertisingChanged = useCallback((e: SwitchChangeEvent) => {
    log(`Advertising switched: ${e.nativeEvent.value}`);

    if (e.nativeEvent.value) {
      starling.startAdvertising({
        serviceUUID: 'e3c9f0b1-a11c-eb0b-9a03-d67aa080abbc',
        characteristicUUID: '68012794-b043-476c-a002-650191132eef',
        appleBit: 58,
      });
    } else {
      starling.stopAdvertising();
    }
  }, []);

  const androidSwitchProps: SwitchProps = {
    trackColor: {
      true: '#00b600',
      false: '#ccc',
    },
    thumbColor: '#eee',
  };

  return (
    <View>
      {advertising ? null : <NotConnectedWarning />}
      <View
        style={{
          ...styles.container,
          paddingBottom: Platform.OS === 'android' ? 10 : safeInsets.bottom,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ConnectionsStatus')}>
          <View style={styles.textWrapper}>
            <Text style={styles.statusText}>
              {advertising ? 'Connected to network' : 'Disconnected'},
            </Text>
            <Text style={styles.statusText}>
              {`${peerCount} ${
                peerCount === 1 ? 'peer' : 'peers'
              }, ${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'}`}
            </Text>
          </View>
        </TouchableOpacity>
        <Switch
          value={advertising}
          onChange={onAdvertisingChanged}
          {...(Platform.OS === 'android' ? androidSwitchProps : {})}
        />
      </View>
    </View>
  );
}

const createStyles = stylesBuilder(({theme}) => ({
  container: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 0.3,
    paddingVertical: 10,
    borderColor: theme.colors.border, // '#ccc',
    backgroundColor: theme.colors.card, // '#fff',
  },
  textWrapper: {
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  warningWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.dark ? '#513e07' : '#e2c472',
    backgroundColor: theme.dark ? '#956f06' : '#ffebb4',
    padding: 10,
  },
  warningText: {
    fontSize: 12,
    color: theme.dark ? '#dabd6e' : '#725300',
    textAlign: 'center',
  },
}));

export default StatusFooter;
