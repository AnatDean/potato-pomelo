const app = require('../app');
const connection = require('../db/connection');
const request = require('supertest');

describe.only('/api', () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  afterAll(() => {
    return connection.destroy();
  });
  describe('/types', () => {
    describe('GET', () => {
      test('GET / responds with 200', () =>
        request(app)
          .get('/api/types')
          .expect(200));
      test('GET / responds with 200', () =>
        request(app)
          .get('/api/types')
          .then(({ body: { types } }) => {
            expect(Array.isArray(types)).toBe(true);
            types.forEach(type => {
              expect(type).toContainAllKeys(['type_id', 'type']);
            });
          }));
    });
  });
});
