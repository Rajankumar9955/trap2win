var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
    full_name: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        default: "",
    },
    mobile: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        default: "client",
    },
    deleted: {
        type: Number,
        default: 0
    },
    active: {
        type: Number,
        default: 0
    },
    website_url: {
        type: String,
        default: ""
    },
    android_url: {
        type: String,
        default: ""
    },
    ios_url: {
        type: String,
        default: ""
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'logcategory',
            default: null
        }
    ],
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plans',
        default: null
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("users", UserSchema);
