"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(['admin']));
router.get('/dashboard', admin_controller_1.getDashboardStats);
router.post('/users', admin_controller_1.addUser);
router.get('/users', admin_controller_1.getUsers);
router.get('/users/:id', admin_controller_1.getUserDetails);
router.get('/stores', admin_controller_1.getStores);
exports.default = router;
