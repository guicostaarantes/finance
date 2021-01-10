export interface IErrorProvider {
  throw: (message: string, code: string) => void;
}
