import asyncHandler from "express-async-handler";

import Asset from "../models/Asset.js";
import Allocation from "../models/Allocation.js";
import Booking from "../models/Booking.js";
import Maintenance from "../models/Maintenance.js";

export const getReportDashboard = asyncHandler(async (req, res) => {
    const today = new Date();

    const [
        totalAssets,
        availableAssets,
        allocatedAssets,
        maintenanceAssets,
        retiredAssets,

        mostUsedAssets,
        idleAssets,

        maintenanceFrequency,

        dueMaintenance,

        nearingRetirement,

        departmentSummary,

        bookingHeatmap,
    ] = await Promise.all([
        Asset.countDocuments(),

        Asset.countDocuments({
            status: "Available",
        }),

        Asset.countDocuments({
            status: "Allocated",
        }),

        Asset.countDocuments({
            status: "Under Maintenance",
        }),

        Asset.countDocuments({
            status: "Retired",
        }),

        Allocation.aggregate([
            {
                $group: {
                    _id: "$asset",
                    totalAllocations: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    totalAllocations: -1,
                },
            },
            {
                $limit: 5,
            },
            {
                $lookup: {
                    from: "assets",
                    localField: "_id",
                    foreignField: "_id",
                    as: "asset",
                },
            },
            {
                $unwind: "$asset",
            },
        ]),

        Asset.find({
            status: "Available",
        })
            .sort({
                updatedAt: 1,
            })
            .limit(5),

        Maintenance.aggregate([
            {
                $group: {
                    _id: "$asset",
                    maintenanceCount: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    maintenanceCount: -1,
                },
            },
        ]),

        Asset.find({
            nextMaintenanceDate: {
                $lte: today,
            },
        })
            .populate("category", "name")
            .populate("department", "name"),

        Asset.find({
            retirementDate: {
                $lte: new Date(
                    today.getTime() +
                        30 * 24 * 60 * 60 * 1000
                ),
            },
        })
            .populate("category", "name")
            .populate("department", "name"),

        Allocation.aggregate([
            {
                $lookup: {
                    from: "assets",
                    localField: "asset",
                    foreignField: "_id",
                    as: "asset",
                },
            },
            {
                $unwind: "$asset",
            },
            {
                $group: {
                    _id: "$asset.department",
                    totalAllocated: {
                        $sum: 1,
                    },
                },
            },
        ]),

        Booking.aggregate([
            {
                $group: {
                    _id: {
                        hour: {
                            $hour: "$startTime",
                        },
                    },
                    bookings: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    "_id.hour": 1,
                },
            },
        ]),
    ]);

    res.status(200).json({
        success: true,

        summary: {
            totalAssets,
            availableAssets,
            allocatedAssets,
            maintenanceAssets,
            retiredAssets,
        },

        mostUsedAssets,

        idleAssets,

        maintenanceFrequency,

        dueMaintenance,

        nearingRetirement,

        departmentSummary,

        bookingHeatmap,
    });
});
import { exportCSV } from "../utils/exportCSV.js";

export const exportReportCSV = asyncHandler(async (req, res) => {
    const assets = await Asset.find()
        .populate("category", "name")
        .populate("department", "name");

    const data = assets.map(asset => ({
        AssetTag: asset.assetTag,
        Name: asset.name,
        Category: asset.category?.name || "",
        Department: asset.department?.name || "",
        Status: asset.status,
        Condition: asset.condition,
        Location: asset.location,
        AcquisitionCost: asset.acquisitionCost,
        NextMaintenanceDate:
            asset.nextMaintenanceDate?.toISOString().split("T")[0] || "",
        RetirementDate:
            asset.retirementDate?.toISOString().split("T")[0] || "",
    }));

    exportCSV(data, "assets-report.csv", res);
});