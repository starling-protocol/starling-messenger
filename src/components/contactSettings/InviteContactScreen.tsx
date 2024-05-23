import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {connectionsSelector} from '../../state/selectors';
import DetailsButton from './DetailsButton';
import {sendMessage} from 'react-native-starling';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackParamList} from '../Navigation';
import {RootState} from '../../store';

type LinkInviteProps = {
  contactID: string;
};

function LinkInvite({contactID}: LinkInviteProps): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const groups = useSelector(connectionsSelector('group'));
  const contacts = useSelector((state: RootState) => state.protocol.contacts);

  const invites = groups.map(groupID => (
    <DetailsButton
      key={groupID}
      title={contacts[groupID].nickname ?? groupID.slice(0, 24)}
      identicon={{
        seed: groupID,
        contactType: 'group',
      }}
      onPress={() => {
        const body = JSON.stringify({
          value: 'Group invitation',
          timestamp: new Date().toISOString(),
        });
        sendMessage(contactID, body, groupID);

        // go back twice to the contact screen
        navigation.goBack();
        navigation.goBack();
      }}
    />
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Invite '{contacts[contactID].nickname ?? contactID.slice(0, 24)}' to
        group
      </Text>
      <View style={styles.invitesWrapper}>{invites}</View>
    </View>
  );
}

type GroupInviteProps = {
  groupID: string;
};

function GroupInvite({groupID}: GroupInviteProps): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const links = useSelector(connectionsSelector('link'));
  const groups = useSelector(connectionsSelector('group'));
  const contacts = useSelector((state: RootState) => state.protocol.contacts);

  const invites = links
    .concat(groups)
    .filter(id => id != groupID)
    .map(contactID => (
      <DetailsButton
        key={contactID}
        title={contacts[contactID].nickname ?? contactID.slice(0, 24)}
        identicon={{
          seed: contactID,
          contactType: contacts[contactID].sync.type,
        }}
        onPress={() => {
          const body = JSON.stringify({
            value: 'Group invitation',
            timestamp: new Date().toISOString(),
          });
          sendMessage(contactID, body, groupID);

          // go back twice to the contact screen
          navigation.goBack();
          navigation.goBack();
        }}
      />
    ));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Invite members to '{contacts[groupID].nickname ?? groupID.slice(0, 24)}'
      </Text>
      <View style={styles.invitesWrapper}>{invites}</View>
    </View>
  );
}

function InviteContactScreen(): JSX.Element {
  const {id: contactID, contactType} =
    useRoute<RouteProp<StackParamList, 'InviteContact'>>().params;

  return contactType === 'link' ? (
    <LinkInvite contactID={contactID} />
  ) : (
    <GroupInvite groupID={contactID} />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  invitesWrapper: {
    marginTop: 40,
    gap: 10,
  },
});

export default InviteContactScreen;
