
// export const connectionDb = "mongodb+srv://"+username+":"+password+"@cluster0.ywefru2.mongodb.net/RideFixr?retryWrites=true&w=majority";
const password = process.env.PASSWORD;
export const connectionDb = `mongodb+srv://dineshreddy:${password}@cluster0.ywefru2.mongodb.net/RideFixr?retryWrites=true&w=majority`;

