/**
 * Returns true if the provided weather statistics satisfy the crop's required
 * environmental conditions.
 *
 * @param {Object} cropCondition - The crop's desired germination or growth condition.
 * @param {number=} cropCondition.min_temp   - Minimum acceptable avg_min_temp_c.
 * @param {number=} cropCondition.max_temp   - Maximum acceptable avg_max_temp_c.
 * @param {number=} cropCondition.min_humidity - Minimum acceptable humidity (%).
 * @param {number=} cropCondition.max_humidity - Maximum acceptable humidity (%).
 * @param {Object} weather - The aggregated weather data for a given month.
 * @param {number} weather.avg_min_temp_c
 * @param {number} weather.avg_max_temp_c
 * @param {number} weather.avg_humidity_percent
 * @returns {boolean}
 */
function isWeatherSuitable(cropCondition = {}, weather = {}) {
  if (!weather) return false;

  const {
    min_temp: minTemp,
    max_temp: maxTemp,
    min_humidity: minHumidity,
    max_humidity: maxHumidity,
  } = cropCondition;

  if (minTemp !== undefined && weather.avg_min_temp_c < minTemp) return false;
  if (maxTemp !== undefined && weather.avg_max_temp_c > maxTemp) return false;
  if (minHumidity !== undefined && weather.avg_humidity_percent < minHumidity) return false;
  if (maxHumidity !== undefined && weather.avg_humidity_percent > maxHumidity) return false;

  return true;
}

module.exports = {
  isWeatherSuitable,
}; 