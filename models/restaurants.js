const db = require('../db/connection');
const difference = require('lodash/difference');
const { formatRestaurantTypeQuery } = require('../utils/');
const { checkIfMixedQueryTypes } = require('./utils');
const { insertTypeToRestaurant } = require('./restaurantTypes');

exports.updateRestaurant = ({ id }, body) => {
  if (!Object.keys(body).length) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .from('restaurants')
    .where('rest_id', id)
    .update(body)
    .returning('*')
    .then(([restaurant]) => {
      if (!restaurant) {
        return Promise.reject({
          status: 404,
          msg: `Restaurant ${id} not found`
        });
      }
      return restaurant;
    });
};

const getRestTypesByRestId = id => {
  return db
    .select('restaurant-types.type_id', 'restaurant-types.rest_type_id', 'type')
    .from('restaurant-types')
    .join('types', 'types.type_id', 'restaurant-types.type_id')
    .where('restaurant-types.rest_id', id);
};

exports.selectRestaurantById = ({ id }) => {
  const restaurantQuery = db
    .select('restaurants.*')
    .from('restaurants')
    .where('restaurants.rest_id', id)
    .first();

  const restTypesQuery = getRestTypesByRestId(id);
  return Promise.all([restaurantQuery, restTypesQuery]).then(
    ([restaurant, rest_types]) => {
      if (!restaurant) {
        return Promise.reject({
          status: 404,
          msg: `Restaurant ${id} not found`
        });
      }
      const formattedRestaurant = { ...restaurant, rest_types };
      return formattedRestaurant;
    }
  );
};
exports.insertRestaurant = body => {
  const neededKeys = ['rest_name', 'area_id', 'website'];
  if (!Object.keys(body).length) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  const { types, ...restOfBody } = body;
  const bodyKeys = Object.keys({ ...restOfBody });
  if (difference(neededKeys, bodyKeys).length) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .insert({ ...restOfBody })
    .into('restaurants')
    .returning('*')
    .then(([restaurant]) => {
      const rest_type_insertions = types.map(type_id =>
        insertTypeToRestaurant({ id: restaurant.rest_id }, { type_id })
      );
      return Promise.all([restaurant, Promise.all(rest_type_insertions)]);
    })
    .then(([restaurant, rest_types]) => {
      return this.selectRestaurantById({ id: restaurant.rest_id });

      // TODO: refactor ^^
    });
};

exports.removeRestaurant = ({ id }) => {
  return db
    .from('restaurants')
    .where('rest_id', id)
    .del();
};

exports.selectRestaurants = ({
  order_by = 'asc',
  open_late,
  hot_meal,
  area,
  type,
  rest_name
}) => {
  if (order_by !== 'asc' && order_by !== 'desc') {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  if (type) {
    const isMixedTypes = checkIfMixedQueryTypes(type);
    if (isMixedTypes) {
      return Promise.reject({
        status: 400,
        msg: `Bad Request, for multiple queries you must choose either ids or names`
      });
    }
  }
  if (area) {
    const isMixedAreas = checkIfMixedQueryTypes(area);
    if (isMixedAreas) {
      return Promise.reject({
        status: 400,
        msg: `Bad Request, for multiple queries you must choose either ids or names`
      });
    }
  }
  const restaurantsQuery = db
    .select('restaurants.*') //type
    .from('restaurants')
    .orderBy('rest_name', order_by)

    .modify(queryBuilder => {
      if (open_late) queryBuilder.where('open_late', '=', open_late);
      if (hot_meal) queryBuilder.where('serves_hot_meals', '=', hot_meal);
      if (area) {
        queryBuilder.whereIn('area_id', area);
      }
      if (rest_name) {
        queryBuilder.where('rest_name', 'like', `%${rest_name}%`);
      }
      if (type) {
        const isQueriedById = type.every(t => /\d/.test(t));
        const column = isQueriedById ? 'restaurant-types.type_id' : 'type';
        queryBuilder
          .leftJoin(
            'restaurant-types',
            'restaurants.rest_id',
            'restaurant-types.rest_id'
          )
          .leftJoin('types', 'types.type_id', 'restaurant-types.type_id')
          .distinct('restaurants.rest_id')
          .whereIn(column, type);
      }
    });

  const restTypesWithTypeNamesQuery = db
    .select('restaurant-types.type_id', 'rest_type_id', 'rest_id', 'type')
    .from('restaurant-types')
    .join('types', 'types.type_id', 'restaurant-types.type_id');

  return Promise.all([restaurantsQuery, restTypesWithTypeNamesQuery]).then(
    ([restaurants, rest_types]) => {
      if (!restaurants.length) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
      const formattedRestaurants = formatRestaurantTypeQuery(
        restaurants,
        rest_types
      );
      return formattedRestaurants;
    }
  );
};
