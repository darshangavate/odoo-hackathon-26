import express from "express";

import {
    createMaintenance,
    getMaintenances,
    getMaintenanceById,
    approveMaintenance,
    rejectMaintenance,
    startMaintenance,
    resolveMaintenance,
} from "../controllers/maintenanceController.js";

import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* View Maintenance Requests */
router.get(
    "/",
    auth,
    role("Admin", "Asset Manager", "Department Head"),
    getMaintenances
);

router.get(
    "/:id",
    auth,
    role("Admin", "Asset Manager", "Department Head", "Employee"),
    getMaintenanceById
);

/* Raise Maintenance Request */
router.post(
    "/",
    auth,
    role("Employee", "Department Head", "Asset Manager"),
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        },
    ]),
    createMaintenance
);

/* Approve Request */
router.put(
    "/approve/:id",
    auth,
    role("Asset Manager"),
    approveMaintenance
);

/* Reject Request */
router.put(
    "/reject/:id",
    auth,
    role("Asset Manager"),
    rejectMaintenance
);

/* Assign Technician & Start */
router.put(
    "/start/:id",
    auth,
    role("Asset Manager"),
    startMaintenance
);

/* Resolve Maintenance */
router.put(
    "/resolve/:id",
    auth,
    role("Asset Manager"),
    resolveMaintenance
);

export default router;