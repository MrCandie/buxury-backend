const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [30, "Name cannot be more than 30 characters"],
      default: "",
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
    role: {
      type: String,
      trim: true,
      default: "user",
      enum: ["user", "admin"],
    },
    password: {
      type: String,
      trim: true,
      minlength: [7, "password cannot be less than 7 digits"],
      required: [true, "enter a valid password"],
      select: false,
    },
    hasStore: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      trim: true,
      default: "",
      validate: [validator.isEmail, "enter a valid email address"],
    },
    emailIsVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.verifyPassword = async function (enteredPassword, password) {
  return await bcrypt.compare(enteredPassword, password);
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

userSchema.methods.passwordChanged = function (jwtTime) {
  if (this.passwordChangedAt) {
    const passwordTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTime < passwordTimeStamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
