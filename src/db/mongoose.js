const mongoose = require('mongoose');
require('dotenv').config({ path: `./config/.env.${process.env.NODE_ENV}`})
mongoose.connect(process.env.MONGODB_URL);