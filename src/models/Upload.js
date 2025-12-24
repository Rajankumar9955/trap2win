var mongoose = require("mongoose");

var uploadSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    date: {
        type: String,
        default: "",
    },
    order_id: {
        type: String,
        default: ""
    },
    correct: {
        type: Number,
        default: 0 ///////0:- false data, 1:- true data
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("upload", uploadSchema);
