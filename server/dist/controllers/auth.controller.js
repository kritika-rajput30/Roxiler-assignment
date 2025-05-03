"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const client_1 = __importDefault(require("../prisma/client"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address, password } = req.body;
    // Ensure all fields are provided
    if (!name || !email || !address || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if the email is already registered
    const exists = yield client_1.default.user.findUnique({ where: { email } });
    if (exists)
        return res.status(400).json({ message: 'Email already registered' });
    // Hash the password before saving it
    const hashed = yield (0, hash_1.hashPassword)(password);
    // Create the new user
    const user = yield client_1.default.user.create({
        data: {
            name,
            email,
            address,
            password: hashed,
            role: 'user', // default role
        },
    });
    // Generate JWT token
    const token = (0, jwt_1.generateToken)({ user_id: user.user_id, role: user.role });
    // Return the token and user details (including role)
    res.status(201).json({
        token,
        user: {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if the user exists by email
    const user = yield client_1.default.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ message: 'Invalid email or password' });
    // Compare password with stored hash
    const isValid = yield (0, hash_1.comparePassword)(password, user.password);
    if (!isValid)
        return res.status(401).json({ message: 'Invalid email or password' });
    // Generate JWT token
    const token = (0, jwt_1.generateToken)({ user_id: user.user_id, role: user.role });
    // Return the token and user details (including role)
    res.status(200).json({
        token,
        user: {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
exports.login = login;
