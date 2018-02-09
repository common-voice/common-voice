"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Router = express.Router();
Router.get('/', (req, res) => {
    res.json({
        status: 'working',
        timestamp: +new Date()
    });
});
exports.default = Router;
//# sourceMappingURL=status.js.map