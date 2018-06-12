let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers');
let { createMultiGallery } = require('../libs/bots');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataFromTable } = require('../libs/data');

let getPromosTable = getTable('Promos');

let isPromoExpired = (promo_expiration_date) => {
  let date = new Date();
  let promo_date = new Date(promo_expiration_date);
  return date.getMonth() === promo_date.getMonth() && 
    date.getDate() === promo_date.getDate() && 
    date.getFullYear() === promo_date.getFullYear();
}

let toGalleryData = ({ provider_base_id }) => ({ id: promo_id, fields: promo }) => {
  let expiredText = isPromoExpired(promo['Expiration Date']) ? 'EXPIRED' : 'NOT EXPIRED';
  let title = promo['Promotion Name'];
  let subtitle = `${expiredText} - ${promo['Terms']}`;
  let image_url = promo['Image URL'];

  let view_promo_details_url = createURL(`${BASEURL}/promo/view/info`, { promo_id, provider_base_id });
  let update_promo_url = createURL(`${BASEURL}/promo/update`, { promo_id, provider_base_id });
  let toggle_promo_url = createURL(`${BASEURL}/promo/toggle`, { promo_id, provider_base_id });

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: view_promo_details_url
  }

  let btn2 = {
    title: 'Update Promo',
    type: 'json_plugin_url',
    url: update_promo_url
  }

  let btn3 = {
    title: promo['Active?'] ? 'Deactivate' : 'Reactivate',
    type: 'json_plugin_url',
    url: toggle_promo_url
  }

  let buttons = [btn1, btn2, btn3];

  let element = { title, subtitle, image_url, buttons }
  return element;
}

let viewActivePromos = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id);

  let provider_base_id = provider.fields['Practice Base ID'];
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let promos = await getPromos();

  if (!promos[0]) {
    let redirect_to_blocks = ['No Promotions Setup'];
    res.send({ redirect_to_blocks });
    return;
  }

  let galleryData = promos.map(toGalleryData({ provider_base_id }));
  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = viewActivePromos;