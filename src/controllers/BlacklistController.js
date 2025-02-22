const CRUDController = require('../core/CRUDController');
const Blacklist = require('../models/Blacklist');

module.exports = CRUDController(Blacklist);