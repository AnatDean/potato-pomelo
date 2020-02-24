const db = require('../db/connection');
const difference = require('lodash/difference');
const { formatRestaurantTypeQuery } = require('../utils/');
const { checkIfMixedQueryTypes } = require('./utils');
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
    .then(([restaurant]) => restaurant);
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
  const restaurantsWithTypesQuery = db
    .select('restaurants.*', 'restaurant-types.type_id', 'type') //type
    .from('restaurants')
    .orderBy('rest_name', order_by)
    .leftJoin(
      'restaurant-types',
      'restaurants.rest_id',
      'restaurant-types.rest_id'
    )
    .leftJoin('types', 'types.type_id', 'restaurant-types.type_id')
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
        queryBuilder.whereIn(column, type);
      }
    });

  const restTypesWithTypeNamesQuery = db
    .select('restaurant-types.type_id', 'rest_id', 'type')
    .from('restaurant-types')
    .join('types', 'types.type_id', 'restaurant-types.type_id');

  return Promise.all([
    restaurantsWithTypesQuery,
    restTypesWithTypeNamesQuery
  ]).then(([restaurants, rest_types]) => {
    const formattedRestaurants = formatRestaurantTypeQuery(
      restaurants,
      rest_types
    );
    return formattedRestaurants;
  });
};
