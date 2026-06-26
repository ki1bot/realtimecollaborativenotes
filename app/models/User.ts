import bcrypt from "bcryptjs";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
      minlength: [2, "Nama minimal 2 karakter"],
      maxlength: [80, "Nama maksimal 80 karakter"],
    },
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      minlength: [6, "Password minimal 6 karakter"],
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  this: any,
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

export default models.User || model("User", userSchema);
