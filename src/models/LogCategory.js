var mongoose = require("mongoose");

var LogCategorySchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    description: {
        type: String,
        default: "",
    },
    active: {
        type: Number,
        default: 0,
    },
    deleted: {
        type: Number,
        default: 0,
    },
    token: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("logcategory", LogCategorySchema);
