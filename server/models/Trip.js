const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const itineraryExpenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
});

const itinerarySchema = new mongoose.Schema({
  day: Number,
  title: String,
  description: String,
  date: Date,
  transport: String,
  stayDuration: String,
  expenses: [itineraryExpenseSchema],
});

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    startDate: Date,
    endDate: Date,

    estimatedBudget: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    expenses: [expenseSchema],

    itinerary: [itinerarySchema],

    photos: [
      {
        type: String,
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trip", tripSchema);
