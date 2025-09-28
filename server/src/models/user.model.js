const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    interviewList: [
      {
        type: Schema.Types.ObjectId,
        ref: "MockInterview",
      }
    ]
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);
module.exports = UserModel;