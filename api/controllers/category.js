'use strict'

var path = require('path');
var fs = require('fs');
var Category = require('../models/category');
var Recipe = require('../models/recipe');

function getCategory(req, res) {
	var categoryId = req.params.id;

	Category.findById(categoryId, (err, category)=>{
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if (!category) {
				res.status(404).send({message: 'La categoría no existe'});
			}else{
				res.status(200).send({category});
			}
		}
	});
}

function getCategories(req, res) {

	Category.find({}).sort('name').exec(function(err, categories){
		if (err) {
			res.status(500).send({message: "Error en la petición."});
		}else{
			if (!categories) {
				res.status(404).send({message: "NO hay categorias !!"});	
			}else{
				return res.status(200).send({			
					categories: categories
				});	
			}
		}
	});
}

function getCategoryRecipes(req, res) {

	var categoryId = req.params.id;	
	
	Recipe.find({ category: categoryId }).sort('title').populate({path: 'recetas'}).exec(function(err, recipes){
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

function saveCategory(req, res){
	var category = new Category();

	var params = req.body;
	category.name = params.name;
	category.image = params.image;

	category.save((err, categoryStored) =>{
		if (err) {
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if (!categoryStored) {
				res.status(404).send({message: 'No se ha guardado la categoría'});	
			}else{
				res.status(200).send({category: categoryStored});
			}
		}
	});
}

function updateCategory(req, res){
	var categoryId = req.params.id;
	var update = req.body;

	Category.findByIdAndUpdate(categoryId, update, (err, categoryUpdated) =>{
		if (err) {
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if (!categoryUpdated) {
				res.status(404).send({message: 'No se ha actualizado la categoría'});	
			}else{
				res.status(200).send({category: categoryUpdated});
			}
		}
	});
}


function deleteCategory(req, res){
	var categoryId = req.params.id;

	Category.findByIdAndRemove(categoryId, (err, categoryRemoved)=>{
		if (err) {
			res.status(500).send({message: 'Error al eliminar la categoría'});
		}else{
			if (!categoryRemoved) {
				res.status(404).send({message: 'La categoría no ha sido eliminada'});	
			}else{
				res.status(200).send({category: categoryRemoved});						
			}
		}
	});
}

function uploadImage(req, res){
	var categoryId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

			Category.findByIdAndUpdate(categoryId, {image: file_name}, (err, categoryUpdated) => {
				if(!categoryUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar la categoria'});	
				}else{
					res.status(200).send({image: file_name, category: categoryUpdated});	
				}
			});

		}else{
			res.status(200).send({message: 'Extensión del archivo no válida'});		
		}

	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'});	
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/categories/'+imageFile;
	fs.exists(path_file, function(exists){

		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});			
		}
	});
}

module.exports = {
	getCategory,
	saveCategory,
	getCategories,
	getCategoryRecipes,
	updateCategory,
	deleteCategory,
	uploadImage,
	getImageFile
};