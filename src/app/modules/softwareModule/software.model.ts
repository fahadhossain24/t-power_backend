import mongoose from 'mongoose';
import { ISoftware } from './software.interface';

const softwareSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mockupImage: {
        type: String,
        required: true
    },
    playStoreLink: {
        type: String,
        required: true
    },
    appStoreLink: {
        type: String,
        required: true
    },
    screenDetailes: [{
        title: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        }
    }],
}, {
    timestamps: true
})

const Software = mongoose.model<ISoftware>('software', softwareSchema)

export default Software
