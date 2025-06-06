import {UsersDataRepo} from "../users-data-repo/users-data-repo";
import {DefaultUser} from "../user/default-user";
import {HashedPassword} from "../hashed-password/hashed-password";
import {Email} from "../email/email";
import {User} from "../user/user";
import {NullUser} from "../user/null-user";

export class Users {
    constructor(private _aDataRepo: UsersDataRepo = new UsersDataRepo()) {}

    async save(aUser: User): Promise<void> {
        return this._aDataRepo.save(aUser);
    }

    async findOneBy(anEmail: string): Promise<User> {
        const user = await this._aDataRepo.findOneBy(anEmail);
        return user ?
          new DefaultUser(
            user.role,
            new Email(user.username),
            new HashedPassword(user.password),
            user.active
          ) :
          new NullUser();
    }
}
