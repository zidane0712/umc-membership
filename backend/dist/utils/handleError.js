"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
// [FUNCTION]
function handleError(res, err, defaultMessage = "An unexpected error occurred") {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    }
    else {
        res.status(500).json({ message: defaultMessage });
    }
}
//# sourceMappingURL=handleError.js.map