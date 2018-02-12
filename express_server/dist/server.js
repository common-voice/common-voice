"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const CommonVoiceConfig = require("./config-helper");
const index_1 = require("./routes/index");
const app = express();
const PORT = CommonVoiceConfig.SERVER_PORT || 3000;
app.use('/api', index_1.default);
app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map