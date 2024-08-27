import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser extends mongoose.Document{
  email: string;
  password: string;
  fullName: string;
  gender: string;
  phoneNO: string;
  generateAuthToken(): Promise<string>;
}

// Define the interface for the User model (with static methods)
export interface IUserModel extends mongoose.Model<IUser> {
  findByCredentials(email: string, password: string): Promise<IUser | null>;
}
  
const userSchema = new mongoose.Schema<IUser>( {
    email: {
      unique: true,
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } },
);

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    let user = await User.findOne<IUser>({ email: email });

    if (!user) {
      throw new Error("unable to login");
    }
    const ismatch = bcrypt.compare(password, user.password);

    if (!ismatch) {
      throw new Error("unable to login");
    }

    return user;
  } catch (error) {
    return error;
  }
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userobject = user.toObject();
  delete userobject.password;
  return userobject;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toString(), userType: user.userType },
      process.env.JWT_KEY || "mysecret",
    {
      expiresIn: "24h", // expires in 365 days
    },
  );
  return token;
};

userSchema.pre<IUser>("save", async function(next) {
  try {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

const User = mongoose.model<IUser, IUserModel>("user", userSchema);
export { User };
