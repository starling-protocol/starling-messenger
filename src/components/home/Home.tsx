import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Platform, RefreshControl, ScrollView, Text, View} from 'react-native';
import {broadcastRouteRequest} from 'react-native-starling';
import {useDispatch} from 'react-redux';
import {startLink} from '../../appLinks';
import stylesBuilder from '../../stylesBuilder';
import {StackParamList} from '../Navigation';
import IconContactAdd from '../icons/IconContactAdd';
import IconSettings from '../icons/IconSettings';
import PressableIcon from '../icons/PressableIcon';
import ContactList from './ContactList';
import SearchField from './SearchField';
import StatusFooter from './StatusFooter';

export type HomeProps = NativeStackScreenProps<StackParamList, 'Home'>;

type HomeHeaderProps = {
  navigation: NavigationProp<StackParamList>;
};

export function HomeHeader({navigation}: HomeHeaderProps): JSX.Element {
  const styles = createStyles();
  const dispatch = useDispatch();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.topLogo}>STARLING</Text>
      <PressableIcon
        icon={IconContactAdd}
        onPress={() => startLink(dispatch)}
      />
      <PressableIcon
        icon={IconSettings}
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

function Home(): JSX.Element {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    broadcastRouteRequest();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="Broadcast route request"
          />
        }>
        <SearchField />
        <ContactList />
      </ScrollView>
      <StatusFooter />
    </View>
  );
}

const createStyles = stylesBuilder(({theme}) => ({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: Platform.OS == 'android' ? 20 : 0,
    // marginHorizontal: 20,
    marginRight: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topLogo: {
    color: theme.colors.text,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    flexGrow: 1,
    paddingLeft: 80,
  },
  headerButtons: {
    position: 'absolute',
    left: 50,
  },
}));

export default Home;
