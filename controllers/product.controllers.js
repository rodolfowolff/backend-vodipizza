const Product = require('../models/product.model');
const slugify = require('slugify');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(Number(req.query.size))
      .populate('category')
      .sort([['createdAt', 'desc']])
      .exec();
    if (!products) {
      return res.status(404).json({ message: 'Produtos não encontrados' });
    }
    res.status(201).json(products);
  } catch (error) {
    res.status(400).send('Falha na requisição de produtos');
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .exec();
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteProduct = async (req, res) => {
  if (!req.user) return res.status(400).json({ msg: "Invalid Authentication." });
  try {
    const deletedProduct = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(201).json(deletedProduct);
  } catch (error) {
    res.status(404).send(error);
  }
};

const createProduct = async (req, res) => {
  if (!req.user) return res.status(400).json({ msg: "Invalid Authentication." });
  try {
    req.body.slug = slugify(req.body.title, { lower: true });
    const product = new Product(req.body);
    const findProduct = await Product.findOne({ slug: req.body.slug });
    if (findProduct)
      return res.status(400).json({ msg: 'Produto já existe.' });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).send('A criação do produto falhou. Tente novamente');
  }
};

const updateProduct = async (req, res) => {
  if (!req.user) return res.status(400).json({ msg: "Invalid Authentication." });
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true });
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(400).json({ msg: 'Falha ao atualizar produto.' });
    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(400).send('As atualizações para este produto falharam');
  }
};

const getSortedProducts = async (req, res) => {
  try {
    const { sort, order, pageNumber } = req.query;
    const page = Number(pageNumber) || 1;
    const pageSize = 3;

    const count = await Product.find({}).estimatedDocumentCount().exec();
    const products = await Product.find({})
      .skip(pageSize * (page - 1))
      .populate('category')
      .sort([[sort, order]])
      .limit(pageSize)
      .exec();
    res.status(201).json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  deleteProduct,
  createProduct,
  updateProduct,
  getSortedProducts,
};
