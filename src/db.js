import mongoose,{Schema,model} from "mongoose";
mongoose.connect("mongodb://localhost:27017/pay");

const userSchema = new Schema({
    username: {type: String, require: true , minLength: 3, maxLength: 60, unique: true},
    password: {type: String, require: true ,minLength: 6},
    firstname: {type: String ,require: true},
    lastname: {type: String , require: true}
})
export const Usermodel = model("User",userSchema);