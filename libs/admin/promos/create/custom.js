let { BASEURL } = process.env;
let { createURL } = require('../../../../libs/helpers.js');
let { createBtn } = require('../../../../libs/bots.js');

let toServicesGallery = ({ messenger_user_id, new_promo_name, new_promo_expiration_date, new_promo_claim_limit }) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];
  let image_url = service['Image URL'];

  let send_images_url = createURL(
    `${BASEURL}/admin/promos/create/custom/images`,
    { messenger_user_id, service_id, new_promo_name, new_promo_expiration_date, new_promo_claim_limit }
  );

  let btn1 = createBtn(`View Service Images|json_plugin_url|${send_images_url}`);

  let buttons = [btn1];

  return { title, image_url, buttons };
}

let toImagesGallery = (new_promo_name, new_promo_expiration_date, new_promo_claim_limit) => ({ id: promo_id, fields: promo }) => {
  let title = new_promo_name;
  let image_url = promo['Image URL'];
  let new_promo_image_id = promo_id;

  let select_image_url = createURL(
    `${BASEURL}/admin/promos/create/custom/images/select`,
    { new_promo_name, new_promo_expiration_date, new_promo_claim_limit, new_promo_image_id }
  );

  let btn1 = createBtn(`Use This Image|json_plugin_url|${select_image_url}`);

  let buttons = [btn1];

  return { title, image_url, buttons };
}

module.exports = {
  toServicesGallery,
  toImagesGallery,
}