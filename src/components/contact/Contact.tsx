import {useHeaderHeight} from '@react-navigation/elements';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import hapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sendMessage} from 'react-native-starling';
import {useDispatch, useSelector} from 'react-redux';
import {
  Contact as ContactType,
  changeInputText,
} from '../../state/protocol/protocolSlice';
import {RootState} from '../../store';
import {StackParamList} from '../Navigation';
import Message from './Message';
import MessageInput from './MessageInput';
import {syncModelMessages} from '../../state/protocol/messages';

export type ContactProps = NativeStackScreenProps<StackParamList, 'Contact'>;

function Contact(): JSX.Element {
  const scrollRef = useRef<ScrollView | null>();

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<StackParamList, 'Contact'>>();
  const params = useRoute<RouteProp<StackParamList, 'Contact'>>().params;
  const headerHeight = useHeaderHeight();
  const styles = createStyles(insets);

  const contactID = params.id;

  const stateContact: ContactType | undefined = useSelector(
    (state: RootState) => state.protocol.contacts[contactID],
  );

  if (!stateContact) {
    navigation.goBack();
    return <View />;
  }

  const messages = syncModelMessages(stateContact.sync).map(msg => (
    <Message
      key={`${msg.public_key}_${msg.version}`}
      contactID={contactID}
      contact={stateContact}
      msg={msg}
    />
  ));

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight}
      style={styles.container}
      behavior="padding">
      <ScrollView
        ref={ref => {
          scrollRef.current = ref;
        }}
        onLayout={() => {
          scrollRef.current?.scrollToEnd({animated: false});
        }}
        style={styles.scrollView}
        scrollsToTop={false}
        contentInsetAdjustmentBehavior="automatic">
        <View>{messages}</View>
      </ScrollView>
      <MessageInput
        value={stateContact.inputText}
        onChangeText={text =>
          dispatch(changeInputText({contactID, value: text}))
        }
        onSubmitEditing={() => {
          if (stateContact.inputText === '') return;
          const body = JSON.stringify({
            value: stateContact.inputText,
            timestamp: new Date().toISOString(),
          });
          sendMessage(contactID, body, null);
          dispatch(changeInputText({contactID, value: ''}));
          hapticFeedback.trigger(HapticFeedbackTypes.impactMedium);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const createStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: Platform.OS === 'android' ? 20 : insets.bottom,
    },
    scrollView: {
      paddingTop: 20,
    },
  });

export default Contact;
