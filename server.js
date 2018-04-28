let express = require('express');
let app = express();

let handleAI = require('./routes/ai');

// Providers
let getProviders = require('./routes/getProviders');
let getProviderServices = require('./routes/getProviderServices');
let getProviderPromos = require('./routes/getProviderPromos');
let claimProvider = require('./routes/claimProvider');
let providerClaimed = require('./routes/providerClaimed');

// Promos
let getPromos = require('./routes/getPromos');
let getPromoDetails = require('./routes/getPromoDetails');
let getPromoProvider = require('./routes/getPromoProvider');
let claimPromotion = require('./routes/claimPromotion');

// Services
let getServices = require('./routes/getServices');
let getServiceDescription = require('./routes/getServiceDescription');
let getServiceProviders = require('./routes/getServiceProviders');

// ROUTES CONFIGURATION
app.get('/ai', handleAI);

// Providers
app.get('/search/providers/:search_type', getProviders);
app.get('/provider/services', getProviderServices);
app.get('/provider/promos', getProviderPromos);
app.use('/provider/claim', claimProvider);
app.get('/provider/claimed', providerClaimed);

// Promotions
app.get('/search/promos/:search_type', getPromos);
app.get('/promo/details', getPromoDetails);
app.get('/promo/provider', getPromoProvider);
app.use('/promo/claim', claimPromotion);

// Services
app.get('/search/services/:service_type', getServices);
app.get('/service/description/:show_providers', getServiceDescription);
app.use('/service', getServiceProviders);

app.listen(3000, () => console.log('Running on PORT 3000'));