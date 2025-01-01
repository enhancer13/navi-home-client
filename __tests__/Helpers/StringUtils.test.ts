import {snakeToPascal} from '../../src/Helpers/StringUtils';

describe('snakeToPascal', () => {
    it('converts snake case to start case', () => {
        expect(snakeToPascal('NO_BORDERS')).toEqual('No Borders');
        expect(snakeToPascal('THIS_IS_A_TEST')).toEqual('This Is A Test');
    });

    it('converts uppercase strings to start case', () => {
        expect(snakeToPascal('BORDERS')).toEqual('Borders');
    });

    it('leaves other formats unchanged', () => {
        expect(snakeToPascal('H264')).toEqual('H264');
        expect(snakeToPascal('High 4.0')).toEqual('High 4.0');
        expect(snakeToPascal('normal string')).toEqual('normal string');
    });
});
