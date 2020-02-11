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
      describe('DELETE', () => {
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
  describe('/areas', () => {
    describe('/', () => {
      describe('GET', () => {
        // ----- GET ALL AREAS -----
        test('GET responds with status 200', () =>
          request(app)
            .get('/api/areas')
            .expect(200));
        test('GET responds with an array of area objects', () =>
          request(app)
            .get('/api/areas')
            .then(({ body: { areas } }) => {
              expect(Array.isArray(areas)).toBe(true);
              areas.forEach(area => {
                expect(area).toContainKeys([
                  'area_id',
                  'area_name',
                  'location'
                ]);
              });
            }));
        test('GET areas have count of restaurants in them ', () =>
          request(app)
            .get('/api/areas')
            .then(({ body: { areas } }) => {
              expect(areas[0].restaurant_count).toBe(1);
              expect(areas[2].restaurant_count).toBe(3);
            }));
        test('GET by default sorts areas alphabetically by area_name', () =>
          request(app)
            .get('/api/areas')
            .then(({ body: { areas } }) => {
              expect(areas[0].area_name).toBe('area-a');
              expect(areas[2].area_name).toBe('area-z');
            }));
        test('? sort by query will sorts alphabetically by chosen column', () =>
          request(app)
            .get('/api/areas?sort_by=location')
            .then(({ body: { areas } }) => {
              expect(areas[0].location).toBe('central');
              expect(areas[2].location).toBe('north');
            }));

        test('? location query filters areas by selected location', () =>
          request(app)
            .get('/api/areas?location=central')
            .then(({ body: { areas } }) => {
              const allAreasAreCentral = areas.every(
                area => area.location === 'central'
              );
              expect(allAreasAreCentral).toBe(true);
            }));
        test("will respond with empty array if location query isn't an existing location", () =>
          request(app)
            .get('/api/areas?location=hogwarts')
            .then(({ body: { areas } }) => {
              expect(areas).toEqual([]);
            }));
        // ----- ERRORS ------
        test('will ignore silly queries and give default alphabetical by name instead', () => {
          const sillyQueries = ['bleugh=central', 'sort_by=bleurhg'];
          const sillyRequests = sillyQueries.map(query => {
            return request(app)
              .get(`/api/areas?${query}`)
              .expect(200)
              .then(({ body: { areas } }) => {
                expect(areas[0].area_name).toBe('area-a');
                expect(areas[2].area_name).toBe('area-z');
              });
          });
          return Promise.all(sillyRequests);
        });
      });
      describe('POST', () => {
        // ----- POST AN AREA ------
        test('POST responds with status 201', () =>
          request(app)
            .post('/api/areas')
            .send({ area_name: 'test-area', location: 'test-location' })
            .expect(201));
        test('POST responds with added area object', () =>
          request(app)
            .post('/api/areas')
            .send({ area_name: 'test-area', location: 'test-location' })
            .then(({ body: { area } }) => {
              expect(area).toEqual({
                area_name: 'test-area',
                location: 'test-location',
                area_id: 4
              });
            }));
        // ----- ERRORS ------
        test('POST with bad input responds with status 400', () => {
          const badInputs = [
            { ar_nm: 'test-area', location: 'test-location' },
            { area_name: 'test-areas', location: 4 },
            {}
          ];
          const badRequests = badInputs.map(badInput => {
            return request(app)
              .post('/api/areas')
              .send(badInput)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              });
          });
          return Promise.all(badRequests);
        });
      });
    });
    describe('/:identifier', () => {
      // ----- GET AN AREA BY ID ------
      describe('GET', () => {
        test('GET responds with 200', () =>
          request(app)
            .get('/api/areas/2')
            .expect(200));
        test('GET responds with correct area object', () =>
          request(app)
            .get('/api/areas/2')
            .then(({ body: { area } }) => {
              expect(area.area_id).toBe(2);
            }));
        test('GET responds with 200  requested by name', () =>
          request(app)
            .get('/api/areas/area-a')
            .expect(200));
        // ----- ERRORS ------
        test('GET responds with 404 if non existent id', () =>
          request(app)
            .get('/api/areas/200')
            .expect(404));
      });
      describe('PATCH', () => {});
      describe('DELETE', () => {});
    });
  });
});
