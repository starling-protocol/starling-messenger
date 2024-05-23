import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Identicon from '../Identicon';
import {ConnectionStatus} from '../contact/ContactHeader';
import {StackParamList} from '../Navigation';
import stylesBuilder from '../../stylesBuilder';

function NoContacts(): JSX.Element {
  const style = createStyles();

  return (
    <View style={style.noContactsWrapper}>
      <Text style={style.noContactsTitle}>No contacts</Text>
      <Text style={style.noContactsBody}>
        Click "Link contact" icon to link with another device
      </Text>
    </View>
  );
}

function ContactList(): JSX.Element {
  const styles = createStyles();
  const contacts = useSelector((state: RootState) => state.protocol.contacts);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const contactKeys = Object.keys(contacts).sort((a, b) => {
    const onlineA = contacts[a].online;
    const onlineB = contacts[b].online;

    if (onlineA === onlineB) {
      return 0;
    }

    if (onlineA === true) {
      return -1;
    }

    if (onlineB === true) {
      return 1;
    }

    if (typeof onlineA === 'string' && typeof onlineB === 'string') {
      return (
        new Date(onlineB as string).getTime() -
        new Date(onlineA as string).getTime()
      );
    }

    if (typeof onlineA === 'string') {
      return -1;
    }

    if (typeof onlineB === 'string') {
      return 1;
    }

    return 0;
  });

  if (contactKeys.length == 0) {
    return <NoContacts />;
  }

  const connectionList = contactKeys.map(contact => {
    const contactType = contacts[contact].sync.type;

    return (
      <Pressable
        key={contact}
        android_ripple={{
          color: '#D8E3F0',
        }}
        onPress={() => {
          navigation.navigate('Contact', {id: contact});
        }}
        style={styles.container}>
        <View style={styles.icon}>
          <Identicon seed={contact} contactType={contactType} />
        </View>
        <View style={styles.contactDetails}>
          <Text
            style={{
              ...styles.nameText,
              fontWeight: contacts[contact].online === true ? 'bold' : 'normal',
            }}>
            {contacts[contact].nickname ?? contact.slice(0, 24)}
          </Text>
          <ConnectionStatus contact={contacts[contact]} />
        </View>
      </Pressable>
    );
  });

  return <View>{connectionList}</View>;
}

const createStyles = stylesBuilder(({theme}) => ({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 42,
    height: 42,
  },
  contactDetails: {
    flexGrow: 1,
    borderBottomWidth: 0.5,
    borderColor: theme.colors.border,
    marginBottom: -8,
  },
  nameText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  noContactsWrapper: {
    marginTop: 40,
  },
  noContactsTitle: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: 24,
  },
  noContactsBody: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: 12,
    marginTop: 8,
  },
}));

export default ContactList;
