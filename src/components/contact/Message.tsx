import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Message as MessageType} from '../../state/protocol/messages';
import {groupContactID, joinGroup} from 'react-native-starling';
import {useDispatch, useSelector} from 'react-redux';
import log from '../../logger';
import {connectionsSelector} from '../../state/selectors';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {StackParamList} from '../Navigation';
import stylesBuilder from '../../stylesBuilder';
import {contactCreated} from '../../appLinks';
import Identicon from '../Identicon';
import {SyncModel, SyncModelType} from '../../state/protocol/sync';
import {Contact} from '../../state/protocol/protocolSlice';

type ContactInviteButtonProps = {
  groupSecret: string;
  sender: 'me' | 'them';
};

function ContactInviteButton({
  groupSecret,
  sender,
}: ContactInviteButtonProps): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const existingGroups = useSelector(connectionsSelector('group'));

  const groupID = useMemo(() => groupContactID(groupSecret), [groupSecret]);
  const disabled = existingGroups.includes(groupID);

  const styles = createInviteStyles(disabled)();

  if (sender == 'me') {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          You invited the chat to join a group
        </Text>
        <Text style={styles.groupName}>{groupID.slice(0, 20)}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          You have been invited to join a group
        </Text>
        <Text style={styles.groupName}>{groupID.slice(0, 20)}</Text>
        <Pressable
          style={styles.button}
          disabled={disabled}
          onPress={() => {
            joinGroup(groupSecret)
              .then(contactID => {
                contactCreated(contactID);
                navigation.navigate('Contact', {id: contactID});
              })
              .catch(err => log(`failed to join group: ${err}`));
          }}>
          <Text style={styles.buttonLabel}>Join Group</Text>
        </Pressable>
      </View>
    );
  }
}

const createInviteStyles = (disabled: boolean) =>
  stylesBuilder(({theme}) => ({
    container: {
      marginTop: 10,
    },
    description: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    groupName: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      fontWeight: 'bold',
    },
    button: {
      marginTop: 10,
      backgroundColor: '#EFF5FC',
      padding: 6,
      borderRadius: 6,
    },
    buttonLabel: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: disabled ? '#BABABA' : theme.colors.primary,
    },
  }));

type MessageProps = {
  contactID: string;
  contact: Contact;
  msg: MessageType;
};

function Message({contactID, contact, msg}: MessageProps): JSX.Element {
  const sender = contact.sync.public_key === msg.public_key ? 'me' : 'them';
  const timestamp = msg.timestamp;

  const styles = makeStyles(sender)();

  let contactInvite = null;
  const groupSecret = msg.attached_secret;
  if (groupSecret) {
    contactInvite = (
      <ContactInviteButton
        sender={sender}
        groupSecret={groupSecret}
        // contact={contact}
        // contactAttachment={contactAttachment}
      />
    );
  }

  const recipientsSeen = msg.seen_by.filter(
    x => x != contact.sync.public_key && x != msg.public_key,
  );

  const groupSeenAvatars = recipientsSeen.map(publicKey => (
    <View key={publicKey} style={styles.seenAvatarBorder}>
      <View style={styles.seenAvatar} key={publicKey}>
        <Identicon seed={publicKey} contactType="link" />
      </View>
    </View>
  ));

  const contactSeenText =
    sender === 'me' && recipientsSeen.length > 0 ? (
      <Text style={styles.contactSeen}>Seen</Text>
    ) : null;

  const senderName =
    contact.sync.type === 'group'
      ? msg.public_key.slice(0, 12)
      : contact.nickname ?? contactID.slice(0, 12);

  return (
    <View style={styles.container}>
      {contact.sync.type === 'group' ? (
        <View style={styles.avatar}>
          <Identicon seed={msg.public_key} contactType="link" />
        </View>
      ) : null}
      <View style={styles.messageContainer}>
        <View style={styles.topTextWrapper}>
          <Text style={styles.senderText}>
            {sender === 'me' ? 'Me' : senderName}
          </Text>
          <Text style={styles.timestampText}>{timestamp.toLocaleString()}</Text>
        </View>
        <View style={styles.messageBubble}>
          <Text style={styles.bodyText}>{msg.value}</Text>
          {contactInvite}
        </View>
        {contact.sync.type === 'group' ? (
          <View style={styles.seenAvatarsContainer}>{groupSeenAvatars}</View>
        ) : (
          contactSeenText
        )}
      </View>
    </View>
  );
}

const makeStyles = (sender: 'me' | 'them') =>
  stylesBuilder(({theme}) => ({
    container: {
      flexDirection: sender === 'me' ? 'row-reverse' : 'row',
      paddingLeft: sender === 'me' ? 0 : 20,
      paddingRight: sender === 'me' ? 20 : 0,
    },
    avatar: {
      marginTop: 14,
      paddingLeft: sender === 'me' ? 10 : 0,
      paddingRight: sender === 'me' ? 0 : 10,
      width: 40,
      height: 40,
    },
    seenAvatarsContainer: {
      flexDirection: sender === 'me' ? 'row-reverse' : 'row',
      marginTop: 4,
      marginHorizontal: 10,
    },
    seenAvatarBorder: {
      borderWidth: 2,
      borderColor: theme.colors.background,
      borderRadius: 10,
      marginHorizontal: -2,
    },
    seenAvatar: {
      width: 14,
      height: 14,
    },
    contactSeen: {
      textAlign: 'right',
    },
    messageContainer: {
      marginBottom: 20,
    },
    topTextWrapper: {
      flexDirection: sender === 'me' ? 'row-reverse' : 'row',
      gap: 8,
    },
    senderText: {},
    timestampText: {
      color: '#777',
      fontSize: 12,
    },
    bodyText: {
      fontSize: 16,
    },
    messageBubble: {
      padding: 8,
      width: '85%',
      borderRadius: 8,
      borderTopLeftRadius: sender === 'them' ? 0 : undefined,
      borderTopRightRadius: sender === 'me' ? 0 : undefined,
      backgroundColor: sender === 'me' ? '#d6e3f1' : '#e9e9e9',
      marginLeft: sender === 'me' ? 'auto' : undefined,
    },
  }));

export default Message;
