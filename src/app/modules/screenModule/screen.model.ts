import mongoose, { Types } from 'mongoose';
import { IScreen } from './screen.interface';

const screenSchema = new mongoose.Schema({
    softwareId: {
        type: Types.ObjectId,
        ref: "software",
        required: true
    },
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
}, {
    timestamps: true
})

const Screen = mongoose.model<IScreen>('screen', screenSchema)

export default Screen
