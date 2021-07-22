/* eslint-disable no-param-reassign */
const lo = require('lodash');
const mongoose = require('mongoose');

const uri = 'mongodb://admin:option123@localhost:27021/quiz-mafia?authSource=admin';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const { connection } = mongoose;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

const sanitizeModel = (model) => {
    lo.unset(model, '_id');
    lo.unset(model, '__v');
    return model;
};

module.exports = {
    connection,
    sanitizeModel
};
