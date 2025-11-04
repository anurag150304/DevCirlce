import mongoose from "mongoose";

async function connectToDB() {
    await mongoose.connect(`${process.env.CONNECT_ATLAS_DB}`);
    console.log("connected to DB");
}

export default connectToDB;