import mongoose, { Document, Schema } from "mongoose";

/**
 * Priority type:
 * Defines allowed values for the task priority field.
 */
export type Priority = "low" | "medium" | "high";

/**
 * ITask Interface (TypeScript)
 * --------------------------------
 * Represents how a Task document looks inside the application.
 * Extends Mongoose Document so it includes built-in fields like _id.
 */
export interface ITask extends Document {
    user: mongoose.Types.ObjectId;   // Reference to the User who owns the task
    title: string;
    description?: string;
    dateTime?: Date;                 // Optional specific date/time field
    deadline?: Date;                 // Optional deadline field
    priority: Priority;              // "low" | "medium" | "high"
    completed: boolean;
    createdAt: Date;                 // Automatically added by timestamps:true
}

/**
 * TaskSchema:
 * --------------------------------
 * Defines how a task is stored inside MongoDB.
 * Each field includes type validation and additional rules.
 */
const TaskSchema: Schema = new Schema(
    {
        /**
         * user:
         * - ObjectId reference to User model
         * - Required → ensures tasks belong to a specific user
         */
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },

        /**
         * title:
         * - Required name of the task
         */
        title: { type: String, required: true },

        /**
         * description:
         * - Optional text field
         */
        description: { type: String },

        /**
         * dateTime:
         * - Optional date/time for task start or schedule
         */
        dateTime: { type: Date },

        /**
         * deadline:
         * - Optional deadline field
         */
        deadline: { type: Date },

        /**
         * priority:
         * - Must be one of: "low", "medium", "high"
         * - Default = "low"
         */
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },

        /**
         * completed:
         * - Boolean flag for task completion
         * - Default = false (task incomplete when created)
         */
        completed: { type: Boolean, default: false },
    },

    /**
     * Schema Options:
     * ---------------------------
     * timestamps: true
     * - Automatically adds createdAt and updatedAt fields
     */
    { timestamps: true }
);

/**
 * Mongoose Model:
 * --------------------------------
 * Creates a model named "Task" which represents documents
 * stored in the "tasks" collection in MongoDB.
 */
export default mongoose.model<ITask>("Task", TaskSchema);
