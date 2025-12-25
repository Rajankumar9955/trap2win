
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");

var AdminController = require("../controllers/AdminController");

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
        .post("/admin/create-admin", AdminController.create_admin)
        .post("/admin/add-user", [check("email").trim().isLength({ min: 1 }).withMessage("Enter email address"), check("password").trim().isLength({ min: 1 }).withMessage("Enter password")], authenticateToken, AdminController.add_user)
        .post("/admin/login", [check("email").trim().isLength({ min: 1 }).withMessage("Enter email address"), check("password").trim().isLength({ min: 1 }).withMessage("Enter password")], AdminController.login)
        .post("/admin/user-list", authenticateToken, AdminController.user_list)
        .get("/admin/user", AdminController.all_user_list)
        .post("/admin/update-user-status", authenticateToken, AdminController.update_user_status)
        .post("/admin/delete-user", authenticateToken, AdminController.delete_user)
        .post("/admin/edit-user", authenticateToken, AdminController.edit_user)
        .post("/admin/single-user", authenticateToken, AdminController.single_user)
        .post("/admin/count-users", authenticateToken, AdminController.fetch_total_users)
        ////USER END/////

        // PROJECTS START
        .post("/admin/add-project", authenticateToken, AdminController.add_project)
        .post("/admin/projects-list", authenticateToken, AdminController.projects_list)
        .post("/admin/count-projects", authenticateToken, AdminController.fetch_total_projects)

        // PROJECTS END

        // LOG CATEGORY START
        .post("/admin/add-log-category", authenticateToken, AdminController.add_log_category)
        .post("/admin/log-category-list", authenticateToken, AdminController.log_category_list)
        .post("/admin/new-token-update", authenticateToken, AdminController.update_log_token)

        // LOG CATEGORY END

        // LOG  START
        .post("/admin/add-log", AdminController.add_log)
        .post("/admin/log-list", authenticateToken, AdminController.log_list)
        .post("/admin/count-logs", authenticateToken, AdminController.fetch_total_logs)


        //CLient User
        .post("/admin/add-client-user", [check("email").trim().isLength({ min: 1 }).withMessage("Enter email address"), check("password").trim().isLength({ min: 1 }).withMessage("Enter password")], authenticateToken, AdminController.add_client_user)
        .post("/admin/client-user-list", authenticateToken, AdminController.client_user_list)
        .post("/admin/update-client-user-category", authenticateToken, AdminController.update_clientUserCategory)
        .post("/admin/fetch-client-user-category", AdminController.fetch_client_user_category_list)
        .post("/admin/fetch-client-user-data", AdminController.fetch_client_user_data)

        .post("/admin/create-upload", authenticateToken, AdminController.upload_create)
        .post("/admin/fetch-upload-date", authenticateToken, AdminController.fetch_date_bise_upload)
        .post("/admin/fetch-upload-record", authenticateToken, AdminController.fetch_upload)

        .post("/admin/fetch-all-plan", authenticateToken, AdminController.fetch_all_plan)
        .post("/admin/add-plan", authenticateToken, AdminController.create_plan)
        .post("/admin/fetch-single-plan", authenticateToken, AdminController.fetch_singel_plan)
        .post("/admin/update-plan", authenticateToken, AdminController.update_plan)
        .post("/admin/update-plan-status", authenticateToken, AdminController.update_plan_status)
        .post("/admin/delete-plan", authenticateToken, AdminController.delete_plan)
};
