const { Schema, model } = require("mongoose");
const User = require("./user");

const plantDetailSchema = new Schema(
    {
      plantName: {
        type: String,
        required: [true, "Plant name must be provided"],
      },
      issueDate: {
        type: Date,
        required: [true, "Issued date must be provided"],
      }
    },
    { _id: false } // Prevents creation of an _id field in this subdocument
  );

  const progressAndMaintenanceSchema = new Schema(
    {
      year: {
        type: Number,
        min: 2000,
        required: [true, "Year must be provided"],
      },
      progressAndMaintenance: {
        type: String,
        required: [true, "Progress & Maintenance must be provided"],
      },
      photoUrl: {
        type: String,
        required: [true, "Photo Url must be provided"],
      },
    },
    { _id: false } // Prevents creation of an _id field in this subdocument
  );

const plantProgressFormSchema = new Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: [true, "UserId must be provided"]
    },
    plantDetail: plantDetailSchema,
    progressAndMaintenance: progressAndMaintenanceSchema
  },
  { timestamps: true }
);

module.exports = model("PlantProgressForm", plantProgressFormSchema);
