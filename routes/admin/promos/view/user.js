let { getProviderByUserID } = require('../../../../libs/data/providers.js');
let { getPracticeUser, getUserPromos } = require('../../../../libs/data/practice/users.js');
let { toGalleryElement } = require('../../../../libs/admin/promos/view/user.js');
let { createMultiGallery } = require('../../../../libs/bots.js');

let viewUserPromos = async ({ query }, res) => {
  let { 
    messenger_user_id, // messenger id of the provider
    user_messenger_id, // messenger id of the consumer
  } = query;

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let user = await getPracticeUser({ provider_base_id, user_messenger_id });
  let user_record_id = user.id;

  let promos = await getUserPromos({ provider_base_id, user_id: user_record_id });

  if (!promos[0]) {
    let redirect_to_blocks = ['[Admin Verify Promo] No User Promos Found'];
    let user_name = `${user.fields['First Name']} ${user.fields['Last Name']}`;
    let set_attributes = { user_name };
    res.send({ redirect_to_blocks, set_attributes });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement({ provider_base_id, messenger_user_id, user_messenger_id, user_record_id })
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = viewUserPromos;