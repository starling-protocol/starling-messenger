import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from './store';
import registerNativeEvents from './nativeEvents';
import registerAppLinks from './appLinks';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import Navigation from './components/Navigation';
import {useColorScheme} from 'react-native';

function App(): JSX.Element {
  const scheme = useColorScheme();
  useEffect(registerNativeEvents, []);
  useEffect(registerAppLinks, []);

  const theme: Theme =
    scheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: '#5984C8',
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: '#5984C8',
            background: '#fff',
          },
        };

  return (
    <Provider store={store}>
      <NavigationContainer theme={theme}>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
