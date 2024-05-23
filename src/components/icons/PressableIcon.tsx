import React, {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

export type IconProps = {
  color: string;
};

type PressableIconProps = {
  icon(props: IconProps): JSX.Element;
} & TouchableOpacityProps;

function PressableIcon({
  icon: Icon,
  ...touchableProps
}: PressableIconProps): JSX.Element {
  return (
    <TouchableOpacity {...touchableProps}>
      <View style={styles.container}>
        <Icon color="#5984C8" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default PressableIcon;
