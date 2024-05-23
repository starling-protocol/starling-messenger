import {Theme, useTheme} from '@react-navigation/native';
import {Platform, StyleSheet} from 'react-native';

export type StylesTheme = Theme & {
  colors: {
    textSecondary: string;
  };
};

export type StylesParams = {
  theme: StylesTheme;
  platform: 'ios' | 'android' | 'windows' | 'macos' | 'web';
};

function stylesBuilder<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(styles: (params: StylesParams) => T): () => T {
  return () => {
    const navTheme = useTheme();
    const dark = navTheme.dark;

    const theme: StylesTheme = {
      ...navTheme,
      colors: {
        ...navTheme.colors,
        textSecondary: dark ? '#888' : '#606060',
      },
    };

    return StyleSheet.create(styles({theme, platform: Platform.OS}));
  };
}

export default stylesBuilder;
