export interface ICondition {
  field: string;
  compare: "=" | "<>" | ">" | ">=" | "<" | "<=";
  value: string | number;
}

export interface IDatabaseProvider {
  findAll: <T>(table: string) => T[];
  findOne: <T>(table: string, conditions: ICondition[]) => T;
  insertOne: <T>(table: string, data: T) => void;
  updateOne: <T>(table: string, conditions: ICondition[], data: T) => void;
  deleteOne: (table: string, conditions: ICondition[]) => void;
}
