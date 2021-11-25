const Product = require('../models/product.model');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

const createUserCart = async (req, res) => {
  const { cart } = req.body;
  const { cartProducts, userDeliveryDate } = cart;
  const user = await User.findOne({ email: req.user.email }).exec();
  const userHasCart = await Cart.findOne({ orderedBy: user._id }).exec();

  if (userHasCart) {
    userHasCart.remove();
  }

  const updatedAndCheckedCart = await Promise.all(
    cartProducts.map(async (product) => {
      const { productSpecifics } = await Product.findById(product?._id)
        .select('productSpecifics')
        .exec();
      if (product?.share) {
        const shareObject = productSpecifics?.filteredShares.find(
          (pShare) => pShare?.share === product?.share
        );
        return {
          ...product,
          price: Number(shareObject?.price),
        };
      } else {
        return {
          ...product,
          price: Number(productSpecifics?.price),
        };
      }
    })
  );

  const cartTotal = updatedAndCheckedCart.reduce(
    (acc, cv) => acc + Number(cv?.price) * Number(cv?.quantity),
    0
  );

  try {
    const createdCart = await new Cart({
      products: updatedAndCheckedCart,
      cartTotal,
      orderedBy: user._id,
      requestedDate: userDeliveryDate,
    }).save();
    res.status(201).json(createdCart);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOne({ orderedBy: user._id }).exec();
  res.status(200).json(cart);
};

const emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
  res.status(200).json(cart);
};

module.exports = {
  createUserCart,
  getUserCart,
  emptyCart,
};
