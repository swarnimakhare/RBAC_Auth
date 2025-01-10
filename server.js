const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

// Importing routes and models
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// App setup
const app = express();
app.use(express.json());
app.use(cors());
app.use(session({ secret: 'rbac-secret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Database connection
mongoose.connect('mongodb://localhost:27017/rbac_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error(err));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Starting server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
