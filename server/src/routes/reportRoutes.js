import express from "express";

import {
    getReportDashboard,
    exportReportCSV,
} from "../controllers/reportController.js";

import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

router.get(
    "/dashboard",
    auth,
    role("Admin"),
    getReportDashboard
);

router.get(
    "/export",
    auth,
    role("Admin"),
    exportReportCSV
);

export default router;