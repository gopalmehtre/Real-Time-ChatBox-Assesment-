import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    email : {
        type : String,
        required: [true, "Your email address is required"],
        unique: true,
    },

    username : {
        type : String,
        required : [true, "Your username is required"],

    },

    password : {
        type : String,
        required : [true, "Your password is required"],
    },

    onlineStatus: {
        type: Boolean,
        default: false
    },

    createdAt : {
        type : Date,
        default: new Date(),
    },

    
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;