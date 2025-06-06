import {HashedPassword} from "../hashed-password/hashed-password";
import {JWT} from "../jwt/jwt";
import {Email} from "../email/email";
import {User} from "./user";
import { Role } from "../role/role";

export class DefaultUser implements User {

  constructor(
    private _anUserRole: Role,
    private _anEmail: Email,
    private _aHashedPassword: HashedPassword,
    private _active: boolean
  ) {}

  async ifActiveDo<T>(action: () => Promise<T>): Promise<T> {
    this._validateActive();
    return await action();
  }

  active(): boolean {
    return this._active;
  }

  role(): string {
    return `${this._anUserRole}`
  }

  username(): string {
    return `${this._anEmail}`
  }

  hashedPassword(): string {
    return `${this._aHashedPassword}`;
  }

  jwtOf(aPassword: string): string {
    this._validateActive();
    this._validate(aPassword);
    return `${new JWT(this.username())}`;
  }

  private _validateActive() {
    if (!this._active) {
      throw new Error("User is not active.");
    }
  }

  private _validate(aPassword: string) {
    this._aHashedPassword.validate(aPassword);
  }
}
