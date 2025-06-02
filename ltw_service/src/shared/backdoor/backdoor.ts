import {number, object} from "yup";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

const { ENABLE_BACKDOOR_CMD, PRODUCTION } = process.env as { ENABLE_BACKDOOR_CMD: string, PRODUCTION: string };


export class Backdoor {

    private _rules = object({
        _enabled: number().integer().positive().required().moreThan(0).max(1),
        _production: number().integer().required().lessThan(1).min(0),
    });

    constructor(
        _enabled: string = ENABLE_BACKDOOR_CMD,
        _production: string = PRODUCTION,
    ) {
        this._rules.validateSync({_enabled, _production});
    }
}
