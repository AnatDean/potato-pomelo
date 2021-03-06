const app = require('../app');
const connection = require('../db/connection');
const request = require('supertest');

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  afterAll(() => connection.destroy());
  describe('/types', () => {
    describe('/', () => {
      // ------ GET ALL TYPES ------
      describe('GET', () => {
        test('responds with 200', () =>
          request(app)
            .get('/api/types')
            .expect(200));
        test('responds with array of type objects', async () => {
          const {
            body: { types }
          } = await request(app).get('/api/types');
          expect(Array.isArray(types)).toBe(true);
          types.forEach(type => {
            expect(type).toContainAllKeys(['type_id', 'type']);
          });
        });
      });
      // ------ POST A TYPE ------
      describe('POST', () => {
        test('POST / responds with 201', () =>
          request(app)
            .post('/api/types')
            .send({ type: 'new-type' })
            .expect(201));
        test('POST / responds with added type object', async () => {
          const {
            body: { type }
          } = await request(app)
            .post('/api/types')
            .send({ type: 'new-type' });
          expect(type).toEqual({ type: 'new-type', type_id: 5 });
        });
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
        test('POST / responds with added type object', async () => {
          const {
            body: { msg }
          } = await request(app)
            .post('/api/types')
            .send({ tye: 'new-type' });
          expect(msg).toBe('Bad Request');
        });
      });
    });
    describe('/:identifier', () => {
      // ------ GET A SINGLE TYPE ------
      describe('GET', () => {
        test('GET responds with 200', () =>
          request(app)
            .get('/api/types/1')
            .expect(200));
        test('GET responds with single type object', async () => {
          const {
            body: { type }
          } = await request(app).get('/api/types/1');
          expect(type).toEqual({ type: 'bar', type_id: 1 });
        });
        test('GET Providing type in parameter also returns correct type ', async () => {
          const {
            body: { type }
          } = await request(app).get('/api/types/bar');
          expect(type).toEqual({ type: 'bar', type_id: 1 });
        });
        // ------ ERRORS ------
        test("If given an id that doesn't exist will respond with 404", () =>
          request(app)
            .get('/api/types/10')
            .expect(404));
        test("If given an id that doesn't exist will respond with error message", async () => {
          const {
            body: { msg }
          } = await request(app).get('/api/types/10');
          expect(msg).toBe('Type 10 not found');
        });
        test("If given a type name that doesn't exist will respond with 404", () =>
          request(app)
            .get('/api/types/hey')
            .expect(404));
        test("If given a type name that doesn't exist will respond with error message", async () => {
          const {
            body: { msg }
          } = await request(app).get('/api/types/hey');
          expect(msg).toBe('Type hey not found');
        });
        test("If given a type name that doesn't exist will respond with error message", async () => {
          const {
            body: { msg }
          } = await request(app).get('/api/types/{}');
          expect(msg).toBe('Type {} not found');
        });
      });
      describe('PATCH', () => {
        // ----- PATCH A SINGLE TYPE -----
        test('PATCH responds with 200 ', () =>
          request(app)
            .patch('/api/types/1')
            .send({ type: 'a' })
            .expect(200));
        test('PATCH responds with updated type object', async () => {
          const {
            body: { type }
          } = await request(app)
            .patch('/api/types/2')
            .send({ type: 'a' });
          expect(type).toEqual({ type_id: 2, type: 'a' });
        });
        // ----- ERRORS -----
        test('PATCH responds with 404 on unfound typeid', () =>
          request(app)
            .patch('/api/types/200')
            .send({ type: 'a' })
            .expect(404));
        test('PATCH responds with not found error on unfound typeid', async () => {
          const {
            body: { msg }
          } = await request(app)
            .patch('/api/types/200')
            .send({ type: 'a' });
          expect(msg).toBe('Type 200 not found');
        });
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
        test('PATCH responds with not found error on un-found typeid', async () => {
          const {
            body: { msg }
          } = await request(app)
            .patch('/api/types/3')
            .send({ tpe: 'a' });
          expect(msg).toBe('Bad Request');
        });
      });
      describe('DELETE', () => {
        // ------ DELETE A SINGLE TYPE ------

        test('DELETE responds with 204', () =>
          request(app)
            .delete('/api/types/1')
            .expect(204));
        test('removes correct type', async () => {
          await request(app).delete('/api/types/1');
          await request(app)
            .get('/api/types/1')
            .expect(404);
        });
        test('type is now not available on restaurants from junction table', async () => {
          await request(app).delete('/api/types/1');
          const {
            body: { restaurant }
          } = await request(app).get('/api/restaurants/2');
          expect(restaurant.rest_types).not.toContainEqual({
            type_id: 1,
            type: 'bar'
          });
        });
        // ------ ERRORS  ------
        test('DELETE responds with 404 when non existent id', () =>
          request(app)
            .delete('/api/types/100')
            .expect(404));
        test('DELETE gives not found message  when non existent id', async () => {
          const {
            body: { msg }
          } = await request(app).delete('/api/types/100');
          expect(msg).toBe('Type 100 not found');
        });
        test('DELETE responds with 400  when non id given', () =>
          request(app)
            .delete('/api/types/xyz')
            .expect(400));
        test('DELETE responds bad request when non id given', async () => {
          const {
            body: { msg }
          } = await request(app).delete('/api/types/xyz');
          expect(msg).toBe('Bad Request');
        });
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
        test('GET responds with an array of area objects', async () => {
          const {
            body: { areas }
          } = await request(app).get('/api/areas');
          expect(Array.isArray(areas)).toBe(true);
          areas.forEach(area => {
            expect(area).toContainKeys(['area_id', 'area_name', 'location']);
          });
        });
        test('GET areas have count of restaurants in them ', async () => {
          const {
            body: { areas }
          } = await request(app).get('/api/areas');
          expect(areas[0].restaurant_count).toBe(2);
          expect(areas[2].restaurant_count).toBe(3);
        });
        test('GET by default sorts areas alphabetically by area_name', async () => {
          const {
            body: { areas }
          } = await request(app).get('/api/areas');
          expect(areas[0].area_name).toBe('area-a');
          expect(areas[2].area_name).toBe('area-z');
        });
        test('? sort by query will sorts alphabetically by chosen column', async () => {
          const {
            body: { areas }
          } = await request(app).get('/api/areas?sort_by=location');
          expect(areas[0].location).toBe('central');
          expect(areas[2].location).toBe('north');
        });

        test('? location query filters areas by selected location', async () => {
          const {
            body: { areas }
          } = await request(app).get('/api/areas?location=central');
          const allAreasAreCentral = areas.every(
            area => area.location === 'central'
          );
          expect(allAreasAreCentral).toBe(true);
        });
        test("will respond with empty array if location query isn't an existing location", async () => {
          const {
            body: { areas }
          } = await request(app).get('/api/areas?location=hogwarts');
          expect(areas).toEqual([]);
        });
        // ----- ERRORS ------
        test('will ignore silly queries and give default alphabetical by name instead', () => {
          const sillyQueries = ['bleugh=central', 'sort_by=bleurhg'];
          const sillyRequests = sillyQueries.map(async query => {
            const {
              body: { areas }
            } = await request(app)
              .get(`/api/areas?${query}`)
              .expect(200);
            expect(areas[0].area_name).toBe('area-a');
            expect(areas[2].area_name).toBe('area-z');
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
        test('POST responds with added area object', async () => {
          const {
            body: { area }
          } = await request(app)
            .post('/api/areas')
            .send({ area_name: 'test-area', location: 'test-location' });
          expect(area).toEqual({
            area_name: 'test-area',
            location: 'test-location',
            area_id: 4
          });
        });
        // ----- ERRORS ------
        test('POST with bad input responds with status 400', () => {
          const badInputs = [
            { ar_nm: 'test-area', location: 'test-location' },
            { area_name: 'test-areas', location: 4 },
            {}
          ];
          const badRequests = badInputs.map(async badInput => {
            const {
              body: { msg }
            } = await request(app)
              .post('/api/areas')
              .send(badInput)
              .expect(400);
            expect(msg).toBe('Bad Request');
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
        test('GET responds with correct area object', async () => {
          const {
            body: { area }
          } = await request(app).get('/api/areas/2');
          expect(area.area_id).toBe(2);
        });
        test('GET responds with 200  requested by name', () =>
          request(app)
            .get('/api/areas/area-a')
            .expect(200));
        // ----- ERRORS ------
        test('GET responds with 404 if non existent id', async () => {
          const {
            body: { msg }
          } = await request(app)
            .get('/api/areas/200')
            .expect(404);
          expect(msg).toBe('Area does not exist');
        });
      });
      describe('PATCH', () => {
        // ----- UPDATE AN AREA BY ID ------
        test('PATCH responds with status 200', () =>
          request(app)
            .patch('/api/areas/1')
            .send({ area_name: 'new-name' })
            .expect(200));
        test('PATCH responds with updated area object', async () => {
          let { body: patchBody } = await request(app)
            .patch('/api/areas/1')
            .send({ area_name: 'new-name' });

          expect(patchBody.area).toEqual({
            area_id: 1,
            area_name: 'new-name',
            location: 'central'
          });
          let {
            body: { area }
          } = await request(app).get('/api/areas/1');
          expect(area.area_name).toBe('new-name');
        });
        // ----- ERRORS ------
        test('PATCH responds with 404 if non existent id ', async () => {
          const {
            body: { msg }
          } = await request(app)
            .patch('/api/areas/100')
            .send({ area_name: 'new-name' })
            .expect(404);
          expect(msg).toBe('Area does not exist');
        });
        test('PATCH responds with 400 if bad body input', () => {
          const badInputs = [
            {},
            { badKey: 'new-name' },
            { area_name: 9 },
            { area_id: 3 }
          ];
          const badRequests = badInputs.map(async badInput => {
            const {
              body: { msg }
            } = await request(app)
              .patch('/api/areas/1')
              .send(badInput)
              .expect(400);
            expect(msg).toBe('Bad Request');
          });

          return Promise.all(badRequests);
        });
      });
      describe('DELETE', () => {
        // ----- DELETE AN AREA BY ID ------
        test('DELETE responds with 204', () =>
          request(app)
            .delete('/api/areas/2')
            .expect(204));
        test('DELETE removes appropriate area', async () => {
          await request(app).delete('/api/areas/1');
          await request(app)
            .get('/api/areas/1')
            .expect(404);
        });
        // ----- ERRORS ------
        test('DELETE responds with 404 when non existent id', async () => {
          const {
            body: { msg }
          } = await request(app)
            .delete('/api/areas/100')
            .expect(404);
          expect(msg).toBe('Area not found');
        });
        test('DELETE responds with 400 when passed a bad id', async () => {
          const {
            body: { msg }
          } = await request(app)
            .delete('/api/areas/bad')
            .expect(400);
          expect(msg).toBe('Bad Request');
        });
      });
    });
  });
  describe('/restaurants', () => {
    describe('/', () => {
      describe('GET /', () => {
        test('GET / responds with 200', () =>
          request(app)
            .get('/api/restaurants')
            .expect(200));
        test('GET / responds with an array of restaurant objects', async () => {
          const {
            body: { restaurants }
          } = await request(app).get('/api/restaurants');
          expect(Array.isArray(restaurants)).toBe(true);
          restaurants.forEach(restaurant => {
            expect(restaurant).toContainKeys([
              'rest_id',
              'rest_name',
              'opens_at',
              'closes_at',
              'serves_hot_meals',
              'area_id',
              'website'
            ]);
          });
        });
        test('GET / responds with array of all of restaurants type ids', async () => {
          const {
            body: { restaurants }
          } = await request(app).get('/api/restaurants');
          expect(restaurants[0]).toContainKeys(['rest_types']);
          expect(restaurants[0].rest_types).toEqual([
            { type_id: 1, type: 'bar', rest_type_id: 1 },
            { type_id: 2, type: 'cafe', rest_type_id: 2 }
          ]);
        });
        test('GET / defaults order by alphabetical by name', async () => {
          const {
            body: { restaurants }
          } = await request(app).get('/api/restaurants');
          expect(restaurants[0].rest_name).toBe('rest-a');
          expect(restaurants[5].rest_name).toBe('rest-e');
        });
        describe('Queries', () => {
          test('GET ?order_by can reorder by name zetabetically', async () => {
            const {
              body: { restaurants }
            } = await request(app).get('/api/restaurants?order_by=desc');
            expect(restaurants[0].rest_name).toBe('rest-e');
            expect(restaurants[5].rest_name).toBe('rest-a');
          });
          test('GET ?open_late can filter restaurants by only open late', async () => {
            const {
              body: { restaurants }
            } = await request(app).get('/api/restaurants?open_late=true');
            expect(restaurants).toHaveLength(4);
            restaurants.forEach(rest => {
              const [hour] = rest.closes_at.split(':');
              expect(hour).toBeOneOf(['22', '23', '00', '01', '02', '03']);
            });
          });
          test('GET ?hot_meal can filter restaurants by those that serve hot meals ', async () => {
            const {
              body: { restaurants }
            } = await request(app).get('/api/restaurants?hot_meal=true');
            restaurants.forEach(rest => {
              expect(rest.serves_hot_meals).toBe(true);
            });
          });
          test('GET ?area can filter restaurants by a specific area', async () => {
            const {
              body: { restaurants }
            } = await request(app).get('/api/restaurants?area=2');
            restaurants.forEach(rest => {
              expect(rest.area_id).toBe(2);
            });
          });
          test('GET ?area can filter restaurants by a multiple areas', async () => {
            const {
              body: { restaurants }
            } = await request(app).get('/api/restaurants?area=2,3');
            restaurants.forEach(rest => {
              expect(rest.area_id === 2 || rest.area_id === 3).toBeTruthy();
            });
          });
          test('GET ?type can filter restaurants by certain types', async () => {
            const {
              body: { restaurants }
            } = await request(app).get('/api/restaurants?type=1');

            restaurants.forEach(rest => {
              expect(rest.rest_types.find(r => r.type_id === 1)).toBeTruthy();
            });
          });

          test('GET ?type can filter restaurants by multiple types', async () => {
            const {
              body: { restaurants }
            } = await request(app).get('/api/restaurants?type=1,2');
            restaurants.forEach(({ rest_types }) => {
              expect(
                rest_types.find(({ type_id }) => type_id === 1 || type_id === 2)
              ).toBeTruthy();
            });
          });
          test('GET ?type can filter restaurants by multiple types', async () => {
            const {
              body: { restaurants }
            } = await request(app)
              .get('/api/restaurants?type=bar,cafe')
              .expect(200);
            restaurants.forEach(({ rest_types }) => {
              expect(
                rest_types.find(({ type }) => type === 'bar' || type === 'cafe')
              ).toBeTruthy();
            });
          });
          test('GET ?rest_name can filter restaurants by search term', async () => {
            const {
              body: { restaurants }
            } = await request(app).get('/api/restaurants?rest_name=d');
            expect(restaurants.length).toBe(2);
            restaurants.forEach(({ rest_name }) => {
              expect(rest_name.includes('d')).toBeTruthy();
            });
          });
          test('GET ? can combine queries', async () => {
            const {
              body: { restaurants }
            } = await request(app).get(
              '/api/restaurants?type=2&open_late=true'
            );
            restaurants.forEach(({ closes_at, rest_types }) => {
              const [hour] = closes_at.split(':');
              expect(hour).toBeOneOf(['22', '23', '00', '01', '02', '03']);
              expect(rest_types.find(r => r.type_id === 2)).toBeTruthy();
            });
          });
        });
        describe('Errors', () => {
          test("If queried type id doesn't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?type=345')
              .expect(404);
            expect(msg).toBe('Type 345 not found');
          });

          test("If queried type doesn't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?type=not-a-type')
              .expect(404);
            expect(msg).toBe('Type not-a-type not found');
          });
          test("If one of multiple queried types doesn't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?type=not-a-type,cafe')
              .expect(404);
            expect(msg).toBe('Type not-a-type not found');
          });

          test("If queried area id doesn't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?area=345')
              .expect(404);
            expect(msg).toBe('Area does not exist');
          });
          test("If queried area doesn't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?area=not-an-area')
              .expect(404);
            expect(msg).toBe('Area does not exist');
          });
          test("If one of multiple queried areas don't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?area=area-a,bad')
              .expect(404);
            expect(msg).toBe('Area does not exist');
          });
          test('if other queries will send bad request', () => {
            const nonsensicalQueries = [
              'open_late=bad',
              'hot_meal=bad',
              'order_by=bad'
            ];
            const badRequests = nonsensicalQueries.map(async query => {
              const {
                body: { msg }
              } = await request(app)
                .get(`/api/restaurants?${query}`)
                .expect(400);
              expect(msg).toBe('Bad Request');
            });
            return Promise.all(badRequests);
          });
          test('if try to mix and match multiple types - using id and name will 400', async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?type=1,cafe')
              .expect(400);
            expect(msg).toBe(
              'Bad Request, for multiple queries you must choose either ids or names'
            );
          });
          test('if try to mix and match multiple areas - using id and name will 400', async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?area=1,area-a')
              .expect(400);
            expect(msg).toBe(
              'Bad Request, for multiple queries you must choose either ids or names'
            );
          });
          test("if any of multiple queried areas don't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?area=1,200')
              .expect(404);
            expect(msg).toBe('Area does not exist');
          });
          test("if any of multiple queried types don't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?type=not-there,cafe')
              .expect(404);
            expect(msg).toBe('Type not-there not found');
          });
          test("If queried rest_name doesn't exist, will respond with 404", async () => {
            const {
              body: { msg }
            } = await request(app)
              .get('/api/restaurants?rest_name=zzzz')
              .expect(404);
            expect(msg).toBe('Not Found');
          });
        });
      });
      describe('POST /', () => {
        const validBody = {
          rest_name: 'rest-test',
          area_id: 2,
          website: 'www.rest-test.com',
          types: [1, 3]
        };
        test('POST / responds with 201 with minimum keys needed', () =>
          request(app)
            .post('/api/restaurants')
            .send(validBody)
            .expect(201));
        test('POST / responds with posted restaurant object', async () => {
          const {
            body: { restaurant }
          } = await request(app)
            .post('/api/restaurants')
            .send(validBody);
          expect(restaurant.rest_id).toBe(7);
          expect(restaurant.rest_name).toBe('rest-test');
          expect(restaurant.area_id).toBe(2);
          expect(restaurant.website).toBe('www.rest-test.com');
        });
        test('POST / creates a junction entry in rest-types', async () => {
          const {
            body: { restaurant }
          } = await request(app)
            .post('/api/restaurants')
            .send(validBody);
          expect(restaurant).toContainKeys(['rest_types']);
          expect(restaurant.rest_types).toEqual([
            { type_id: 1, type: 'bar', rest_type_id: 10 },
            { type_id: 3, type: 'restaurant', rest_type_id: 11 }
          ]);
        });
        // ------ ERRORS ------
        test('If not provided valid body will send 400 ', () => {
          const invalidBodies = [
            { rest_name: 'rest-test' }, // missing required keys
            { rest_name: 'rest-test', website: 'www.test.come' },
            { ...validBody, extra_key: 'bad' },
            { ...validBody, open_late: 'invalid value' },
            {}
            // TODO - check if no types property
          ];
          const invalidRequests = invalidBodies.map(async invalidBody => {
            const {
              body: { msg }
            } = await request(app)
              .post('/api/restaurants')
              .send(invalidBody)
              .expect(400);
            expect(msg).toBe('Bad Request');
          });
          return Promise.all(invalidRequests);
        });
        test("If area id provided doesn't exist will respond with 404", () =>
          request(app)
            .post('/api/restaurants')
            .send({ ...validBody, area_id: 100 })
            .expect(404));
      });
    });
    describe('/:id', () => {
      describe('PATCH /:id', () => {
        test('PATCH /:id responds with 200', () =>
          request(app)
            .patch('/api/restaurants/2')
            .send({ rest_name: 'a' })
            .expect(200));
        test('PATCH /:id responds with updated restaurant object', () => {
          const possibleUpdates = [
            { rest_name: 'a' },
            { website: 'www.newweb.com' },
            { closes_at: '22:00:00' },
            { area_id: 3 }
          ];
          const goodRequests = possibleUpdates.map(async update => {
            const [key, value] = Object.entries(update)[0];
            const {
              body: { restaurant }
            } = await request(app)
              .patch('/api/restaurants/2')
              .send(update);
            expect(restaurant.rest_id).toBe(2);
            expect(restaurant[key]).toBe(value);
          });

          return Promise.all(goodRequests);
        });

        // ------ ERRORS -------
        test('PATCH /:id responds with 404 when id not found', async () => {
          const {
            body: { msg }
          } = await request(app)
            .patch('/api/restaurants/200')
            .send({ rest_name: 'a' })
            .expect(404);
          expect(msg).toBe('Restaurant 200 not found');
        });
        test('PATCH /:id responds with 400 when id is not valid', async () => {
          const {
            body: { msg }
          } = await request(app)
            .patch('/api/restaurants/bad-id')
            .send({ rest_name: 'a' })
            .expect(400);
          expect(msg).toBe('Bad Request');
        });
        test('PATCH /:id responds with 400 when invalid body sent', () => {
          const invalidBodies = [
            { not_a_key: 'a' },
            { open_late: 'not-boolean' },
            { serves_hot_meals: 'not-boolean' },
            {}
          ];
          const badRequests = invalidBodies.map(async invalidBody => {
            const {
              body: { msg }
            } = await request(app)
              .patch('/api/restaurants/bad-id')
              .send(invalidBody)
              .expect(400);
            expect(msg).toBe('Bad Request');
          });
          return Promise.all(badRequests);
        });
      });

      describe('DELETE /:id ', () => {
        test('Responds with 204', () =>
          request(app)
            .delete('/api/restaurants/2')
            .expect(204));
        test('Removes specified restaurant', async () => {
          await request(app).delete('/api/restaurants/2');
          const {
            body: { msg }
          } = await request(app)
            .get('/api/restaurants/2')
            .expect(404);
          expect(msg).toBe('Restaurant 2 not found');
        });
        // ----- ERRORS ------
        test('Will respond with 404 if restaurant not found', async () => {
          const {
            body: { msg }
          } = await request(app)
            .delete('/api/restaurants/200')
            .expect(404);
          expect(msg).toBe('Restaurant 200 not found');
        });
        test('Will respond with 400 if bad id provided', async () => {
          const {
            body: { msg }
          } = await request(app)
            .delete('/api/restaurants/bad-id')
            .expect(400);
          expect(msg).toBe('Bad Request');
        });
      });
      describe('GET /:id', () => {
        test('Will respond with 200', () =>
          request(app)
            .get('/api/restaurants/2')
            .expect(200));
        test('Will respond with correct restaurant ', async () => {
          const {
            body: { restaurant }
          } = await request(app).get('/api/restaurants/2');
          expect(restaurant).toContainKeys([
            'rest_id',
            'rest_name',
            'closes_at',
            'opens_at',
            'serves_hot_meals',
            'area_id',
            'website'
          ]);
        });
        test('Responds with array of all of restaurants type ids', async () => {
          const {
            body: { restaurant }
          } = await request(app).get('/api/restaurants/2');
          expect(restaurant).toContainKeys(['rest_types']);
          expect(restaurant.rest_types).toEqual([
            { type_id: 1, type: 'bar', rest_type_id: 3 },
            { type_id: 2, type: 'cafe', rest_type_id: 4 }
          ]);
        });
        // ----- ERRORS ------
        test('will respond with 404 if id not found', async () => {
          const {
            body: { msg }
          } = await request(app)
            .get('/api/restaurants/200')
            .expect(404);
          expect(msg).toBe('Restaurant 200 not found');
        });
        test('will respond with 400 if bad id provided', async () => {
          const {
            body: { msg }
          } = await request(app)
            .get('/api/restaurants/bad-id')
            .expect(400);
          expect(msg).toBe('Bad Request');
        });
      });
    });
  });
  describe('/restaurants/:id/types', () => {
    describe('POST', () => {
      test('posting a new type responds with 201', () =>
        request(app)
          .post('/api/restaurants/2/types')
          .send({ type_id: 3 })
          .expect(201));
      test('responds with created restaurant type', async () => {
        const {
          body: { rest_type }
        } = await request(app)
          .post('/api/restaurants/2/types')
          .send({ type_id: 3 });
        expect(rest_type).toEqual({
          rest_type_id: 10,
          type_id: 3,
          type: 'restaurant',
          rest_id: 2
        });
      });
      test('new type should be available when requesting restaurant ', async () => {
        await request(app)
          .post('/api/restaurants/2/types')
          .send({ type_id: 3 });

        const {
          body: { restaurant }
        } = await request(app).get('/api/restaurants/2');

        expect(restaurant.rest_types).toContainEqual({
          type_id: 3,
          type: 'restaurant',
          rest_type_id: 10
        });
      });
      // ----- ERRORS ------
      test('Given a non existent restaurant id will respond with 404', async () => {
        const {
          body: { msg }
        } = await request(app)
          .post('/api/restaurants/200/types')
          .send({ type_id: 3 })
          .expect(404);
        expect(msg).toBe('Not Found');
      });
      test('Given a bad restaurant id will respond with 400', async () => {
        const {
          body: { msg }
        } = await request(app)
          .post('/api/restaurants/bad-id/types')
          .send({ type_id: 3 })
          .expect(400);
        expect(msg).toBe('Bad Request');
      });
      test("Given a type id that doesn't exist will respond with 404", async () => {
        const {
          body: { msg }
        } = await request(app)
          .post('/api/restaurants/2/types')
          .send({ type_id: 30 })
          .expect(404);
        expect(msg).toBe('Not Found');
      });
      test('Given a bad type id will respond with 400', () => {
        const badInputs = [{ type_id: 'bad' }, { badkey: 2 }, {}];
        const badRequests = badInputs.map(async badInput => {
          const {
            body: { msg }
          } = await request(app)
            .post('/api/restaurants/2/types')
            .send(badInput)
            .expect(400);
          expect(msg).toBe('Bad Request');
        });
        return Promise.all(badRequests);
      });
    });
  });
  describe('/restaurants/types/:rest_type_id', () => {
    describe('DELETE', () => {
      test('when deleted responds with 204', () =>
        request(app)
          .delete('/api/restaurants/types/4')
          .expect(204));
      test('removes rest-type entry', async () => {
        await request(app).delete('/api/restaurants/types/4');

        const {
          body: { restaurant }
        } = await request(app).get('/api/restaurants/2');

        expect(restaurant.rest_types).not.toContainEqual({
          type_id: 2,
          type: 'cafe',
          rest_type_id: 4
        });
      });
      // ------ ERRORS ------
      test('responds with 404 when rest_type not found', async () => {
        const {
          body: { msg }
        } = await request(app)
          .delete('/api/restaurants/types/400')
          .expect(404);
        expect(msg).toBe('Rest-type 400 not found');
      });
      test('responds with 400 when provided bad id', async () => {
        const {
          body: { msg }
        } = await request(app)
          .delete('/api/restaurants/types/bad-id')
          .expect(400);
        expect(msg).toBe('Bad Request');
      });
    });
  });
});
