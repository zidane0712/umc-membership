"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORT]
const mongoose_1 = require("mongoose");
const CounterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});
// [EXPORT]
exports.default = (0, mongoose_1.model)("Counter", CounterSchema);
//# sourceMappingURL=Counter.js.map