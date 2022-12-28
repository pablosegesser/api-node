const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
//mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    Account: require('_helpers/MONGODB/models/auth.model'),
    RefreshToken: require('_helpers/MONGODB/models/refresh-token.model'),
    TokenMIA: require('_helpers/MONGODB/models/token-mia.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}