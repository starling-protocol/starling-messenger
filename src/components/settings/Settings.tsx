import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {Button, StyleSheet, View} from 'react-native';
import {newGroup} from 'react-native-starling';
import log from '../../logger';
import {StackParamList} from '../Navigation';
import {contactCreated} from '../../appLinks';
import DetailsButton from '../contactSettings/DetailsButton';

function Settings(): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  return (
    <View style={styles.container}>
      <DetailsButton
        title="New group"
        onPress={() => {
          newGroup()
            .then(contactID => {
              contactCreated(contactID);
            })
            .catch(err => log(`failed to create new group: ${err}`));
          navigation.goBack();
        }}
      />
      <DetailsButton
        title="Show welcome screen"
        onPress={() => {
          navigation.navigate('Welcome');
        }}
      />
      <DetailsButton
        title="Debug"
        onPress={() => {
          navigation.navigate('Debug');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 40,
    marginHorizontal: 20,
  },
});

export default Settings;
