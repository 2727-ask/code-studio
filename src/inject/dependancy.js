const express = require('express');
const path = require('path');

const dependancyInjector = function DependancyInjector(app){
    app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
    app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
}

module.exports = dependancyInjector;