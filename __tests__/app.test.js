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
      test.only('GET / responds with 200', () =>
        request(app)
          .get('/api/types')
          .expect(200));
    });
  });
});
