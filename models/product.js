const mongoose =  require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'please provide product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be greater than 0']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock must be greater than 0']
    },
 
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum:{
            values: ['shortsleeves','longsleeves','sweatshirt','hoodies'],
            message: 'Please select catagoery ONLY from short-sleeves,long-sleeves,sweat-shirt,hoodies'
        }
    },
    brand: {
        type: String,
        required: [true, "please add a brand name"]
    },
   
    numberOfReviews:{
        type: Number,
        default: 0
    },
    reviews:[{
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be between 1 and 5'],
            max: [5, 'Rating must be between 1 and 5']
        },
    }]
    ,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: ture
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }

})


module.exports = mongoose.model('Product', productSchema);