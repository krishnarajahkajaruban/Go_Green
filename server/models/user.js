const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email must be provided"]
    },
    name: {
      type: String,
      required: [true, "Name must be provided"]
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
      select: false // Exclude this field when querying
    },
    school: {
      type: String,
      required: function() {
        return this.role === 'User';
      }
    },
    grade: {
      type: Number,
      min: 1,
      required: function() {
        return this.role === 'User';
      }
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      required: [true, "Role must be provided"]
    }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
