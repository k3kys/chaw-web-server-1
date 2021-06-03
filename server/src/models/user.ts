import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface UserAttrs {
    name: string
    email: string
    password: string
    confirmPassword: string,
    university: string
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc,
    correctPassword(candidatePassword: string, password: string): Promise<boolean>;
}

export interface UserDoc extends mongoose.Document {
    name: string
    email: string
    password: string
    confirmPassword: string
    isAdmin: boolean,
    university: string,
    passwordResetToken: string | undefined,
}

const userSchema = new mongoose.Schema<UserDoc>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (this: UserDoc, el: any) {
                return el === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
    isAdmin: {
        type: Boolean,
        default: false 
    },
    university: {
        type: String,
        required: true
    },
    passwordResetToken: String,
}, {
    timestamps: true
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

userSchema.pre<UserDoc>("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password!, 12)
    this.confirmPassword = await bcrypt.hash(this.confirmPassword!, 12)

    next();
});

userSchema.statics.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema)

export { User }