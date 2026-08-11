import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

workspaceSchema.index({ owner: 1, name: 1 }, { unique: true });

workspaceSchema.index({ _id: 1, "members.user": 1 });

const WorkspaceModel = mongoose.model("Workspace", workspaceSchema);

export default WorkspaceModel;
