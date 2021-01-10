export interface ISnapshot {
  id: string;
  user_id: string;
  name: string;
  date: number;
}

export interface ICreateSnapshotInput {
  name: string;
  date: number;
}

export interface ICreateSnapshotData {
  user_id: string;
  name: string;
  date: number;
}
