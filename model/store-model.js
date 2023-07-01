const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "store must have a name"],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      validate: [validator.isEmail, "enter a valid email address"],
      required: [true, "store must have a contact email address"],
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      // validate: [validator.isMobilePhone, "enter a valid mobile number"],
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "store must belong to a user"],
      },
    ],
    userId: {
      type: String,
      required: [true, "store must belong to a user"],
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

storeSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

module.exports = mongoose.model("Store", storeSchema);
