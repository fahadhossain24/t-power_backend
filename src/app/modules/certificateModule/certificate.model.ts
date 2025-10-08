import mongoose from "mongoose";
import { IPartner } from "../partnerModule/partner.interface";

const certificateSchema = new mongoose.Schema<IPartner>({
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const Certificate = mongoose.model<IPartner>('certificate', certificateSchema)
export default Certificate;