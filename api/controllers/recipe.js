'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Category = require('../models/category');
var Recipe = require('../models/recipe');
var User = require('../models/user');

function getRecipe(req, res) {

	var recipeId = req.params.id;

	Recipe.findById(recipeId).populate('author').populate('category').exec((err, recipe) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});		
		}else{
			if (!recipe) {
				res.status(404).send({message: '¡La receta no existe!'});	
			}else{
				res.status(200).send({recipe});
			}
		}
	});	
}

// Listar todas las recetas
function getAllRecipes(req, res) {

	if (req.params.page) {
		var page = req.params.page;	
	}else{
		var page = 1;
	}

	var itemsPerPage = 12;
	
	Recipe.find().sort({date: -1}).paginate(page, itemsPerPage, function(err, recipes, total){
		if (err) {
			res.status(500).send({message: 'Error en la petición'});		
		}else{
			if (!recipes) {
				res.status(404).send({message: '¡No hay recetas!'});	
			}else{
				return res.status(200).send({
					total_items: total,
					recipes: recipes
				});
			}	
		}
	});
}


// Listar todas las recetas cuyo titulo empiece por el parametro introducido
function getRecipesByTitle(req, res) {
	
	var title = req.params.title;	

	if (!title) {
		var find = Recipe.find({}).sort('title');
	}else{		
		var find = Recipe.find({title: new RegExp('^'+title, 'i')}).sort('title');
	}

	find.exec(function(err, recipes){
		if (err) {
			res.status(500).send({message: 'Error en la petición'});		
		}else{
			if (!recipes) {
				res.status(404).send({message: '¡No hay recetas!'});	
			}else{
				res.status(200).send({recipes});
			}	
		}
	});	
}


function saveRecipe(req, res){		

	var recipe = new Recipe();

	var params = req.body;
	recipe.title = params.title;
	recipe.image = 'null';
	recipe.date = params.date;
	recipe.description = params.description;
	recipe.ingredients = params.ingredients;
	recipe.directions = params.directions;		
	recipe.author = params.author;	
	recipe.category = params.category;		


	recipe.save((err, recipeStored) => {
		if (err) {
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if (!recipeStored) {
				res.status(404).send({message: 'NO se ha guardado la receta'});
			}else{
				res.status(200).send({recipe: recipeStored});	
			}
		}
	});
}

function updateRecipe(req, res){
	var recipeId = req.params.id;
	var update = req.body;

	Recipe.findByIdAndUpdate(recipeId, update, (err, recipeUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if (!recipeUpdated) {
				res.status(404).send({message: 'NO se ha actualizado la receta'});
			}else{
				res.status(200).send({recipe: recipeUpdated});	
			}
		}
	});
}

function deleteRecipe(req, res){
	var recipeId = req.params.id;
	Recipe.findByIdAndRemove(recipeId, (err, recipeRemoved) =>{
		if (err) {
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if (!recipeRemoved) {
				res.status(404).send({message: 'NO se ha borrado la receta'});
			}else{
				res.status(200).send({recipe: recipeRemoved});	
			}
		}
	});
}

function uploadImage(req, res){
	var recipeId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

			Recipe.findByIdAndUpdate(recipeId, {image: file_name}, (err, recipeUpdated) => {
				if(!recipeUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar la receta'});	
				}else{
					res.status(200).send({image: file_name, recipe: recipeUpdated});	
				}
			});

		}else{
			res.status(200).send({message: 'Extensión del archivo no válida'});		
		}

	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});	
	}
}


function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/recipes/'+imageFile;
	fs.exists(path_file, function(exists){

		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});			
		}
	});
}

module.exports = {
	getRecipe,	
	getAllRecipes,
	getRecipesByTitle,
	saveRecipe,	
	updateRecipe,
	deleteRecipe,
	uploadImage,
	getImageFile
};