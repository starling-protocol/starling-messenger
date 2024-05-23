import React from 'react';
import {TextInput, TextInputProps, View} from 'react-native';
import InputStyles from '../styles/InputStyles';
import stylesBuilder from '../../stylesBuilder';

function MessageInput(props: TextInputProps): JSX.Element {
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.messageInput}
        placeholder="Send a message..."
        hitSlop={{
          bottom: 20,
          left: 20,
          right: 20,
          top: 20,
        }}
        {...props}
      />
    </View>
  );
}

const createStyles = stylesBuilder(params => ({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  messageInput: InputStyles(params).textStyle,
}));

export default MessageInput;
