const Trip = require("../models/Trip.js");

// CREATE TRIP
export const createTrip = async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      estimatedBudget,
      duration,
    } = req.body;

    const newTrip = await Trip.create({
      user: req.user.id, // comes from authMiddleware
      title,
      destination,
      startDate,
      endDate,
      estimatedBudget,
      duration,
    });

    res.status(201).json({
      message: "Trip created successfully 🚀",
      trip: newTrip,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// GET MY TRIPS WITH CALCULATIONS
export const getMyTrips = async (req, res) => {
  try {
   const trips = await Trip.find({ user: req.user.id });

   const tripsWithBudget = trips.map((trip) => {
     let totalSpent = 0;

     trip.itinerary.forEach((day) => {
       day.expenses.forEach((expense) => {
         totalSpent += expense.amount || 0;
       });
     });

     return {
       ...trip._doc,
       totalSpent,
       remainingBudget: trip.estimatedBudget - totalSpent,
     };
   });

    res.status(200).json(tripsWithBudget);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// ADD EXPENSE TO TRIP
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Make sure only trip owner can add expense
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    trip.expenses.push({ title, amount, category });

    await trip.save();

    res.status(200).json({
      message: "Expense added successfully 💰",
      trip
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// GET AVERAGE SPENDING BY DESTINATION
export const getBudgetPrediction = async (req, res) => {
  try {
    const { destination } = req.params;

    const trips = await Trip.find({
      destination: destination
    });

    if (trips.length === 0) {
      return res.status(404).json({
        message: "No data available for this destination"
      });
    }

    let totalAmount = 0;
    let tripCount = 0;

    trips.forEach(trip => {
      const totalSpent = trip.expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      if (totalSpent > 0) {
        totalAmount += totalSpent;
        tripCount++;
      }
    });

    if (tripCount === 0) {
      return res.status(404).json({
        message: "No expense data available"
      });
    }

    const average = Math.round(totalAmount / tripCount);

    res.status(200).json({
      destination,
      averageSpending: average,
      message: `People who went to ${destination} spent approx ₹${average}`
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// TOGGLE PUBLIC STATUS
export const togglePublic = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    trip.isPublic = !trip.isPublic;

    await trip.save();

    res.status(200).json({
      message: "Trip visibility updated 🌍",
      isPublic: trip.isPublic
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// GET ALL PUBLIC TRIPS
export const getPublicTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ isPublic: true }).populate("user", "name");

    const tripsWithBudget = trips.map((trip) => {
      let totalSpent = 0;

      trip.itinerary.forEach((day) => {
        day.expenses.forEach((expense) => {
          totalSpent += expense.amount || 0;
        });
      });

      return {
        ...trip._doc,
        totalSpent,
        remainingBudget: trip.estimatedBudget - totalSpent,
      };
    });

    res.status(200).json(tripsWithBudget);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// LIKE / UNLIKE TRIP
export const toggleLike = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = trip.likes.includes(userId);

    if (alreadyLiked) {
      trip.likes = trip.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      trip.likes.push(userId);
    }

    await trip.save();

    res.status(200).json({
      message: alreadyLiked ? "Trip unliked 💔" : "Trip liked ❤️",
      totalLikes: trip.likes.length
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ADD COMMENT TO TRIP
export const addComment = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.comments.push({
      user: req.user.id,
      text
    });

    await trip.save();

    res.status(200).json({
      message: "Comment added 💬",
      totalComments: trip.comments.length
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// DELETE EXPENSE FROM TRIP
export const deleteExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Remove expense
    trip.expenses = trip.expenses.filter(
      (expense) => expense._id.toString() !== expenseId,
    );

    await trip.save();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ADD ITINERARY ITEM TO TRIP
export const addItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { day, title, description, date, transport, stayDuration } = req.body;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.itinerary.push({
      day,
      title,
      description,
      date,
      transport,
      stayDuration,
    });

    await trip.save();

    res.json({ message: "Itinerary added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const { tripId, itineraryId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.itinerary = trip.itinerary.filter(
      (item) => item._id.toString() !== itineraryId,
    );

    await trip.save();

    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateItinerary = async (req, res) => {
  try {
    const { tripId, itineraryId } = req.params;
    const updatedData = req.body;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const itineraryItem = trip.itinerary.id(itineraryId);

    if (!itineraryItem) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itineraryItem.day = updatedData.day;
    itineraryItem.title = updatedData.title;
    itineraryItem.description = updatedData.description;
    itineraryItem.date = updatedData.date;
    itineraryItem.transport = updatedData.transport;
    itineraryItem.stayDuration = updatedData.stayDuration;

    await trip.save();

    res.json({ message: "Itinerary updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const addItineraryExpense = async (req, res) => {
  try {
    const { tripId, itineraryId } = req.params;
    const { title, amount, category } = req.body;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const itineraryItem = trip.itinerary.id(itineraryId);

    if (!itineraryItem) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itineraryItem.expenses.push({
      title,
      amount,
      category,
    });

    await trip.save();

    res.json({ message: "Itinerary expense added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteItineraryExpense = async (req, res) => {
  try {
    const { tripId, itineraryId, expenseId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const itineraryItem = trip.itinerary.id(itineraryId);
    if (!itineraryItem) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itineraryItem.expenses = itineraryItem.expenses.filter(
      (expense) => expense._id.toString() !== expenseId,
    );

    await trip.save();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Ensure only owner can delete
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await trip.deleteOne();

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

