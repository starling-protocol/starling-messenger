import React from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import stylesBuilder from '../../stylesBuilder';

function ConnectionsStatus(): JSX.Element {
  const styles = createStyles();

  const peers = useSelector((state: RootState) => state.protocol.peers);
  const contacts = useSelector((state: RootState) => state.protocol.contacts);

  const peerConnections = peers.map(peer => ({
    peer,
    sessions: Object.keys(contacts)
      .map(contact => ({
        contact,
        peerSessions: contacts[contact].sessions.filter(
          sess => sess.deviceAddress === peer,
        ),
      }))
      .filter(contact => contact.peerSessions.length > 0),
  }));

  const connectionsView = peerConnections.map(({peer, sessions}) => (
    <View key={peer} style={styles.container}>
      <Text style={styles.peerTitle}>Peer {peer}</Text>
      <Text>{sessions.length} connections:</Text>
      {sessions.map(({contact, peerSessions}) => (
        <View key={contact} style={styles.connectionContainer}>
          <Text style={styles.keyLabel}>Contact:</Text>
          <Text>{contact.slice(0, 20)}</Text>
          <Text style={styles.keyLabel}>Sessions:</Text>
          {peerSessions.map(session => (
            <Text>{session.sessionID}</Text>
          ))}
        </View>
      ))}
    </View>
  ));

  return <View>{connectionsView}</View>;
}

const createStyles = stylesBuilder(() => ({
  container: {
    padding: 20,
  },
  peerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  connectionContainer: {
    padding: 10,
  },
  keyLabel: {
    fontWeight: 'bold',
  },
}));

export default ConnectionsStatus;
