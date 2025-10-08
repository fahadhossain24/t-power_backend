import mongoose from "mongoose";
import { IPartner } from "./partner.interface";

const partnerSchema = new mongoose.Schema<IPartner>({
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const Partner = mongoose.model<IPartner>('partner', partnerSchema)
export default Partner;