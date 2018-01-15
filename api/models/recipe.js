'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecipeSchema = Schema({
	title: String,		
	image: String,
	date: { type: Date, default: Date.now },
	description: String,
	ingredients: [String],
	directions: [String],	
	category: { type: Schema.Types.ObjectId, ref: "Category" }, 
	author: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Recipe', RecipeSchema);