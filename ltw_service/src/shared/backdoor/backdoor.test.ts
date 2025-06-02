import {Backdoor} from "./backdoor";


describe('Backdoor', () => {
    const enable = '1';
    const notEnable = '0';
    const production = '1';
    const notProduction = '0';

    test('backdoor ok if enable and not production', () => {
        expect(new Backdoor(enable, notProduction)).toBeTruthy();
    });

    test('backdoor is not ok if enable and production', () => {
        expect(() => new Backdoor(enable, production)).toThrow();
    });

    test('backdoor is not ok if not enable and not production', () => {
        expect(() => new Backdoor(notEnable, notProduction)).toThrow();
    });

    test('backdoor is not ok if not enable and production', () => {
        expect(() => new Backdoor(notEnable, production)).toThrow();
    });

    test('backdoor is not ok on out values', () => {
        expect(() => new Backdoor(enable, '3')).toThrow();
        expect(() => new Backdoor(enable, '-1')).toThrow();
        expect(() => new Backdoor('22', notProduction)).toThrow();
        expect(() => new Backdoor('-1', notProduction)).toThrow();
    });
});