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
exports.updateRating = exports.getStoreRatingStats = exports.getAllRatings = exports.addRating = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// Add a rating to a store
const addRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, rating, comment, userId } = req.body;
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    try {
        const store = yield client_1.default.store.findUnique({ where: { store_id: storeId } });
        if (!store)
            return res.status(404).json({ error: "Store not found" });
        const newRating = yield client_1.default.rating.create({
            data: {
                rating,
                comment,
                user_id: userId,
                store_id: storeId,
            },
        });
        res.status(201).json(newRating);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add rating" });
    }
});
exports.addRating = addRating;
// Get all ratings (with optional filters)
const getAllRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, userId } = req.query;
    try {
        const ratings = yield client_1.default.rating.findMany({
            where: {
                store_id: storeId ? String(storeId) : undefined,
                user_id: userId ? String(userId) : undefined,
            },
            include: {
                user: true,
                store: true,
            },
        });
        res.json(ratings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});
exports.getAllRatings = getAllRatings;
// Get average rating for a store
const getStoreRatingStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    try {
        const ratings = yield client_1.default.rating.findMany({
            where: { store_id: storeId },
        });
        if (ratings.length === 0) {
            return res.status(404).json({ message: 'No ratings for this store' });
        }
        const average = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
        res.json({
            storeId,
            averageRating: average.toFixed(2),
            totalRatings: ratings.length,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch rating stats' });
    }
});
exports.getStoreRatingStats = getStoreRatingStats;
// Update a rating by its ID
// Update a rating by its ID
const updateRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, comment } = req.body;
    const { id } = req.params;
    // Validate the rating range (1 to 5)
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    try {
        // Find the existing rating by rating_id (which is a string)
        const existingRating = yield client_1.default.rating.findUnique({ where: { rating_id: id } });
        if (!existingRating) {
            return res.status(404).json({ error: "Rating not found" });
        }
        // Update the rating and comment
        const updatedRating = yield client_1.default.rating.update({
            where: { rating_id: id }, // Use rating_id as the key
            data: {
                rating,
                comment,
            },
        });
        res.json(updatedRating);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update rating" });
    }
});
exports.updateRating = updateRating;
