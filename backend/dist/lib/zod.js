"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodInputError = void 0;
const zodInputError = (zodError, res) => {
    const error = zodError.format();
    console.log("Invalid inputs: ", error);
    return res.status(400).json({ message: "Bad request(Invalid inputs): ", error }); //remove printing error in prod phase
};
exports.zodInputError = zodInputError;
