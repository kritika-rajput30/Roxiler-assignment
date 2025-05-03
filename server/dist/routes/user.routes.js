"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.get(
  "/",
  auth_middleware_1.authenticate,
  (0, role_middleware_1.authorize)(["admin"]),
  user_controller_1.getAllUsers
);
router.get(
  "/:id",
  auth_middleware_1.authenticate,
  (0, role_middleware_1.authorize)(["admin"]),
  user_controller_1.getUserById
);
router.put(
  "/password",
  auth_middleware_1.authenticate,
  user_controller_1.updatePassword
);
exports.default = router;
