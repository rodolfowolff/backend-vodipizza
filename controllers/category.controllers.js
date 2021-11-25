const Category = require('../models/category.model');
const Product = require('../models/product.model');

const slugify = require('slugify');
const initials = require('initials');

const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).exec();
    const products = await Product.find({ category }).populate('category').exec();
    res.json({ category, products });
  } catch (error) {
    res.status(400).send('Falha na requisição de categorias por slug');
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.json(categories);
  } catch (error) {
    res.status(400).send('Falha na requisição de categorias');
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deletedCategory);
  } catch (error) {
    res.status(400).send('A remoção desta categoria falhou');
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name, { lower: true }),
      initials: initials(name),
    }).save();
    res.json(category);
  } catch (error) {
    res.status(400).send('A criação desta categoria falhou');
  }
};

const updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name, { lower: true }), initials: initials(name) },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).send('As atualizações para esta categoria falharam');
  }
};

module.exports = {
  getCategoryBySlug,
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
};
