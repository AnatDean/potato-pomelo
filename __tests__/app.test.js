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
              expect(areas[0].restaurant_count).toBe(2);
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
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Area does not exist');
            }));
      });
      describe('PATCH', () => {
        // ----- UPDATE AN AREA BY ID ------
        test('PATCH responds with status 200', () =>
          request(app)
            .patch('/api/areas/1')
            .send({ area_name: 'new-name' })
            .expect(200));
        test('PATCH responds with updated area object', () =>
          request(app)
            .patch('/api/areas/1')
            .send({ area_name: 'new-name' })
            .then(({ body: { area } }) => {
              expect(area).toEqual({
                area_id: 1,
                area_name: 'new-name',
                location: 'central'
              });
              return request(app)
                .get('/api/areas/1')
                .then(({ body: { area } }) => {
                  expect(area.area_name).toBe('new-name');
                });
            }));
        // ----- ERRORS ------
        test('PATCH responds with 404 if non existent id ', () =>
          request(app)
            .patch('/api/areas/100')
            .send({ area_name: 'new-name' })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Area does not exist');
            }));
        test('PATCH responds with 400 if bad body input', () => {
          const badInputs = [
            {},
            { badKey: 'new-name' },
            { area_name: 9 },
            { area_id: 3 }
          ];
          const badRequests = badInputs.map(badInput =>
            request(app)
              .patch('/api/areas/1')
              .send(badInput)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              })
          );
          return Promise.all(badRequests);
        });
      });
      describe('DELETE', () => {
        // ----- DELETE AN AREA BY ID ------
        test('DELETE responds with 204', () =>
          request(app)
            .delete('/api/areas/2')
            .expect(204));
        test('DELETE removes appropriate area', () =>
          request(app)
            .delete('/api/areas/1')
            .then(() => {
              return request(app)
                .get('/api/areas/1')
                .expect(404);
            }));
        // ----- ERRORS ------
        test('DELETE responds with 404 when non existent id', () =>
          request(app)
            .delete('/api/areas/100')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Area not found');
            }));
        test('DELETE responds with 400 when passed a bad id', () =>
          request(app)
            .delete('/api/areas/bad')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            }));
      });
    });
  });
  describe('/restaurants', () => {
    describe('GET /', () => {
      test('GET / responds with 200', () =>
        request(app)
          .get('/api/restaurants')
          .expect(200));
      test('GET / responds with an array of restaurant objects', () =>
        request(app)
          .get('/api/restaurants')
          .then(({ body: { restaurants } }) => {
            expect(Array.isArray(restaurants)).toBe(true);
            restaurants.forEach(restaurant => {
              expect(restaurant).toContainKeys([
                'rest_id',
                'rest_name',
                'open_late',
                'serves_hot_meals',
                'area_id',
                'website'
              ]);
            });
          }));
      test('GET / responds with array of all of restaurants type ids', () =>
        request(app)
          .get('/api/restaurants')
          .then(({ body: { restaurants } }) => {
            expect(restaurants[0]).toContainKeys(['rest_types']);
            expect(restaurants[0].rest_types).toEqual([
              { type_id: 1, type: 'bar' },
              { type_id: 2, type: 'cafe' }
            ]);
          }));
      test('GET / defaults order by alphabetical by name', () =>
        request(app)
          .get('/api/restaurants')
          .then(({ body: { restaurants } }) => {
            expect(restaurants[0].rest_name).toBe('rest-a');
            expect(restaurants[5].rest_name).toBe('rest-e');
          }));
      describe('Queries', () => {
        test('GET ?order_by can reorder by name zetabetically', () =>
          request(app)
            .get('/api/restaurants?order_by=desc')
            .then(({ body: { restaurants } }) => {
              expect(restaurants[0].rest_name).toBe('rest-e');
              expect(restaurants[5].rest_name).toBe('rest-a');
            }));
        test('GET ?open_late can filter restaurants by only open late', () =>
          request(app)
            .get('/api/restaurants?open_late=true')
            .then(({ body: { restaurants } }) => {
              restaurants.forEach(rest => {
                expect(rest.open_late).toBe(true);
              });
            }));
        test('GET ?hot_meal can filter restaurants by those that serve hot meals ', () =>
          request(app)
            .get('/api/restaurants?hot_meal=true')
            .then(({ body: { restaurants } }) => {
              restaurants.forEach(rest => {
                expect(rest.serves_hot_meals).toBe(true);
              });
            }));
        test('GET ?area can filter restaurants by a specific area', () =>
          request(app)
            .get('/api/restaurants?area=2')
            .then(({ body: { restaurants } }) => {
              restaurants.forEach(rest => {
                expect(rest.area_id).toBe(2);
              });
            }));
        test('GET ?area can filter restaurants by a multiple areas', () =>
          request(app)
            .get('/api/restaurants?area=2,3')
            .then(({ body: { restaurants } }) => {
              restaurants.forEach(rest => {
                expect(rest.area_id === 2 || rest.area_id === 3).toBeTruthy();
              });
            }));
        test('GET ?type can filter restaurants by certain types', () =>
          request(app)
            .get('/api/restaurants?type=1')
            .then(({ body: { restaurants } }) => {
              restaurants.forEach(rest => {
                expect(rest.rest_types.find(r => r.type_id === 1)).toBeTruthy();
              });
            }));
        test('GET ?type can filter restaurants by multiple types', () =>
          request(app)
            .get('/api/restaurants?type=1,2')
            .then(({ body: { restaurants } }) => {
              restaurants.forEach(rest => {
                expect(
                  rest.rest_types.find(r => r.type_id === 1 || r.type_id === 2)
                ).toBeTruthy();
              });
            }));
        test('GET ?rest_name can filter restaurants by search term', () =>
          request(app)
            .get('/api/restaurants?rest_name=d')
            .then(({ body: { restaurants } }) => {
              expect(restaurants.length).toBe(2);
              restaurants.forEach(rest => {
                expect(rest.rest_name.includes('d')).toBeTruthy();
              });
            }));
      });
    });
  });
});
