import express from "express";

import {
    createBooking,
    getBookings,
    getBookingById,
    cancelBooking,
    rescheduleBooking,
} from "../controllers/bookingController.js";

import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

/* View Bookings */
router.get(
    "/",
    auth,
    role("Admin", "Asset Manager", "Department Head", "Employee"),
    getBookings
);

router.get(
    "/:id",
    auth,
    role("Admin", "Asset Manager", "Department Head", "Employee"),
    getBookingById
);

/* Create Booking */
router.post(
    "/",
    auth,
    role("Department Head", "Employee"),
    createBooking
);

/* Cancel Booking */
router.put(
    "/cancel/:id",
    auth,
    role("Department Head", "Employee"),
    cancelBooking
);

/* Reschedule Booking */
router.put(
    "/reschedule/:id",
    auth,
    role("Department Head", "Employee"),
    rescheduleBooking
);

export default router;