export type ContactID = string;
export type NodePublicKey = string;
export type Version = number | string;

export type SyncMessage = {
  value: string;
  sig: string;
  attached_secret?: string;
};

export type SyncDigest = {
  nodes: {
    [key: NodePublicKey]: number;
  };
  max_version: number;
};

export type SyncModelType = 'link' | 'group';

export type SyncModel = {
  digests: {
    [key: NodePublicKey]: SyncDigest;
  };
  public_key: NodePublicKey;
  node_states: {
    [key: NodePublicKey]: {
      [key: Version]: SyncMessage;
    };
  };
  type: SyncModelType;
};

// export type SyncState = {
//   [key: ContactID]: SyncModel;
// };
