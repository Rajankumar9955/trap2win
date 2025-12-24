var mongoose = require("mongoose");

var ProjectSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
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
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("projects", ProjectSchema);
