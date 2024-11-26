const express = require('express');
const { listMenu } = require('../controllers/menuController.js');

const menuRouter = express.Router();

menuRouter.get("/list", listMenu);

module.exports = menuRouter;