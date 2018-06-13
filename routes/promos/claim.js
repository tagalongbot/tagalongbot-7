let express = require('express');
let router = express.Router();

let askForUserEmail = async ({ query }, res) => {
  let { promo_id, provider_id } = query;

  let redirect_to_blocks = ['Ask For Email (Promo)'];
  let set_attributes = { promo_id, provider_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let claimPromotion = async ({ query }, res) => {
  let { promo_id, provider_id, gender, user_email } = query;
  let messenger_user_id = query['messenger user id'];
  let first_name = query['first name'];
  let last_name = query['last name'];

  let provider = await findPractice(provider_id);
  let provider_base_id = provider.fields['Practice Base ID'];
  let provider_phone_number = provider.fields['Practice Phone #'];
  let provider_booking_url = provider.fields['Practice Booking URL'];

  let promo = await getPromo({ provider_base_id, promo_id });

  if (!promo || promo.fields['Claim Limit Reached'] === '1') {
    let redirect_to_blocks = ['Promo No Longer Valid'];
    res.send({ redirect_to_blocks });
    return;
  }

  let user_data = { messenger_user_id, first_name, last_name, gender, user_email };
  let user = await createOrUpdateUser(user_data, provider);

  let claimed_by_users = promo.fields['Claimed By Users'] || [];

  if (claimed_by_users.includes(user.id)) {
    let redirect_to_blocks = ['Promo Already Claimed By User'];
    res.send({ redirect_to_blocks });
    return;
  }

  let updatedPromo = await updatePromo({ provider_base_id, promo, user, claimed_by_users });

  let claimedMsg = createClaimedMsg({ query, user_data, updated_promo, provider_phone_number, provider_booking_url });

  let messages = [claimedMsg];
  res.send({ messages });
}

router.get('/email', askForUserEmail);
router.get('/', claimPromotion);

module.exports = router;