import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {Contact} from '../../state/protocol/protocolSlice';
import Identicon from '../Identicon';
import PressableIcon from '../icons/PressableIcon';
import IconSettings from '../icons/IconSettings';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackParamList} from '../Navigation';
import stylesBuilder from '../../stylesBuilder';
import {SyncModelType} from '../../state/protocol/sync';

type HeaderTitleProps = {
  contactID: string;
};

type ConnectionStatusProps = {
  contact: Contact;
};

export function ConnectionStatus({
  contact,
}: ConnectionStatusProps): JSX.Element {
  const styles = createStyles();

  let status = <Text style={styles.subtitleText}>Never seen contact</Text>;

  if (contact.online === true) {
    let subtitleText = 'Active connection';
    if (contact.sessions.length > 1) {
      subtitleText = `${contact.sessions.length} active connections`;
    }

    status = (
      <View style={styles.activityIndicator}>
        <View style={styles.activeConnectionIndicator} />
        <Text style={styles.subtitleText}>{subtitleText}</Text>
      </View>
    );
  }

  if (typeof contact.online === 'string') {
    const date = new Date(contact.online);
    status = (
      <Text style={styles.subtitleText}>Last seen {date.toLocaleString()}</Text>
    );
  }

  return status;
}

type HeaderDetailsProps = {
  contactID: string;
  contactType: SyncModelType;
};

export function HeaderLeft({
  contactID,
  contactType,
}: HeaderDetailsProps): JSX.Element {
  const styles = createStyles();

  return (
    <View style={styles.identicon}>
      <Identicon seed={contactID} contactType={contactType} />
    </View>
  );
}

export function HeaderRight({contactID}: HeaderTitleProps): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const contact = useSelector(
    (state: RootState) => state.protocol.contacts[contactID],
  );

  return (
    <View>
      <PressableIcon
        icon={IconSettings}
        onPress={() =>
          navigation.navigate('ContactSettings', {
            id: contactID,
            contactType: contact.sync.type,
          })
        }
      />
    </View>
  );
}

function HeaderTitle({contactID}: HeaderTitleProps): JSX.Element {
  const contact = useSelector(
    (state: RootState) => state.protocol.contacts[contactID],
  );

  if (contact === undefined) {
    return <Text>{contactID}</Text>;
  }

  const styles = createStyles();

  return (
    <View style={styles.container}>
      <HeaderLeft contactID={contactID} contactType={contact.sync.type} />
      <View style={styles.details}>
        <Text style={styles.titleText}>
          {contact.nickname ?? contactID.slice(0, 24)}
        </Text>
        <View style={styles.subtitleContainer}>
          <ConnectionStatus contact={contact} />
        </View>
      </View>
    </View>
  );
}

const createStyles = stylesBuilder(({theme}) => ({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  identicon: {
    width: 40,
    height: 40,
    marginLeft: -26,
    marginRight: 6,
  },
  details: {},
  titleText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  subtitleText: {
    color: theme.colors.text,
    fontSize: 11,
    fontStyle: 'italic',
  },
  activityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeConnectionIndicator: {
    backgroundColor: '#00e500',
    width: 4,
    height: 4,
    borderRadius: 4,
    marginRight: 4,
  },
}));

export default HeaderTitle;
