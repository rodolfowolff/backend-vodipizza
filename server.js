const cloudinary = require('cloudinary').v2;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const connectDB = require('./config/db');
connectDB();

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const imageRoutes = require('./routes/image.routes');
const cartRoutes = require('./routes/cart.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

// Middleware
const app = express();
app.use(express.json({ limit: '50mb' }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: `${process.env.BASE_URL}`,
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/product', productRoutes);
app.use('/images', imageRoutes);
app.use('/cart', cartRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({
    author: "Rodolfo Wolff",
    message: "Olá, bem vindo ao server vo di pizza!",
  });
});

// Server listenning
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
