import {StyleSheet} from 'react-native';
import {StylesParams} from '../../stylesBuilder';

export default ({theme}: StylesParams) =>
  StyleSheet.create({
    textStyle: {
      color: theme.colors.text,
      height: 42,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.dark ? '#555' : '#ccc',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      elevation: 4,
      marginBottom: 10,
    },
  });
