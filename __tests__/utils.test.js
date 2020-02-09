const { makeRefObject, formatRestaurants } = require('../utils/index');

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

describe('formatRestaurants', () => {
  test('Given an empty array & empty objects will return object with restaurants and rest_type_pairs keys', () => {
    expect(
      formatRestaurants({ restaurants: [], areaRef: {}, typeRef: {} })
    ).toEqual({
      restaurants: [],
      rest_type_pairs: []
    });
  });
  describe('iteratee logic', () => {
    const exampleRestaurant = {
      area: 'area-a',
      rest_name: 'rest-a',
      types: ['bar']
    };
    test('Given 1 restaurant will remove type key and add area_id key', () => {
      const { restaurants } = formatRestaurants({
        restaurants: [exampleRestaurant],
        areaRef: {},
        typeRef: {}
      });
      const [testValue] = restaurants;
      expect(testValue).toContainAllKeys(['area_id', 'rest_name']);
      expect(testValue.rest_name).toBe('rest-a');
    });
    test('Given 1 restaurant and an area reference will place area_id value as corresponding id ', () => {
      const { restaurants } = formatRestaurants({
        restaurants: [exampleRestaurant],
        areaRef: { 'area-a': 1 },
        typeRef: { bar: 2 }
      });
      const [selectedRestaurant] = restaurants;
      expect(selectedRestaurant.area_id).toBe(1);
    });
    test('Given 1 restaurant and a type reference will place rest area /name pair in output object', () => {
      const { rest_type_pairs } = formatRestaurants({
        restaurants: [exampleRestaurant],
        areaRef: { 'area-a': 1 },
        typeRef: { bar: 2 }
      });
      const [testRestTypePair] = rest_type_pairs;
      expect(testRestTypePair).toEqual({
        'rest-a': 2
      });
    });
    test('Given 1 full restaurant, 1 area & 1 type returns fully formatted restaurants & pairs ', () => {
      const exampleRestaurant = {
        area: 'area-a',
        rest_name: 'rest-a',
        types: ['bar'],
        open_late: true,
        serves_hot_meals: false,
        website: 'www.rest-a.com'
      };
      const output = formatRestaurants({
        restaurants: [exampleRestaurant],
        areaRef: { 'area-a': 3 },
        typeRef: { bar: 1 }
      });
      expect(output).toEqual({
        restaurants: [
          {
            area_id: 3,
            rest_name: 'rest-a',
            open_late: true,
            serves_hot_meals: false,
            website: 'www.rest-a.com'
          }
        ],
        rest_type_pairs: [{ 'rest-a': 1 }]
      });
    });
    test('Given 1 restaurant and 2 types will place 2 pairs in pair object', () => {
      const exampleRestaurant = {
        area: 'area-a',
        rest_name: 'rest-a',
        types: ['bar', 'cafe']
      };
      const { rest_type_pairs } = formatRestaurants({
        restaurants: [exampleRestaurant],
        areaRef: { 'area-a': 1 },
        typeRef: { bar: 2, cafe: 3 }
      });
      expect(rest_type_pairs).toEqual([{ 'rest-a': 2 }, { 'rest-a': 3 }]);
    });
  });
  test('can apply iteratee logic to multiple restaurants', () => {
    const exampleRestaurants = [
      {
        rest_name: 'rest-a',
        area: 'area-a',
        types: ['cafe', 'bar'],
        open_late: true,
        serves_hot_meals: false,
        website: 'www.rest-a.com'
      },
      {
        rest_name: 'rest-b',
        area: 'area-c',
        types: ['restaurant'],
        open_late: false,
        serves_hot_meals: true,
        website: 'www.rest-b.com'
      }
    ];
    const output = formatRestaurants({
      restaurants: exampleRestaurants,
      areaRef: { 'area-a': 1, 'area-c': 3 },
      typeRef: { restaurant: 1, bar: 2, cafe: 3 }
    });
    const { restaurants, rest_type_pairs } = output;
    const expectedRestaurants = [
      {
        rest_name: 'rest-a',
        area_id: 1,
        open_late: true,
        serves_hot_meals: false,
        website: 'www.rest-a.com'
      },
      {
        rest_name: 'rest-b',
        area_id: 3,
        open_late: false,
        serves_hot_meals: true,
        website: 'www.rest-b.com'
      }
    ];

    const expectedPairs = [{ 'rest-a': 3 }, { 'rest-a': 2 }, { 'rest-b': 1 }];
    expect(restaurants).toEqual(expectedRestaurants);
    expect(rest_type_pairs).toEqual(expectedPairs);
  });
});
