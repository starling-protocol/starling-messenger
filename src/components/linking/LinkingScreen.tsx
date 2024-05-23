import React, {useCallback, useEffect} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {stopLinking as stopLinkingAction} from '../../state/linking/linkingSlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import {StackParamList} from '../Navigation';
import stylesBuilder from '../../stylesBuilder';

function LinkingScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const dispatch = useDispatch();

  const styles = createStyles();

  const sessionURL = useSelector(
    (state: RootState) => state.linking.sessionURL,
  );

  const stopLinking = useCallback(() => {
    dispatch(stopLinkingAction());
  }, [dispatch]);

  useEffect(() => {
    if (sessionURL === undefined) {
      navigation.goBack();
    }
  });

  useEffect(() => {
    return () => {
      stopLinking();
    };
  }, [stopLinking]);

  let qrCode = <Text>Generating QR code</Text>;
  if (sessionURL) {
    qrCode = <QRCode value={sessionURL} size={250} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.qrWrapper}>{qrCode}</View>
        <View style={styles.qrCaption}>
          <Text>Scan QR code with the Camera app</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.descriptionContainer}>
          <Text style={{...styles.descriptionText, fontStyle: 'italic'}}>
            The linking process is to be improved in the future.
          </Text>
          <Text style={styles.descriptionText}>
            1. Person A opens the linking screen (this screen), It is important
            that person B does not also have the linking screen open.
          </Text>
          <Text style={styles.descriptionText}>
            2. Person B now scans the QR code shown on Person A's phone, using
            the Camera app. When scanned the linking screen should automatically
            appear on person B's phone. Now both A and B should see a QR code on
            their screen.
          </Text>
          <Text style={styles.descriptionText}>
            3. Without closing the linking screen, person A opens the Camera app
            and scans person B's QR code. When scanned, the linking screen
            should automatically be dismissed on person A's device, and a new
            contact should appear. Person B can now manually dismiss the linking
            screen and see a contact with the same icon and name.
          </Text>
        </View>
        <View style={styles.spacer} />
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Stop linking" onPress={stopLinking} />
      </View>
    </SafeAreaView>
  );
}

const createStyles = stylesBuilder(({theme}) => ({
  container: {
    height: '100%',
  },
  qrWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrCaption: {
    color: theme.colors.text,
    alignItems: 'center',
  },
  separator: {
    margin: 20,
    height: 0.5,
    backgroundColor: '#aaa',
  },
  spacer: {
    flexGrow: 1,
    minHeight: 40,
  },
  descriptionContainer: {
    marginHorizontal: 20,
  },
  descriptionText: {
    color: theme.colors.text,
    marginBottom: 6,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
  },
}));

export default LinkingScreen;
