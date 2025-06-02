import {Email} from "../email/email";
import {Password} from "../password/password";
import {Users} from "../users/users";

export class Credentials {

  constructor(
    private readonly _anEmail: Email,
    private readonly _aPassword: Password,
    private readonly _users: Users = new Users(),
  ) {}

  async jwt(): Promise<string> {
    return (await this._users.findOneBy(this._anEmail.toString())).jwtOf(this._aPassword.toString());
  }
}
