const app = require('../app');
const connection = require('../db/connection');
const request = require('supertest');

describe('/api', () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  afterAll(() => {
    return connection.destroy();
  });
  describe('/types', () => {
    describe('/', () => {
      // ------ GET ALL TYPES ------
      test('GET responds with 200', () =>
        request(app)
          .get('/api/types')
          .expect(200));
      test('GET responds with array of type objects', () =>
        request(app)
          .get('/api/types')
          .then(({ body: { types } }) => {
            expect(Array.isArray(types)).toBe(true);
            types.forEach(type => {
              expect(type).toContainAllKeys(['type_id', 'type']);
            });
          }));
      // ------ POST A TYPE ------
      test('POST / responds with 201', () =>
        request(app)
          .post('/api/types')
          .send({ type: 'new-type' })
          .expect(201));
      test('POST / responds with added type object', () =>
        request(app)
          .post('/api/types')
          .send({ type: 'new-type' })
          .then(({ body: { type } }) => {
            expect(type).toEqual({ type: 'new-type', type_id: 5 });
          }));
      test('POST / responds with 400 if provided bad input', () => {
        const badInputs = [{ type: 4 }, { ty: 'new-type' }, {}];
        const badResponses = badInputs.map(badInput =>
          request(app)
            .post('/api/types')
            .send(badInput)
            .expect(400)
        );
        return Promise.all(badResponses);
      });
    });
    describe('/:identifier', () => {
      // ------ GET A SINGLE TYPE ------
      test('GET responds with 200', () =>
        request(app)
          .get('/api/types/1')
          .expect(200));
      test('GET responds with single type object', () =>
        request(app)
          .get('/api/types/1')
          .then(({ body: { type } }) => {
            expect(type).toEqual({ type: 'bar', type_id: 1 });
          }));
      test('Providing type in parameter also returns correct type ', () =>
        request(app)
          .get('/api/types/bar')
          .then(({ body: { type } }) => {
            expect(type).toEqual({ type: 'bar', type_id: 1 });
          }));
      // ERRORS
      test("If given an id that doesn't exist will respond with 404", () =>
        request(app)
          .get('/api/types/10')
          .expect(404));
      test("If given an id that doesn't exist will respond with error message", () =>
        request(app)
          .get('/api/types/10')
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Type 10 not found');
          }));
      test("If given a type name that doesn't exist will respond with 404", () =>
        request(app)
          .get('/api/types/hey')
          .expect(404));
      test("If given a type name that doesn't exist will respond with error message", () =>
        request(app)
          .get('/api/types/hey')
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Type hey not found');
          }));
      test("If given a type name that doesn't exist will respond with error message", () =>
        request(app)
          .get('/api/types/{}')
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Type {} not found');
          }));
    });
  });
});
