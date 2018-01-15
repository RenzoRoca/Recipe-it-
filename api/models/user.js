'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,		
	email: String,
	password: String,
	role: String,
	image: String,
	description: String,
	recipes: [{ type: Schema.Types.Object, ref: 'Recipe'}]	
});

module.exports = mongoose.model('User', UserSchema);