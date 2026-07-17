import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    availability: {
        type: Boolean,
        default: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8,
    },
    course: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

export const Book = mongoose.model('Book', bookSchema);