const express = require("express");
const router = express.Router();
const {
  createTrip,
  deleteTrip,
  getMyTrips,
  addExpense,
  getBudgetPrediction,
  togglePublic,
  getPublicTrips,
  toggleLike,
  addComment,
  deleteExpense,
  addItinerary,
  deleteItinerary,
  updateItinerary,
  addItineraryExpense,
  deleteItineraryExpense,
} = require("../controllers/tripController");




const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createTrip);
router.get("/my", authMiddleware, getMyTrips);
router.post("/:tripId/expense", authMiddleware, addExpense);
router.get("/prediction/:destination", getBudgetPrediction);
router.put("/:tripId/toggle-public", authMiddleware, togglePublic);
router.get("/public", getPublicTrips);
router.put("/:tripId/like", authMiddleware, toggleLike);
router.post("/:tripId/comment", authMiddleware, addComment);
router.delete("/:tripId/expense/:expenseId", authMiddleware, deleteExpense);
router.post("/:tripId/itinerary", authMiddleware, addItinerary);
router.delete(
  "/:tripId/itinerary/:itineraryId",
  authMiddleware,
  deleteItinerary,
);
router.put("/:tripId/itinerary/:itineraryId", authMiddleware, updateItinerary);
router.post(
  "/:tripId/itinerary/:itineraryId/expense",
  authMiddleware,
  addItineraryExpense,
);
router.delete(
  "/:tripId/itinerary/:itineraryId/expense/:expenseId",
  authMiddleware,
  deleteItineraryExpense,
);
router.delete("/:tripId", authMiddleware, deleteTrip);







module.exports = router;
