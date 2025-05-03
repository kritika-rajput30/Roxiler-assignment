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
exports.getStores = exports.getUserDetails = exports.getUsers = exports.addUser = exports.getDashboardStats = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const hash_1 = require("../utils/hash");
// Get Dashboard Stats
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield client_1.default.user.count();
        const totalStores = yield client_1.default.store.count();
        const totalRatings = yield client_1.default.rating.count();
        res.json({ totalUsers, totalStores, totalRatings });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
});
exports.getDashboardStats = getDashboardStats;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, address, role } = req.body;
    try {
        const userExists = yield client_1.default.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = yield (0, hash_1.hashPassword)(password);
        const newUser = yield client_1.default.user.create({
            data: {
                name,
                email,
                address,
                password: hashedPassword,
                role,
            },
        });
        res.status(201).json({ message: 'User created', user: newUser });
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});
exports.addUser = addUser;
// Get List of Users with Optional Filters
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address, role } = req.query;
    try {
        const users = yield client_1.default.user.findMany({
            where: {
                name: { contains: name, mode: 'insensitive' },
                email: { contains: email, mode: 'insensitive' },
                address: { contains: address, mode: 'insensitive' },
                role: role ? role : undefined,
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});
exports.getUsers = getUsers;
// Get User Details (with Rating if owner)
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield client_1.default.user.findUnique({
            where: { id },
            include: {
                Store: {
                    include: {
                        ratings: true,
                    },
                },
            },
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const ratingAvg = user.role === 'owner' && user.Store
            ? user.Store.ratings.reduce((acc, r) => acc + r.rating, 0) /
                user.Store.ratings.length || 0
            : null;
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
            rating: ratingAvg,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching user details' });
    }
});
exports.getUserDetails = getUserDetails;
// Get List of Stores with Optional Filters
const getStores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address } = req.query;
    try {
        const stores = yield client_1.default.store.findMany({
            where: {
                name: { contains: name, mode: 'insensitive' },
                email: { contains: email, mode: 'insensitive' },
                address: { contains: address, mode: 'insensitive' },
            },
            include: {
                ratings: true,
            },
        });
        const storeList = stores.map((store) => {
            const avgRating = store.ratings.reduce((acc, r) => acc + r.rating, 0) /
                store.ratings.length || 0;
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                rating: avgRating.toFixed(2),
            };
        });
        res.json(storeList);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching stores' });
    }
});
exports.getStores = getStores;
