import React, {useEffect, useRef} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import stylesBuilder from '../../stylesBuilder';
import LinkIcon from './LinkIcon';
import NetworkIcon from './NetworkIcon';
import DetailsButton from '../contactSettings/DetailsButton';
import {useNavigation} from '@react-navigation/native';
import persistence, {PersistenceKey} from '../../persistence';

type WelcomePageProps = {
  children: JSX.Element | JSX.Element[];
  scrollRef: React.RefObject<ScrollView>;
  index: number;
  lastScreen?: boolean;
};

function WelcomePage({
  children,
  scrollRef,
  index,
  lastScreen = false,
}: WelcomePageProps): JSX.Element {
  const navigation = useNavigation();
  const styles = createStyles();
  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    return () => {
      persistence.set(PersistenceKey.WELCOME_DISMISSED, true);
    };
  });

  return (
    <View style={{...styles.welcomeContainer, width, height}}>
      <View style={styles.welcomeContents}>{children}</View>
      <View style={styles.nextButton}>
        {lastScreen ? (
          <DetailsButton
            title="Get started"
            onPress={() => {
              navigation.goBack();
            }}
          />
        ) : (
          <DetailsButton
            title="Continue"
            onPress={() => {
              scrollRef.current?.scrollTo({x: (index + 1) * width});
            }}
          />
        )}
      </View>
    </View>
  );
}

function Title({children}: {children: string}): JSX.Element {
  const styles = createStyles();

  return <Text style={styles.title}>{children}</Text>;
}

function Paragraph({children}: {children: string}): JSX.Element {
  const styles = createStyles();

  return <Text style={styles.paragraph}>{children}</Text>;
}

function WelcomeScreen(): JSX.Element {
  const styles = createStyles();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView ref={scrollRef} horizontal={true} pagingEnabled={true}>
      <WelcomePage scrollRef={scrollRef} index={0}>
        <Title>Welcome to Starling</Title>
        <Paragraph>Starling is an off-the-grid messenger app.</Paragraph>
      </WelcomePage>
      <WelcomePage scrollRef={scrollRef} index={1}>
        <Title>Link devices</Title>
        <Paragraph>Scan QR codes to become contacts</Paragraph>
        <View style={styles.iconWrapper}>
          <LinkIcon />
        </View>
        <Paragraph>
          1. One user clicks the "Create Link" button which shows a QR code.
        </Paragraph>
        <Paragraph>
          2. The other user scans the QR code and opens the link in the app. A
          new QR code will automatically show up when the link is opened.
        </Paragraph>
        <Paragraph>
          3. Lastly, the first user scans the new QR code and opens the link in
          the app. Now both users have scanned each others QR codes and a new
          concat with the same name should have been created.
        </Paragraph>
      </WelcomePage>
      <WelcomePage scrollRef={scrollRef} index={2}>
        <Title>Connect to network</Title>
        <Paragraph>
          When connected to the network, your phone communicates directly with
          nearby devices.
        </Paragraph>
        <Paragraph>
          Everyone helps to forward others encrypted messages, but only the
          recipient can read it. The network becomes stronger the more people
          who use it nearby.
        </Paragraph>
        <View style={styles.iconWrapper}>
          <NetworkIcon />
        </View>
        <Paragraph>
          Click on the switch at the bottom of the screen to connect.
        </Paragraph>
      </WelcomePage>
      <WelcomePage scrollRef={scrollRef} index={3}>
        <Title>Send messages</Title>
        <Paragraph>
          If a contact is reachable on the network, you will automatically
          establish a session and you can send encrypted messages to each other.
        </Paragraph>
        <Paragraph>
          If a message is sent to a contact that is too far away, the message
          will simply be saved until the contacts becomes reachable at a later
          point.
        </Paragraph>
      </WelcomePage>
      <WelcomePage scrollRef={scrollRef} index={4} lastScreen={true}>
        <Title>Form groups</Title>
        <Paragraph>
          Users can create group chats such that everyone in the group can read
          the messages.
        </Paragraph>
        <Paragraph>
          Everyone in the group helps to deliver all the group messages to
          everyone else in the group.
        </Paragraph>
      </WelcomePage>
    </ScrollView>
  );
}

const createStyles = stylesBuilder(({theme}) => ({
  welcomeContainer: {
    padding: 20,
  },
  welcomeContents: {
    // flexGrow: 1,
  },
  nextButton: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 6,
    color: theme.colors.text,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 6,
    color: theme.colors.text,
  },
  iconWrapper: {
    height: 300,
    padding: 20,
  },
}));

export default WelcomeScreen;
