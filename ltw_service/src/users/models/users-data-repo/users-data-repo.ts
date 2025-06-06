import {Model} from "mongoose";
import {UsersModel} from "../../../db/mongo/users.model";
import {User} from "../user/user";

export class UsersDataRepo {

  constructor(private _aModel: Model<any> = UsersModel) {}

  save(user: User): Promise<void> {
    return this._aModel.create({
      role: user.role(),
      username: user.username(),
      password: user.hashedPassword(),
      active: user.active(),
    });
  }

  findOneBy(anEmail: string): Promise<any> {
    return this._aModel.findOne({username: anEmail}).lean();
  }
}
