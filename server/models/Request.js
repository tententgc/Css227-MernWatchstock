import { Schema, model } from "mongoose";
const schemaRequest = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: false
        },
        series: {
            type: String,
            required: false
        },
        model: {
            type: String,
            required: false
        },
        produced: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: true
        },
        likecount: {
            type: Number,
            required: false
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        detail: {
            type: Object,
            required: true
        },
        photo: {
            type: String,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        tags: {
            type: [String]
        },
        status: {
            type: String,
            enum: ["approved", "rejected", "waiting"],
            required: true,
            default: "waiting"
        },
        categories: [
            String
        ],}, { timestamps: true, toJSON: { virtuals: true } }

);


const Request = model("Request", schemaRequest);
export default Request;
