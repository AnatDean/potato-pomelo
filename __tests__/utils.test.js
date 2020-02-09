const { makeRefObject } = require('../utils/index');

describe('makeRefObject', () => {
  test('returns an empty object if passed an empty array and empty object', () => {
    expect(makeRefObject([], {})).toEqual({});
  });
  test('given an array with one item which contains the provided key value pair will key object by key property', () => {
    // iteratee logic
    const testInput = [{ a: 'x', b: 'y' }];
    const keyValues = { key: 'a', value: 'b' };
    expect(makeRefObject(testInput, keyValues)).toEqual({ x: 'y' });
  });
  test("returns message if required keys aren't in input array item", () => {
    // iteratee logic
    let testInput = [{ a: 'x', b: 'y' }];
    let keyValues = { key: 'j', value: 'b' };
    expect(makeRefObject(testInput, keyValues)).toEqual({ j: 'Missing key' });

    testInput = [{ a: 'x', b: 'y' }];
    keyValues = { key: 'a', value: 'j' };
    expect(makeRefObject(testInput, keyValues)).toEqual({ x: 'Missing value' });
  });
  test('can apply iteratee logic to an array of multiple items - assuming key value pairs are okay', () => {
    const testInput = [
      { a: 'x', b: 'y' },
      { a: 'hello', b: 'goodbye' }
    ];
    const keyValues = { key: 'a', value: 'b' };
    expect(makeRefObject(testInput, keyValues)).toEqual({
      x: 'y',
      hello: 'goodbye'
    });
  });
  test("will make all key value pairs it can and provide error messages for any it can't", () => {
    const testInput = [
      { a: 'x', b: 'y' },
      { a: 'hello', c: 'goodbye' }
    ];
    const keyValues = { key: 'a', value: 'b' };
    expect(makeRefObject(testInput, keyValues)).toEqual({
      x: 'y',
      hello: 'Missing value'
    });
  });
});
