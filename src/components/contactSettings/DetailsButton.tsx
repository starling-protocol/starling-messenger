import React from 'react';
import {
  Platform,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Identicon, {IdenticonProps} from '../Identicon';
import stylesBuilder from '../../stylesBuilder';

type DetailsButtonProps = {
  identicon?: IdenticonProps;
  title: string;
  danger?: boolean;
} & PressableProps;

function DetailsButton({
  title,
  danger,
  identicon: identiconProps,
  ...pressableProps
}: DetailsButtonProps): JSX.Element {
  const styles = createStyles(
    danger ?? false,
    !!identiconProps,
    pressableProps,
  )();

  let identicon = null;
  if (identiconProps) {
    identicon = (
      <View style={styles.identicon}>
        <Identicon {...identiconProps} />
      </View>
    );
  }

  return (
    <Pressable
      style={styles.container}
      {...pressableProps}
      hitSlop={10}
      android_ripple={{color: danger ? '#9E3131' : '#5984C8'}}>
      {identicon}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const createStyles = (
  danger: boolean,
  hasIcon: boolean,
  button: PressableProps,
) =>
  stylesBuilder(({theme}) => ({
    container: {
      flexDirection: hasIcon ? 'row' : 'column',
      gap: 10,
      alignItems: 'center',
      backgroundColor: danger ? '#C94C4C' : '#EFF5FC',
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: danger ? '#9E3131' : theme.colors.primary,
      borderRadius: 6,
      shadowColor: '#2A4F79',
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    text: {
      textAlign: hasIcon ? 'left' : 'center',
      color: danger ? '#fff' : theme.colors.primary,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    identicon: {
      height: 32,
      width: 32,
    },
  }));

export default DetailsButton;
