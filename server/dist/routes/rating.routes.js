"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rating_controller_1 = require("../controllers/rating.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticate, rating_controller_1.addRating);
router.put('/:id', auth_middleware_1.authenticate, rating_controller_1.updateRating); // Update rating
router.get('/', auth_middleware_1.authenticate, rating_controller_1.getAllRatings);
router.get('/stats/:storeId', auth_middleware_1.authenticate, rating_controller_1.getStoreRatingStats);
exports.default = router;
