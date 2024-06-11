import { describe, expect, test } from 'vitest';
import { filterUniqueByKey } from './filter-unique-by-key';

const array1 = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

const array2 = [
  { id: 2, name: 'Bob' },
  { id: 4, name: 'David' },
];

describe('filterUniqueByKey()', () => {
  test('should return items from array1 that do not have matching keys in array2', () => {
    const result = filterUniqueByKey(array1, array2, 'id');
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 3, name: 'Charlie' },
    ]);
  });

  test('should return an empty array if all items in array1 have matching keys in array2', () => {
    const result = filterUniqueByKey(array1, array2.concat({ id: 1, name: 'Alice' }, { id: 3, name: 'Charlie' }), 'id');
    expect(result).toEqual([]);
  });

  test('should return the full array1 if no items in array1 have matching keys in array2', () => {
    const result = filterUniqueByKey(array1, [], 'id');
    expect(result).toEqual(array1);
  });

  test('should work with different key types', () => {
    const array1WithStrings = [
      { username: 'user1', age: 25 },
      { username: 'user2', age: 30 },
      { username: 'user3', age: 35 },
    ];
    const array2WithStrings = [
      { username: 'user2', age: 30 },
      { username: 'user4', age: 40 },
    ];
    const result = filterUniqueByKey(array1WithStrings, array2WithStrings, 'username');
    expect(result).toEqual([
      { username: 'user1', age: 25 },
      { username: 'user3', age: 35 },
    ]);
  });
});
