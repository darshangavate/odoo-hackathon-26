import express from "express";

import {
    createAudit,
    getAudits,
    getAuditById,
    verifyAsset,
    closeAudit,
} from "../controllers/auditController.js";

import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

/* View Audit Cycles */
router.get(
    "/",
    auth,
    role("Admin", "Asset Manager"),
    getAudits
);

router.get(
    "/:id",
    auth,
    role("Admin", "Asset Manager"),
    getAuditById
);

/* Create Audit Cycle */
router.post(
    "/",
    auth,
    role("Admin"),
    createAudit
);

/* Verify Asset */
router.put(
    "/verify/:id",
    auth,
    role("Admin", "Asset Manager"),
    verifyAsset
);

/* Close Audit Cycle */
router.put(
    "/close/:id",
    auth,
    role("Admin"),
    closeAudit
);

export default router;