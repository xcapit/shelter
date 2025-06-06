import {User} from "./user";

export class NullUser implements User {

  private _ERROR_MSG = 'Null user cannot respond.';

  role(): string {
    throw new Error(this._ERROR_MSG);
  }

  username(): string {
    throw new Error(this._ERROR_MSG);
  }

  hashedPassword(): string {
    throw new Error(this._ERROR_MSG);
  }

  jwtOf(aPassword: string): string {
    throw new Error(this._ERROR_MSG);
  }

  async ifActiveDo<T>(action: () => Promise<T>): Promise<T> {
    throw new Error("Null user cannot do this action");
  }

  active(): boolean {
    throw new Error(this._ERROR_MSG);
  }
}
