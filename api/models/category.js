'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
	name: String,
	image: String,
	recipes: [{ type: Schema.Types.Object, ref: 'Recipe'}]
});

module.exports = mongoose.model('Category', CategorySchema);