import {NodePublicKey, SyncModel, Version} from './sync';
import {decode as decodeBase64} from 'base-64';

export type Message = {
  public_key: NodePublicKey;
  version: Version;
  value: string;
  timestamp: Date;
  attached_secret?: string;
  seen_by: NodePublicKey[];
};

export function syncModelMessages(model: SyncModel): Message[] {
  const messages: Message[] = [];

  for (const nodePublicKey in model.node_states) {
    const nodeMessages = model.node_states[nodePublicKey];
    for (const version in nodeMessages) {
      const msg = nodeMessages[version];

      const data = JSON.parse(decodeBase64(msg.value));

      const seen_by = Object.keys(model.digests).filter(
        node => model.digests[node].nodes[nodePublicKey] >= Number(version),
      );

      messages.push({
        public_key: nodePublicKey,
        version: version,
        value: data.value,
        timestamp: new Date(data.timestamp),
        attached_secret: msg.attached_secret,
        seen_by,
      });
    }
  }

  return messages.sort((a, b) => {
    const versionDiff = Number(a.version) - Number(b.version);
    if (versionDiff != 0) return versionDiff;
    return a.timestamp.getTime() - b.timestamp.getTime();
  });
}
