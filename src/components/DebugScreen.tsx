import React from 'react';
import {
  Button,
  FlatList,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import {DebugLog, clearLogs} from '../state/debug/debugSlice';
import {deletePersistedState} from 'react-native-starling';

function DebugScreen(): JSX.Element {
  const dispatch = useDispatch();
  // const syncState = useSelector((state: RootState) => state.sync);
  const logs = useSelector((state: RootState) => state.debug.logs);

  const listItems: DebugLog[] = [];
  // listItems.push(syncState);
  listItems.push(...logs);

  return (
    <View style={styles.container}>
      <View key="share" style={{...styles.buttonContainer}}>
        <View style={styles.debugButton}>
          <Button
            title="Share logs"
            onPress={() => {
              const logText = logs
                .map(
                  log =>
                    `${new Date(log.timestamp).toISOString()}: [${log.tag}] ${
                      log.body
                    }`,
                )
                .join('\n');
              Share.share({message: logText});
            }}
          />
        </View>
        <View style={styles.debugButton}>
          <Button
            title="Clear logs"
            onPress={() => {
              dispatch(clearLogs());
            }}
          />
        </View>
        <View style={styles.debugButton}>
          <Button
            title="Reset app"
            onPress={() => {
              deletePersistedState();
            }}
          />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View>
          <FlatList<DebugLog>
            contentContainerStyle={styles.list}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={listItems}
            keyExtractor={(_, i) => `${i}`}
            renderItem={({item}) => {
              // if (index == 0) {
              //   const state = item as SyncState;
              //   return <Text>{JSON.stringify(state, null, 2)}</Text>;
              // } else {
              const log = item as DebugLog;

              return (
                <Text
                  style={{
                    ...styles.logText,
                    color: log.tag.startsWith('DEBUG') ? '#888' : '#000',
                  }}
                  numberOfLines={1}>
                  {`${new Date(log.timestamp).toLocaleString()}: [${
                    log.tag
                  }] ${log.body}`}
                </Text>
              );
              // }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 200,
  },
  title: {
    fontSize: 24,
  },
  logText: {
    textAlign: 'left',
    flexShrink: 0,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
  },
  debugButton: {
    flexShrink: 1,
  },
});

export default DebugScreen;
