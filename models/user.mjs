import { Schema, model } from 'mongoose';

const userSchema = Schema({
  username: String,
  password: String,
  token: String
})

const User = model('User', userSchema) ;
export default User ;