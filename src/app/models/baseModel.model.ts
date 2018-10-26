export enum ModelStatus {
  READY = 'ready',
  PENDING = 'pending',
  ERROR = 'error',
}

export interface Meta {
  status: ModelStatus;
  error?: Error;
}

export interface BaseModel {
  _meta?: Meta;
}
