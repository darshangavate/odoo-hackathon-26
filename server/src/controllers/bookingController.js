import asyncHandler from "express-async-handler";

import Booking from "../models/Booking.js";
import Asset from "../models/Asset.js";

export const createBooking = asyncHandler(async (req, res) => {
    const {
        asset,
        startTime,
        endTime,
        purpose,
    } = req.body;

    if (!asset || !startTime || !endTime) {
        res.status(400);
        throw new Error("All required fields are mandatory");
    }

    const selectedAsset = await Asset.findById(asset);

    if (!selectedAsset) {
        res.status(404);
        throw new Error("Asset not found");
    }

    if (!selectedAsset.shared) {
        res.status(400);
        throw new Error("This asset cannot be booked");
    }

    const overlap = await Booking.findOne({
        asset,
        status: { $ne: "Cancelled" },
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
    });

    if (overlap) {
        res.status(400);
        throw new Error("Selected time slot is already booked");
    }

    const booking = await Booking.create({
        asset,
        bookedBy: req.user._id,
        startTime,
        endTime,
        purpose,
    });

    const result = await Booking.findById(booking._id)
        .populate("asset", "assetTag name")
        .populate("bookedBy", "name email");

    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking: result,
    });
});

export const getBookings = asyncHandler(async (req, res) => {
    const { status } = req.query;

    const filter =
        status && status !== "All"
            ? { status }
            : {};

    const bookings = await Booking.find(filter)
        .populate("asset", "assetTag name")
        .populate("bookedBy", "name email")
        .sort({ startTime: 1 });

    res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
    });
});

export const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate("asset")
        .populate("bookedBy", "name email role");

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    res.status(200).json({
        success: true,
        booking,
    });
});

export const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    if (booking.status === "Cancelled") {
        res.status(400);
        throw new Error("Booking already cancelled");
    }

    booking.status = "Cancelled";

    await booking.save();

    res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        booking,
    });
});

export const rescheduleBooking = asyncHandler(async (req, res) => {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
        res.status(400);
        throw new Error("Start time and End time are required");
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    if (booking.status === "Cancelled") {
        res.status(400);
        throw new Error("Cancelled booking cannot be rescheduled");
    }

    const overlap = await Booking.findOne({
        _id: { $ne: booking._id },
        asset: booking.asset,
        status: { $ne: "Cancelled" },
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
    });

    if (overlap) {
        res.status(400);
        throw new Error("Selected time slot is already booked");
    }

    booking.startTime = startTime;
    booking.endTime = endTime;

    const now = new Date();

    if (new Date(endTime) <= now) {
        booking.status = "Completed";
    } else if (
        new Date(startTime) <= now &&
        new Date(endTime) > now
    ) {
        booking.status = "Ongoing";
    } else {
        booking.status = "Upcoming";
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
        .populate("asset", "assetTag name")
        .populate("bookedBy", "name email");

    res.status(200).json({
        success: true,
        message: "Booking rescheduled successfully",
        booking: updatedBooking,
    });
});