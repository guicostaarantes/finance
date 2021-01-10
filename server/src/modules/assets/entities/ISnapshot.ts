export interface ISnapshot {
  id: string;
  user_id: string;
  date: number;
}

export interface ICreateSnapshotInput {
  date: number;
}

export interface ICreateSnapshotData {
  user_id: string;
  date: number;
}
