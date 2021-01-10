export interface ISnapshot {
  id: string;
  userId: string;
  date: number;
}

export interface ICreateSnapshotInput {
  date: number;
}

export interface ICreateSnapshotData {
  userId: string;
  date: number;
}
