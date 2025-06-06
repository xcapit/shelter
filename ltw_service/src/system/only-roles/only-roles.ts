import { Request, Response, NextFunction } from 'express';
import { Users } from "../../users/models/users/users";
import { AuthorizedRequestOf } from "../authorized-request/authorized-request-of";

export class OnlyRoles {
  constructor(
    private readonly _users: Users,
    private readonly _anAllowedRole: string | string[],
  ) {}
  allowedRole() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authReq = new AuthorizedRequestOf(req);
        const username = authReq.username();
        const user = await this._users.findOneBy(username);
        if (!this._anAllowedRole.includes(user.role())) {
          return res
            .status(403)
            .json({ error: 'Access denied: insufficient role' });
        }
        next();
      } catch (err: any) {
        console.log('OnlyRoles Error: ', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    };
  }
}
