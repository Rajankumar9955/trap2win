const api = require("../controllers/api");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const Log = require("../models/Log");

const JWT_SECRET = "HareKrishnaHareRama";

module.exports = function (app) {
    function authenticateAPIToken(req, res, next) {
        if (!req.body.token) {
            return res.status(200).send({
                status: "success",
                message: "Token not found.",
            });
        };

        if (req.body.token) {
            jwt.verify(req.body.token, JWT_SECRET, (err, mobile) => {
                if (err) return res.status(200).send({
                    status: "error",
                    error: err,
                    message: "Token didn't match ..!! Please provide a valid token.",
                });
                next(); // pass the execution off to whatever request the client intended
            });
        };

    };
    app
        // LOG  START
        .post("/admin/api/all-logs-list", authenticateAPIToken, api.fetch_all_logs)
        .post("/admin/api/user-visit-per-page", authenticateAPIToken, api.user_visited_pages)
        .post("/admin/api/city-wise-log", authenticateAPIToken, api.city_wise_list)
        .post("/admin/api/order-count", authenticateAPIToken, api.order_count_list)
        .post("/admin/api/active-user-data", authenticateAPIToken, api.activeuserdata)

        .post("/admin/api/filter-according-to-user-visit", authenticateAPIToken, api.user_filtered_logs)
        .post("/admin/api/filter-according-to-product", authenticateAPIToken, api.product_filtered_logs)

        .post("/admin/api/filter-according-to-user-visit-user-id", authenticateAPIToken, api.log_list_according_user_Id)
        .post("/admin/api/filter-according-to-user-visit-product-id", authenticateAPIToken, api.log_list_according_product_Id)
        .post("/admin/api/pincode-list-according-to-log", authenticateAPIToken, api.pincode_list_according_logs)

        .post("/admin/api/log-list-daily", authenticateAPIToken, api.fetch_log_on_daily)
        .post("/admin/api/log-list-daily-for-survey", authenticateAPIToken, api.fetch_log_on_daily_for_survey)
 
};
