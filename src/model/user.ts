import { v4 as uuidv4 } from 'uuid';

export type UserStatus =
  'idle' |
  'typing'

export class User {
  owner: boolean
  viewOnly: boolean
  name: string
  status: UserStatus
  id: string

  constructor(owner: boolean, viewOnly: boolean, name: string, status: UserStatus) {
    this.id = uuidv4();
    this.owner = owner;
    this.viewOnly = viewOnly;
    this.name = name;
    this.status = status;
  }
}