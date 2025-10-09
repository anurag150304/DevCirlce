import mongoose from "mongoose";

async function connectToDB() {
    await mongoose.connect(`${process.env.CONNECT_LOCAL_DB}`);
}

export default connectToDB;