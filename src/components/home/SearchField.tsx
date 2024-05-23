import React from 'react';
import {View, TextInput} from 'react-native';
import InputStyles from '../styles/InputStyles';
import stylesBuilder from '../../stylesBuilder';

function SearchField(): JSX.Element {
  const styles = createStyles();

  return (
    <View style={styles.searchWrapper}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        hitSlop={{
          bottom: 10,
          left: 10,
          right: 10,
          top: 10,
        }}
      />
    </View>
  );
}

const createStyles = stylesBuilder(params => ({
  searchWrapper: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchInput: InputStyles(params).textStyle,
}));

export default SearchField;
