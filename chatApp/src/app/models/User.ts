import { UserInterface } from './user.model';

export class User implements UserInterface {
  constructor(
    public id,
    public username,
    public password,
    public email,
    public roles,
    public groups
  ) {}
}
