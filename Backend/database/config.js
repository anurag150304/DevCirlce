import mongoose from "mongoose";

async function connectToDB() {
    await mongoose.connect(`${process.env.CONNECT_ATLAS_DB}`);
}

export default connectToDB;