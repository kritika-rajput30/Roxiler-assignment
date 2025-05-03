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
exports.getStoresByOwner = exports.deleteStore = exports.updateStore = exports.getStoreById = exports.getAllStores = exports.createStore = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// Create a new store
const createStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, email, userId, image } = req.body;
    try {
        const store = yield client_1.default.store.create({
            data: {
                name,
                address,
                email,
                image,
                owner: {
                    connect: { user_id: userId },
                },
            },
        });
        return res.status(201).json(store);
    }
    catch (error) {
        console.error("Create Store Error:", error);
        return res.status(500).json({ error: 'Failed to create store' });
    }
});
exports.createStore = createStore;
// Get all stores with optional filters
const getAllStores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address } = req.query;
    try {
        const stores = yield client_1.default.store.findMany({
            where: {
                name: name ? { contains: name, mode: 'insensitive' } : undefined,
                email: email ? { contains: email, mode: 'insensitive' } : undefined,
                address: address ? { contains: address, mode: 'insensitive' } : undefined,
            },
            include: {
                ratings: true,
            },
        });
        const storesWithRating = stores.map((store) => {
            const total = store.ratings.length;
            const avgRating = total > 0
                ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / total
                : null;
            return Object.assign(Object.assign({}, store), { averageRating: avgRating, totalRatings: total });
        });
        res.json(storesWithRating);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});
exports.getAllStores = getAllStores;
// Get store by ID
const getStoreById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const store = yield client_1.default.store.findUnique({
            where: { storeId: id },
            include: {
                ratings: true,
                user: true,
            },
        });
        if (!store)
            return res.status(404).json({ error: 'Store not found' });
        const avgRating = store.ratings.length > 0
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
                store.ratings.length
            : null;
        res.json(Object.assign(Object.assign({}, store), { averageRating: avgRating }));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch store' });
    }
});
exports.getStoreById = getStoreById;
// Update store (Only by owner or admin)
const updateStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, address, email } = req.body;
    const user = req.user; // from auth middleware
    try {
        const store = yield client_1.default.store.findUnique({ where: { storeId: id } });
        if (!store)
            return res.status(404).json({ error: 'Store not found' });
        if (user.role !== 'admin' && user.userId !== store.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const updated = yield client_1.default.store.update({
            where: { storeId: id },
            data: { name, address, email },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update store' });
    }
});
exports.updateStore = updateStore;
// Delete store (Only by owner or admin)
const deleteStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    try {
        const store = yield client_1.default.store.findUnique({ where: { storeId: id } });
        if (!store)
            return res.status(404).json({ error: 'Store not found' });
        if (user.role !== 'admin' && user.userId !== store.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        yield client_1.default.store.delete({ where: { storeId: id } });
        res.json({ message: 'Store deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete store' });
    }
});
exports.deleteStore = deleteStore;
const getStoresByOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.params;
    try {
        // Optional: verify authenticated user matches userId (authorization)
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id) !== userId) {
            return res.status(403).json({ error: 'Forbidden: You can only view your own stores' });
        }
        const stores = yield client_1.default.store.findMany({
            where: {
                user_id: userId,
            },
        });
        return res.status(200).json(stores);
    }
    catch (error) {
        console.error('Get Stores by Owner Error:', error);
        return res.status(500).json({ error: 'Failed to retrieve stores' });
    }
});
exports.getStoresByOwner = getStoresByOwner;
