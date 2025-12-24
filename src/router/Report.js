
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const Report = require("../controllers/Report");


const JWT_SECRET = "HareKrishnaHareRama";

module.exports = function (app) {
    function generateAccessToken(key) {
        // expires after half and hour (1800 seconds = 30 minutes)
        const accessToken = jwt.sign({ mobile: key }, JWT_SECRET, { expiresIn: "180000s" });
        return accessToken;
    }

    function authenticateToken(req, res, next) {
        //const JWT_SECRET = process.env.JWT_SECRET;
        // Gather the jwt access token from the request header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[0];
        //console.log(authHeader.split(' '));
        if (token == null) return res.status(200).send({
            status: "error",
            message: "Please try to relogin.. Token didn't found ..!!",
        }); // if there isn't any token

        jwt.verify(token, JWT_SECRET, (err, mobile) => {
            if (err) return res.status(200).send({
                status: "error",
                error: err,
                message: "Please try to relogin.. Token didn't match ..!!",
            });
            req.token = generateAccessToken(mobile);
            next(); // pass the execution off to whatever request the client intended
        });
    }


    app

        /// User Start ////

        // LOG  START
        .post("/admin/user-visit-per-page", authenticateToken, Report.user_visited_pages)
        .post("/admin/city-wise-log", authenticateToken, Report.city_wise_list)
        .post("/admin/order-count", authenticateToken, Report.order_count_list)
        .post("/admin/active-user-data", authenticateToken, Report.activeuserdata)

        // LOG  START Client
        .post("/admin/user-visit-client", authenticateToken, Report.user_visited_pages_client)
        .post("/admin/city-log-client", authenticateToken, Report.city_wise_list_client)
        .post("/admin/order-client", authenticateToken, Report.order_count_list_client)
        .post("/admin/active-client", authenticateToken, Report.activeuserdata_client)



};
