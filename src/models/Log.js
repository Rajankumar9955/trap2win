var mongoose = require("mongoose");

var LogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    log_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "logcategory",
        default: null,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
        default: null,
    },
    type: {
        type: String,
        default: "",
    },
    event: {
        type: String,
        default: "",
    },
    event_data: {
        type: String,
        default: "",
    },
    user_id: {
        type: String,
        default: "",
    },
    product_id: {
        type: String,
        default: "",
    },
    order_id: {
        type: String,
        default: "",
    },
    geo_ip: {
        type: String,
        default: "",
    },
    country: {
        type: String,
        default: "",
    },
    state: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    pincode: {
        type: String,
        default: "",
    },
    page_name: {
        type: String,
        default: "",
    },
    source: {
        type: String,
        default: "",
    },
    tracker_record: {
        type: String,
        default: "",
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("logs", LogSchema);
