import React, {useEffect} from 'react';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackParamList} from '../Navigation';
import {Alert, Text, View} from 'react-native';
import Identicon from '../Identicon';
import DetailsButton from './DetailsButton';
import {ConnectionStatus} from '../contact/ContactHeader';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {Starling} from 'react-native-starling';
import stylesBuilder from '../../stylesBuilder';
import {SyncModelType} from '../../state/protocol/sync';
import {setNickname} from '../../state/protocol/protocolSlice';

type DetailItemProps = {
  title: string;
  value: JSX.Element;
};

function DetailItem({title, value}: DetailItemProps): JSX.Element {
  const styles = createStyles();

  return (
    <View style={styles.detailsItemContainer}>
      <Text style={styles.detailsItemTitle}>{title}</Text>
      <Text>{value}</Text>
    </View>
  );
}

type InviteSettingsProps = {
  contactID: string;
  contactType: SyncModelType;
};

function InviteSetting({
  contactID,
  contactType,
}: InviteSettingsProps): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  return (
    <DetailsButton
      title={
        contactType === 'link' ? 'Invite to group' : 'Invite members to group'
      }
      onPress={() => {
        navigation.navigate('InviteContact', {id: contactID, contactType});
      }}
    />
  );
}

function ContactSettings(): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const styles = createStyles();

  const {id: contactID} =
    useRoute<RouteProp<StackParamList, 'ContactSettings'>>().params;

  const contact = useSelector(
    (state: RootState) => state.protocol.contacts[contactID],
  );

  const dispatch = useDispatch();

  if (contact === undefined) {
    navigation.goBack();
    return <View />;
  }

  const totalMessages = Object.keys(contact.sync.node_states)
    .map(nodeKey => Object.keys(contact.sync.node_states[nodeKey]).length)
    .reduce((a, b) => a + b, 0);

  let safetyNumberBlocks: string[] = [];
  for (let i = 0; i < contactID.length / 6; i++) {
    safetyNumberBlocks.push(contactID.substring(i * 6, i * 6 + 6));
  }
  const safetyNumber = safetyNumberBlocks.join(' - ');

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInnerWrapper}>
          <View style={styles.identicon}>
            <Identicon seed={contactID} contactType={contact.sync.type} />
          </View>
          <Text style={styles.contactName}>
            {contact.nickname ?? contactID.slice(0, 24)}
          </Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <DetailItem
          title="Last seen"
          value={<ConnectionStatus contact={contact} />}
        />
        <DetailItem
          title="Total messages"
          value={<Text style={styles.itemValueText}>{totalMessages}</Text>}
        />
        <DetailItem
          title="Fingerprint"
          value={
            <View style={styles.safetyNumber}>
              <Text style={styles.itemValueText}>{safetyNumber}</Text>
            </View>
          }
        />
      </View>
      <View style={styles.actionsContainer}>
        {/* <DetailsButton title="Mark as verified" /> */}
        <DetailsButton
          title="Change nickname"
          onPress={() => {
            // Alert.propt only works on iOS, add Android equivalent later
            Alert.prompt(
              'Change nickname',
              'Write a nickname for the contact',
              value => {
                let nickname: string | undefined = value;
                if (value == '') {
                  nickname = undefined;
                }
                dispatch(setNickname({contactID, nickname}));
              },
            );
          }}
        />
        <InviteSetting contactID={contactID} contactType={contact.sync.type} />
        <DetailsButton
          danger
          title="Delete contact"
          onPress={() => {
            Alert.alert(
              'Delete contact?',
              'You are about to delete this contact, are you sure?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    Starling.deleteContact(contactID);
                  },
                },
              ],
              {
                cancelable: true,
              },
            );
          }}
        />
      </View>
    </View>
  );
}

const createStyles = stylesBuilder(({theme}) => ({
  container: {},
  profileInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  identicon: {
    width: 72,
    height: 72,
  },
  contactName: {
    color: theme.colors.text,
    fontSize: 18,
  },
  detailsContainer: {
    marginTop: 40,
    gap: 10,
    marginHorizontal: 20,
  },
  actionsContainer: {
    marginTop: 40,
    marginHorizontal: 20,
  },
  detailsItemContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsItemTitle: {
    color: theme.colors.text,
    fontWeight: 'bold',
    width: 140,
    textAlign: 'right',
  },
  itemValueText: {
    color: theme.colors.text,
  },
  safetyNumber: {
    flexDirection: 'row',
    width: 200,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
}));

export default ContactSettings;
