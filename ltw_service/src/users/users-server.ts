import {Express, NextFunction, Request, Response} from "express";
import {Users} from "./models/users/users";
import {Credentials} from "./models/credentials/credentials";
import {Email} from "./models/email/email";
import {Password} from "./models/password/password";
import {Backdoor} from "../shared/backdoor/backdoor";
import {DefaultUser} from "./models/user/default-user";
import {HashedPassword} from "./models/hashed-password/hashed-password";
import {ServerSystem} from "../system/server-system";
import { Role } from "./models/role/role";
import { AuthorizedRequestOf } from "../system/authorized-request/authorized-request-of";
import { OnlyRoles } from "../system/only-roles/only-roles";

export class UsersServer extends ServerSystem {

  constructor(private _aServer: Express, private _users: Users) {
    super();
  }

  register() {
    this._aServer.post('/api/users/setup-admin', (req, res, next) => this._setupInitialAdmin(req, res, next));
    this._aServer.post('/api/users/login', (req, res, next) => this._loginAnUser(req, res, next));
    this._aServer.post('/api/users/register', new OnlyRoles(this._users, 'Admin').allowedRole(),
      (req, res, next) => this._registerUser(new AuthorizedRequestOf(req), res, next));
  }

  private async _loginAnUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.executeAction(async () => ({
      token: await new Credentials(
        new Email(req.body?.email),
        new Password(req.body?.password)
      ).jwt()
    }), res, next);
  }

  private async _registerUser(req: AuthorizedRequestOf, res: Response, next: NextFunction): Promise<void> {
    await super.executeAction(async () => {
      return await (await this._users.findOneBy(req.username())).ifActiveDo<string>(async () => {
        await this._users.save(
          new DefaultUser(
            new Role(req.body().role),
            new Email(req.body().email),
            new HashedPassword(
              new Password(req.body().password).hash()
            ),
            true
          )
        );
        return 'User created successfully!';
      })
    }, res, next);
  }

  private async _setupInitialAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    await super.executeAction(async () => {
      new Backdoor();
      await this._users.save(
        new DefaultUser(
          new Role(req.body?.role),
          new Email(req.body?.email),
          new HashedPassword(
            new Password(req.body?.password).hash()
          ),
          true
        )
      );
      return 'User created successfully!';
    }, res, next);
  }
}
