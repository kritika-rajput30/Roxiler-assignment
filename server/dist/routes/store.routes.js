"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const store_controller_1 = require("../controllers/store.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(['admin', 'owner']), store_controller_1.createStore);
router.get('/', auth_middleware_1.authenticate, store_controller_1.getAllStores);
router.get('/:id', auth_middleware_1.authenticate, store_controller_1.getStoreById);
router.put('/:id', auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(['admin', 'owner']), store_controller_1.updateStore);
router.delete('/:id', auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(['admin', 'owner']), store_controller_1.deleteStore);
router.get('/owner/:userId', auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(['admin', 'owner']), store_controller_1.getStoresByOwner);
exports.default = router;
