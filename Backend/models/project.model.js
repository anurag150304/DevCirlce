import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],

    fileTree: {
        type: Object,
        default: {}
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const projectModel = mongoose.model('project', projectSchema);
export default projectModel;