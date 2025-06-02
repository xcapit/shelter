import {NextFunction, Response} from "express";

export class ServerSystem {

  async executeAction(systemAction: CallableFunction, res: Response | any, next: NextFunction): Promise<void> {
    try {
      res.send(await systemAction());
    } catch (error) {
      next(error);
    }
  }
}
