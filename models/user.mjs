import { Schema, model } from 'mongoose';

const userSchema = Schema({
  username: String,
  password: String,
  token: String,
	cookieToken: String
})

export { userSchema };

const getModel = () => model(global.userCollectionsPrefix + 'User', userSchema) ;
export default getModel ;