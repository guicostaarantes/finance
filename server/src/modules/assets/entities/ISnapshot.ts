export interface ISnapshot {
  id: string;
  userId: string;
  date: Date;
}

export interface ICreateSnapshotInput {
  date: Date;
}

export interface ICreateSnapshotData {
  userId: string;
  date: string;
}
