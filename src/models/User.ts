import mongoose, { Document, Schema } from "mongoose";

/**
 * IUser Interface:
 * --------------------------------
 * Represents a User document in TypeScript.
 * Extends Mongoose Document, which includes _id and other built-in fields.
 */
export interface IUser extends Document {
    email: string;    // Unique email of the user
    password: string; // Hashed password (never store plain password)
}

/**
 * UserSchema:
 * --------------------------------
 * Defines how a User is stored in MongoDB.
 * - email: must be unique
 * - password: stored as hashed string (bcrypt used in controller)
 */
const UserSchema: Schema = new Schema({
    /**
     * email:
     * - Required: user must provide an email
     * - Unique: no two users can register with same email
     */
    email: { type: String, required: true, unique: true },

    /**
     * password:
     * - Required
     * - Stored as hashed value (actual hashing done in controller)
     * - Never store plain text passwords!
     */
    password: { type: String, required: true },
});

/**
 * Mongoose Model:
 * --------------------------------
 * Creates a collection named "users" in MongoDB.
 * The model gives access to helper methods:
 * - User.find()
 * - User.findOne()
 * - User.create()
 * - User.findById()
 * and more...
 */
export default mongoose.model<IUser>("User", UserSchema);
