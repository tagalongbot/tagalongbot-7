// This library is used for promos inside a practice base
let { getTable, getAllDataFromTable, findTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Promos');

let getPracticePromo = async ({ provider_base_id, promo_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let getPracticePromos = async ({ provider_base_id, view = 'Main View' }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let promos = await getPromos({ view });
  return promos;
}

module.exports = {
  getPracticePromo,
  getPracticePromos,
}