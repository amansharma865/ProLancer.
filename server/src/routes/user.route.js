const express = require('express');
const { userMiddleware, verifyToken } = require('../middlewares');
const { deleteUser, updateUser, changePassword } = require('../controllers/user.controller');

const app = express.Router();

app.delete('/:_id', userMiddleware, deleteUser);
app.put('/update', userMiddleware, updateUser);
app.put('/change-password', userMiddleware, changePassword);

module.exports = app;