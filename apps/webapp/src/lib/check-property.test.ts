import { describe, expect, test } from 'vitest';
import { checkProperty } from './check-property';

describe('check-property()', () => {
  test('object with "exist" key return true', () => {
    const trueObject = { exist: true };
    expect(checkProperty(trueObject, 'exist')).toBeTruthy();
  });

  test('object withouth "exist" key return false', () => {
    const fasleObject = { notExist: true };
    expect(checkProperty(fasleObject, 'exist')).toBeFalsy();
  });

  test('empty object return false', () => {
    const emptyObject = {};
    expect(checkProperty(emptyObject, 'exist')).toBeFalsy();
  });

  test('array return false', () => {
    const array = [] as unknown;
    expect(checkProperty(array, 'exist')).toBeFalsy();
  });

  test('string return false', () => {
    const str = '';
    expect(checkProperty(str, 'exist')).toBeFalsy();
  });

  test('number return false', () => {
    const number = 1;
    expect(checkProperty(number, 'exist')).toBeFalsy();
  });

  test('undefined return false', () => {
    expect(checkProperty(undefined, 'exist')).toBeFalsy();
  });

  test('null return false', () => {
    expect(checkProperty(null, 'exist')).toBeFalsy();
  });
});
