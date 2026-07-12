import asyncHandler from "express-async-handler";

import Maintenance from "../models/Maintenance.js";
import Asset from "../models/Asset.js";

export const createMaintenance = asyncHandler(async (req, res) => {
    const {
        asset,
        issue,
        priority,
        notes,
    } = req.body;

    if (!asset || !issue) {
        res.status(400);
        throw new Error("Asset and issue are required");
    }

    const selectedAsset = await Asset.findById(asset);

    if (!selectedAsset) {
        res.status(404);
        throw new Error("Asset not found");
    }

    if (
        [
            "Under Maintenance",
            "Lost",
            "Retired",
            "Disposed",
        ].includes(selectedAsset.status)
    ) {
        res.status(400);
        throw new Error("Maintenance request cannot be created for this asset");
    }

    const maintenance = await Maintenance.create({
        asset,
        raisedBy: req.user._id,
        issue,
        priority,
        notes,
        image: req.files?.image?.[0]?.filename || "",
    });

    const result = await Maintenance.findById(maintenance._id)
        .populate("asset", "assetTag name")
        .populate("raisedBy", "name email");

    res.status(201).json({
        success: true,
        message: "Maintenance request submitted",
        maintenance: result,
    });
});

export const getMaintenances = asyncHandler(async (req, res) => {
    const { status } = req.query;

    const filter =
        status && status !== "All"
            ? { status }
            : {};

    const maintenances = await Maintenance.find(filter)
        .populate("asset", "assetTag name status")
        .populate("raisedBy", "name")
        .populate("approvedBy", "name")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: maintenances.length,
        maintenances,
    });
});

export const getMaintenanceById = asyncHandler(async (req, res) => {
    const maintenance = await Maintenance.findById(req.params.id)
        .populate("asset")
        .populate("raisedBy", "name email")
        .populate("approvedBy", "name");

    if (!maintenance) {
        res.status(404);
        throw new Error("Maintenance request not found");
    }

    res.status(200).json({
        success: true,
        maintenance,
    });
});

export const approveMaintenance = asyncHandler(async (req, res) => {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
        res.status(404);
        throw new Error("Maintenance request not found");
    }

    if (maintenance.status !== "Pending") {
        res.status(400);
        throw new Error("Request already processed");
    }

    const asset = await Asset.findById(maintenance.asset);

    maintenance.status = "Approved";
    maintenance.approvedBy = req.user._id;

    asset.status = "Under Maintenance";

    await maintenance.save();
    await asset.save();

    res.status(200).json({
        success: true,
        message: "Maintenance request approved",
        maintenance,
    });
});

export const rejectMaintenance = asyncHandler(async (req, res) => {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
        res.status(404);
        throw new Error("Maintenance request not found");
    }

    if (maintenance.status !== "Pending") {
        res.status(400);
        throw new Error("Request already processed");
    }

    maintenance.status = "Rejected";
    maintenance.approvedBy = req.user._id;

    await maintenance.save();

    res.status(200).json({
        success: true,
        message: "Maintenance request rejected",
        maintenance,
    });
});

export const startMaintenance = asyncHandler(async (req, res) => {
    const { technician } = req.body;

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
        res.status(404);
        throw new Error("Maintenance request not found");
    }

    if (maintenance.status !== "Approved") {
        res.status(400);
        throw new Error("Maintenance must be approved first");
    }

    maintenance.technician = technician || "";
    maintenance.status = "In Progress";

    await maintenance.save();

    res.status(200).json({
        success: true,
        message: "Maintenance started",
        maintenance,
    });
});

export const resolveMaintenance = asyncHandler(async (req, res) => {
    const { resolution, notes } = req.body;

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
        res.status(404);
        throw new Error("Maintenance request not found");
    }

    if (maintenance.status !== "In Progress") {
        res.status(400);
        throw new Error("Maintenance is not in progress");
    }

    const asset = await Asset.findById(maintenance.asset);

    maintenance.status = "Resolved";
    maintenance.resolution = resolution || "";
    maintenance.notes = notes || "";

    asset.status = "Available";

    await maintenance.save();
    await asset.save();

    const updatedMaintenance = await Maintenance.findById(maintenance._id)
        .populate("asset", "assetTag name")
        .populate("raisedBy", "name")
        .populate("approvedBy", "name");

    res.status(200).json({
        success: true,
        message: "Maintenance completed successfully",
        maintenance: updatedMaintenance,
    });
});