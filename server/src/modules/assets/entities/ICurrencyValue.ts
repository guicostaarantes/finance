export interface ICurrencyValue {
  id: string;
  snapshot_id: string;
  currency_id: string;
  value: number;
}

export interface ICreateCurrencyValueInput {
  snapshot_id: string;
  currency_id: string;
  value: number;
}

export interface ICreateCurrencyValueData {
  snapshot_id: string;
  currency_id: string;
  value: number;
}
