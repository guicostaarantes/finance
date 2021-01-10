export interface ICondition {
  field: string;
  compare: "=" | "<>" | ">" | ">=" | "<" | "<=";
  value: string | number;
}

export interface IDatabaseProvider {
  findOne: <T>(table: string, conditions: ICondition[]) => T;
  findMany: <T>(table: string, conditions: ICondition[]) => T[];
  insertOne: <T>(table: string, data: T) => void;
  updateOne: <T>(table: string, conditions: ICondition[], data: T) => void;
  deleteOne: (table: string, conditions: ICondition[]) => void;
}
