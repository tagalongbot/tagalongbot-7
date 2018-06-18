let { localizeDate } = require('../../../../../libs/helpers.js');
let { getTable, createTableData } = require('../../../../../libs/data.js');
let { createPracticePromo, updatePracticePromo } = require('../../../../../libs/data/practice/promos.js');

let getPromosTable = getTable('Promos');

let createNewPromo = async (data) => {
  let { provider_base_id, new_promo_expiration_date, new_promo_name, new_promo_claim_limit, new_promo_image_id } = data;

  let custom_promo_image = await ({ promo_id: new_promo_image_id })
  
  let expiration_date = new Date(new_promo_expiration_date);

  let promoData = {
    ['Promotion Name']: new_promo_name,
    ['Type']: 'CUSTOM',
    ['Active?']: true,
    ['Expiration Date']: expiration_date,
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(new_promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
  }

  let newPromo = await createPracticePromo(promoData);

  return newPromo;
}

module.exports = {
  createNewPromo,
}