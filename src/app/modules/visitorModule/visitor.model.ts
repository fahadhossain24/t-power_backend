import mongoose, { Schema, Document } from "mongoose";

interface IVisitor extends Document {
  ip: string;
  userAgent: string;
  visitCount: number;
  lastVisitedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    visitCount: { type: Number, default: 1 },
    lastVisitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IVisitor>("Visitor", visitorSchema);
