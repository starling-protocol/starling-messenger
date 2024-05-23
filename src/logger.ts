import {appendLog} from './state/debug/debugSlice';
import {store} from './store';

function log(message: string) {
  console.log(message);
  store.dispatch(appendLog({tag: 'JS', body: message}));
}

export default log;
