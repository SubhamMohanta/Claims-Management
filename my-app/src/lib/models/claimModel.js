import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    documentUrl: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const Claim = mongoose.models.Claim || mongoose.model('Claim', claimSchema);

export default Claim;
