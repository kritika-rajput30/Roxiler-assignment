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
exports.getUserById = exports.updatePassword = exports.getAllUsers = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// GET /api/users - Admin only - List all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, address, role } = req.query;
        const users = yield client_1.default.user.findMany({
            where: {
                name: name ? { contains: String(name), mode: 'insensitive' } : undefined,
                email: email ? { contains: String(email), mode: 'insensitive' } : undefined,
                address: address ? { contains: String(address), mode: 'insensitive' } : undefined,
                role: role ? String(role) : undefined,
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                ratings: true, // optional
            },
            orderBy: {
                name: 'asc',
            },
        });
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
// PUT /api/users/password - Update password (logged-in user)
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { newPassword } = req.body;
        if (!newPassword)
            return res.status(400).json({ error: 'New password is required' });
        yield client_1.default.user.update({
            where: { id: userId },
            data: {
                password: newPassword, // 🔒 You should hash this in production
            },
        });
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update password' });
    }
});
exports.updatePassword = updatePassword;
// GET /api/users/:id - Admin only - Get user details (including rating if store owner)
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield client_1.default.user.findUnique({
            where: { id },
            include: {
                store: true,
                ratings: true,
            },
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
exports.getUserById = getUserById;
