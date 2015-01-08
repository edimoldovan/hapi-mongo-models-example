var Joi = require('joi');
var BaseModel = require('hapi-mongo-models').BaseModel;

var User = BaseModel.extend({
    // instance prototype
});

User._collection = 'users'; // the mongo collection name

User.schema = Joi.object().keys({
	name: Joi.string(),
	image: Joi.string(),
	password: Joi.string().required(),
	email: Joi.string().email().required()
});

module.exports = User;
