import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PasswordInterface {
  id?: string;
  password: string;
  length: number;
  complexity: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PasswordGetQueryInterface extends GetQueryInterface {
  id?: string;
  password?: string;
  complexity?: string;
  user_id?: string;
}
