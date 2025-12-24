var mongoose = require("mongoose");

var PlanSchema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    price: {
        type: String,
        default: ""
    },
    old_price: {
        type: String,
        default: ""
    },
    project_limit: {
        type: Number,
        default: ""
    },
    validity_days: {
        type: Number,
        default: ""
    },
    description: {
        type: String,
        default: ""
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

module.exports = mongoose.model("plans", PlanSchema);
