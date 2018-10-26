 import { BaseModel } from './baseModel.model';

export interface User extends BaseModel {
  id?: number;
  name: string;
  lastName: string;
  age: number;
}
