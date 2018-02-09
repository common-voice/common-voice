"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const status_1 = require("./status");
const route = express_1.Router();
route.use('/status', status_1.default);
exports.default = route;
//# sourceMappingURL=index.js.map