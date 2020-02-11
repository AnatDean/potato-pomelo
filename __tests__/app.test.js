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
      // ------ ERRORS ------
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
      test('POST / responds with added type object', () =>
        request(app)
          .post('/api/types')
          .send({ tye: 'new-type' })
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad Request');
          }));
    });
    describe('/:identifier', () => {
      // ------ GET A SINGLE TYPE ------
      describe('GET', () => {
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
        test('GET Providing type in parameter also returns correct type ', () =>
          request(app)
            .get('/api/types/bar')
            .then(({ body: { type } }) => {
              expect(type).toEqual({ type: 'bar', type_id: 1 });
            }));
        // ------ ERRORS ------
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
      describe('PATCH', () => {
        // ----- PATCH A SINGLE TYPE -----
        test('PATCH responds with 200 ', () =>
          request(app)
            .patch('/api/types/1')
            .send({ type: 'a' })
            .expect(200));
        test('PATCH responds with updated type object', () =>
          request(app)
            .patch('/api/types/2')
            .send({ type: 'a' })
            .then(({ body: { type } }) => {
              expect(type).toEqual({ type_id: 2, type: 'a' });
            }));
        // ----- ERRORS -----
        test('PATCH responds with 404 on unfound typeid', () =>
          request(app)
            .patch('/api/types/200')
            .send({ type: 'a' })
            .expect(404));
        test('PATCH responds with not found error on unfound typeid', () =>
          request(app)
            .patch('/api/types/200')
            .send({ type: 'a' })
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Type 200 not found');
            }));
        test('PATCH responds with 400 on bad input typeid', () => {
          const badInputs = [{ type: 4 }, { ty: 'new-type' }, {}];
          const badResponses = badInputs.map(badInput =>
            request(app)
              .patch('/api/types/3')
              .send(badInput)
              .expect(400)
          );
          return Promise.all(badResponses);
        });
        test('PATCH responds with not found error on un-found typeid', () =>
          request(app)
            .patch('/api/types/3')
            .send({ tpe: 'a' })
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            }));
      });
      describe.only('DELETE', () => {
        // ------ DELETE A SINGLE TYPE ------

        test('DELETE responds with 204', () =>
          request(app)
            .delete('/api/types/1')
            .expect(204));
        test('removes correct type', () =>
          request(app)
            .delete('/api/types/1')
            .then(_ =>
              request(app)
                .get('/api/types/1')
                .expect(404)
            ));
        test.todo(
          'when making endpoint for rest-types table use to prove delete has deleted on cascade the entries there'
        );
        // ------ ERRORS  ------
        test('DELETE responds with 404 when non existent id', () =>
          request(app)
            .delete('/api/types/100')
            .expect(404));
        test('DELETE gives not found message  when non existent id', () =>
          request(app)
            .delete('/api/types/100')
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Type 100 not found');
            }));
        test('DELETE responds with 400  when non id given', () =>
          request(app)
            .delete('/api/types/xyz')
            .expect(400));
        test('DELETE responds bad request when non id given', () =>
          request(app)
            .delete('/api/types/xyz')
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            }));
      });
    });
  });
});
