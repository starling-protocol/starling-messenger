import React, {useEffect} from 'react';
import Contact from './contact/Contact';
import HeaderTitle, {HeaderRight} from './contact/ContactHeader';
import Home, {HomeHeader} from './home/Home';
import LinkingScreen from './linking/LinkingScreen';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import DebugScreen from './DebugScreen';
import Settings from './settings/Settings';
import ContactSettings from './contactSettings/ContactSettings';
import InviteContactScreen from './contactSettings/InviteContactScreen';
import ConnectionsStatus from './connectionsStatus/ConnectionsStatus';
import WelcomeScreen from './welcome/WelcomScreen';
import {SyncModelType} from '../state/protocol/sync';
import persistence, {PersistenceKey} from '../persistence';

export type StackParamList = {
  Home: undefined;
  Contact: {id: string};
  Linking: undefined;
  Settings: undefined;
  ContactSettings: {id: string; contactType: SyncModelType};
  InviteContact: {id: string; contactType: SyncModelType};
  ConnectionsStatus: undefined;
  Debug: undefined;
  Welcome: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function Navigation(): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const sessionURL = useSelector(
    (state: RootState) => state.linking.sessionURL,
  );

  useEffect(() => {
    if (sessionURL !== undefined) {
      navigation.navigate('Linking');
    }
  }, [sessionURL, navigation]);

  useEffect(() => {
    if (!persistence.get<boolean>(PersistenceKey.WELCOME_DISMISSED, false)) {
      navigation.navigate('Welcome');
    }
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={({navigation}) => ({
          headerShadowVisible: false,
          headerTitle: () => <HomeHeader navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={({route}) => ({
          headerTransparent: false,
          headerShadowVisible: true,
          headerBackTitleVisible: false,
          headerRight: () => <HeaderRight contactID={route.params.id} />,
          headerTitle: props => <HeaderTitle contactID={props.children} />,
          title: route.params.id,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="ContactSettings"
        component={ContactSettings}
        options={({route}) => ({
          title:
            route.params.contactType === 'link'
              ? 'Contact settings'
              : 'Group settings',
          presentation: 'modal',
        })}
      />
      <Stack.Screen
        name="InviteContact"
        component={InviteContactScreen}
        options={{
          title: 'Invite contact',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Linking"
        component={LinkingScreen}
        options={{
          title: 'Link contact',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="ConnectionsStatus"
        component={ConnectionsStatus}
        options={{
          title: 'Connections',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
        options={{title: 'Debug', presentation: 'modal'}}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{title: 'Welcome to Starling', presentation: 'modal'}}
      />
    </Stack.Navigator>
  );
}

export default Navigation;
