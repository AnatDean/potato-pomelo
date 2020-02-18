const db = require('../db/connection');
const { formatRestaurantTypeQuery } = require('../utils/');
exports.selectRestaurants = ({
  order_by = 'asc',
  open_late,
  hot_meal,
  area,
  type,
  rest_name
}) => {
  const restaurantsWithTypesQuery = db
    .select('restaurants.*', 'type_id')
    .from('restaurants')
    .orderBy('rest_name', order_by)
    .leftJoin(
      'restaurant-types',
      'restaurants.rest_id',
      'restaurant-types.rest_id'
    )
    .modify(queryBuilder => {
      if (open_late) queryBuilder.where('open_late', '=', open_late);
      if (hot_meal) queryBuilder.where('serves_hot_meals', '=', hot_meal);
      if (area) {
        const areaQuery = !area.includes(',') ? [area] : area.split(',');
        queryBuilder.whereIn('area_id', areaQuery);
      }
      if (rest_name) {
        queryBuilder.where('rest_name', 'like', `%${rest_name}%`);
      }
      if (type) {
        const typeQuery = !type.includes(',') ? [type] : type.split(',');

        queryBuilder.whereIn('type_id', typeQuery);
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
