import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    users: [{
        type: Schema.Types.ObjectId,
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

const projectModel = model('project', projectSchema);
export default projectModel;