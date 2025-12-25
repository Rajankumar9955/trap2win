const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const moment = require("moment");

const User = require("../models/User");
const Projects = require("../models/Projects");
const LogCategory = require("../models/LogCategory");
const Log = require("../models/Log");
const { default: axios } = require("axios");
const Upload = require("../models/Upload");
const Plan = require("../models/Plan");
const saltRounds = 10;
const JWT_SECRET = "HareKrishnaHareRama";

var mongoose = require("mongoose");

module.exports = {
    add_user: function (req, res) {
        var where = {};
        where["mobile"] = req.body.mobile;
        User.findOne(where).then((response) => {
            if (response != null) {
                res.status(200).send({
                    status: "error",
                    message: "Mobile Number exists in the database.",
                });
            } else {
                var where = {};
                where["email"] = req.body.email;
                User.findOne(where).then((response) => {
                    if (response != null) {
                        res.status(200).send({
                            status: "error",
                            message: "Email exists in the database.",
                        });
                    } else {
                        bcryptjs.genSalt(saltRounds, (err, salt) => {
                            bcryptjs.hash(req.body.password, salt, (err, hash) => {
                                var Usersdata = new User({
                                    full_name: req.body.full_name,
                                    email: req.body.email,
                                    mobile: req.body.mobile,
                                    password: hash,
                                    role: req.body.role,
                                    address: req.body.address,
                                    website_url: req.body.website_url,
                                    android_url: req.body.android_url,
                                    ios_url: req.body.ios_url
                                });
                                Usersdata.save().then(function (response) {
                                    if (response) {
                                        res.status(200).send({
                                            status: "success",
                                            message: "Users has been created successfully.",
                                            result: response
                                        });
                                    } else {
                                        res.status(200).send({
                                            status: "error",
                                            message: "Something went wrong please try again later !!",
                                        });
                                    }
                                });
                            });
                        });
                    }
                });
            }
        });
    },

    create_admin: function (req, res) {
        var where = {};
        where["email"] = req.body.email;
        User.findOne(where).then((response) => {
            if (response != null) {
                res.status(200).send({
                    status: "error",
                    message: "Email exists in the database.",
                });
            } else {
                bcryptjs.genSalt(saltRounds, (err, salt) => {
                    bcryptjs.hash(req.body.password, salt, (err, hash) => {
                        var Usersdata = new User({
                            full_name: "Admin",
                            email: req.body.email,
                            password: hash,
                            role: "admin",
                            active: 1
                        });
                        Usersdata.save().then(function (response) {
                            if (response) {
                                const accessToken = jwt.sign(
                                    {
                                        email: response.email,
                                        user_id: response._id,
                                        role: response.role
                                    },
                                    JWT_SECRET,
                                    {
                                        expiresIn: "180000s",
                                    }
                                );
                                res.status(200).send({
                                    status: "success",
                                    message: "Admin has been created successfully.",
                                    token: accessToken,
                                    result: response
                                });
                            } else {
                                res.status(200).send({
                                    status: "error",
                                    message: "Something went wrong please try again later !!",
                                });
                            }
                        });
                    });
                });
            }
        });
    },

    edit_user: function (req, res) {
        var where = {};
        where["mobile"] = req.body.mobile;
        where["_id"] = req.body.id;
        if (req.body.password) {
            bcryptjs.genSalt(saltRounds, (err, salt) => {
                bcryptjs.hash(req.body.password, salt, (err, hash) => {
                    User.findOneAndUpdate(
                        { _id: req.body.id },
                        {
                            full_name: req.body.full_name,
                            email: req.body.email,
                            mobile: req.body.mobile,
                            password: hash,
                            role: req.body.role,
                            address: req.body.address,
                            website_url: req.body.website_url,
                            android_url: req.body.android_url,
                            ios_url: req.body.ios_url
                        },
                        {
                            new: true,
                        }
                    )
                        .exec()
                        .then((response) => {
                            res.status(200).send({
                                status: "success",
                                message: "User data successfully updated.",
                            });
                            return;
                        })
                        .catch((error) => {
                            res.status(200).send({
                                status: "error",
                                message: "Something went wrong",
                            });
                            return;
                        });
                });
            });
        } else {
            User.findOneAndUpdate(
                { _id: req.body.id },
                {
                    full_name: req.body.full_name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    role: req.body.role,
                    address: req.body.address,
                    website_url: req.body.website_url,
                    android_url: req.body.android_url,
                    ios_url: req.body.ios_url
                },
                {
                    new: true,
                }
            )
                .exec()
                .then((response) => {
                    res.status(200).send({
                        status: "success",
                        message: "User data successfully updated.",
                    });
                    return;
                })
                .catch((error) => {
                    res.status(200).send({
                        status: "error",
                        message: "Something went wrong",
                    });
                    return;
                });
        }
        // User.findOne(where).then((response) => {
        //     if (response != null) {
        //         res.status(200).send({
        //             status: "error",
        //             message: "Mobile Number exists in the database. Try Another Number.",
        //         });
        //     } else {
        //         var where = {};
        //         where["email"] = req.body.email;
        //         where["_id"] = req.body.id;
        //         User.findOne(where).then((response) => {
        //             if (response != null) {
        //                 res.status(200).send({
        //                     status: "error",
        //                     message: "Email exists in the database.Try Another email.",
        //                 });
        //             } else {

        //             }
        //         });
        //     }
        // });
    },
    login: function (req, res) {
        ;

        var where = {};
        where["email"] = req.body.email;
        where["deleted"] = 0;
        User.findOne(where)
            .then((response) => {
                console.log(response, "response");
                // Load hash from the db, which was preivously stored
                bcryptjs.compare(req.body.password, response.password, function (err, result) {
                    if (result == true) {
                        const accessToken = jwt.sign(
                            {
                                email: req.body.email,
                                user_id: response?._id,
                                role: response?.role
                            },
                            JWT_SECRET,
                            {
                                expiresIn: "180000s",
                            }
                        );
                        res.status(200).send({
                            status: "success",
                            message: "Logged in",
                            token: accessToken,
                            result: response,
                        });
                    } else {
                        res.status(200).send({
                            status: "error",
                            message: "Invalid email/password",
                        });
                    }
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: "Invalid email/password",
                });
            });
    },
    user_list: function (req, res) {
        var where = {};

        where["deleted"] = 0;

        if (req.body.status) {
            where["active"] = req.body.active;
        };

        if (req.body.full_name) {
            where["full_name"] = req.body.full_name;
        };

        if (req.body.role) {
            where["role"] = req.body.role;
        };

        User.find(where)
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    all_user_list: function (req, res) {
        var where = {};

        // where["deleted"] = 0;

        // if (req.body.status) {
        //     where["active"] = req.body.active;
        // };

        // if (req.body.full_name) {
        //     where["full_name"] = req.body.full_name;
        // };

        // if (req.body.role) {
        //     where["role"] = req.body.role;
        // };

        User.find()
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    single_user: function (req, res) {
        var where = {};

        where["deleted"] = 0;
        where["_id"] = req.body.id;

        User.findOne(where)
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    update_user_status: function (req, res) {
        var where = {};

        where["deleted"] = 0;
        where["_id"] = req.body.user;

        User.findOneAndUpdate(
            where,
            {
                active: req.body.status,
            },
            {
                new: true,
            }
        )
            .exec()
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    message: "Status updated",
                });
                return;
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: "Something went wrong",
                });
                return;
            });
    },
    delete_user: function (req, res) {
        var where = {};

        where["deleted"] = 0;
        where["_id"] = req.body.user;

        User.findOneAndUpdate(
            where,
            {
                deleted: 1,
            },
            {
                new: true,
            }
        )
            .exec()
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    message: "User deleted",
                });
                return;
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: "Something went wrong",
                });
                return;
            });
    },
    fetch_total_users: async function (req, res) {
        var where = {};
        // where["role"] = "customer"
        const customer = await User.find({ role: "customer" }).countDocuments();
        const admin = await User.find({ role: "admin" }).countDocuments();
        res.status(200).send({
            status: "success",
            message: "Users counted",
            customer: customer,
            admin: admin
        });
    },

    ///USER END

    ////PROJECT START
    add_project: function (req, res) {
        var where = {};
        where["user"] = req.body.user;
        where["name"] = req.body.name;

        Projects.findOne(where).then((response) => {
            if (response != null) {
                res.status(200).send({
                    status: "error",
                    message: "This project already exists in the database.",
                });
            } else {
                var projectData = new Projects({
                    name: req.body.name,
                    user: req.body.user,
                    description: req.body.description,
                });
                projectData.save().then(function (response) {
                    if (response) {
                        res.status(200).send({
                            status: "success",
                            message: "Project has been created successfully.",
                            result: response
                        });
                    } else {
                        res.status(200).send({
                            status: "error",
                            message: "Something went wrong please try again later !!",
                        });
                    }
                });
            }
        });
    },

    projects_list: function (req, res) {
        var where = {};

        where["deleted"] = 0;

        if (req.body.user) {
            where["user"] = req.body.user;
        };
        if (req.body.name) {
            where["name"] = req.body.name;
        }
        Projects.find(where)
            .populate("user")
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    fetch_total_projects: async function (req, res) {
        var where = {};
        if (req.body.user) {
            where["user"] = req.body.user;
        }

        const customer = await Projects.find(where).countDocuments();

        res.status(200).send({
            status: "success",
            message: "Projects counted",
            customer: customer,
        });
    },

    // PROJECT END

    ////PROJECT CATEGORY START
    add_log_category: function (req, res) {
        var where = {};

        where["user"] = req.body.user;
        where["name"] = req.body.name;
        where["project"] = req.body.project;

        LogCategory.findOne(where).then((response) => {
            if (response != null) {
                res.status(200).send({
                    status: "error",
                    message: "This category for this project already exists in the database.",
                });
            } else {
                const accessToken = jwt.sign(
                    {
                        user: req.body.user,
                        project: req.body.project,
                    },
                    JWT_SECRET,
                );
                var categoryData = new LogCategory({
                    name: req.body.name,
                    user: req.body.user,
                    project: req.body.project,
                    description: req.body.description,
                    token: accessToken
                });

                categoryData.save().then(function (response) {
                    if (response) {
                        res.status(200).send({
                            status: "success",
                            message: "Category has been created successfully.",
                            result: response
                        });
                    } else {
                        res.status(200).send({
                            status: "error",
                            message: "Something went wrong please try again later !!",
                        });
                    }
                });
            }
        });
    },

    log_category_list: function (req, res) {
        var where = {};

        where["deleted"] = 0;
        where["project"] = req.body.project;
        if (req.body.name) {
            where["name"] = req.body.name;
        }

        LogCategory.find(where)
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    update_log_token: function (req, res) {
        var where = {};

        where["_id"] = req.body.category;
        const accessToken = jwt.sign(
            {
                user: req.body.user,
                project: req.body.project,
            },
            JWT_SECRET,
        );
        LogCategory.findOneAndUpdate(
            where,
            {
                token: accessToken,
            },
            {
                new: true,
            }
        )
            .exec()
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    message: "New token created successfully",
                });
                return;
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: "Something went wrong",
                });
                return;
            });
    },
    // PROJECT CATEGORY END

    ////Log START
    add_log: function (req, res) {
        var where = {};

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
                return; // pass the execution off to whatever request the client intended
            });
        };

        LogCategory.findOne({ token: req.body.token }).then(resp => {
            if (resp != null) {
                const decodedToken = jwt.decode(req.body.token);
                const userId = decodedToken?.user;
                const projectId = decodedToken?.project;

                if (req.body.type === "checkout") {
                    axios.post("https://webapi.tastes2plate.com/admin/verify-checkout", {
                        orderid: req.body.order_id ? req.body.order_id : req.query.order_id
                    })
                        .then((resp) => {
                            if (resp?.data?.result) {
                                if (req.body.geo_ip) {
                                    axios.get("https://api.ipinfodb.com/v3/ip-city/?key=f11fd98655e535fa7d79831a83b5fd2874a5ac0b04b1b4d8a2db93c9c4c16a5c&ip=" + req.body.geo_ip + "&format=json")
                                        .then((respon) => {
                                            var log = new Log({
                                                user: userId,
                                                log_category: req.body.category ? req.body.category : req.query.log_category,
                                                project: projectId,
                                                type: req.body.type ? req.body.type : req.query.type,
                                                event: req.body.event ? req.body.event : req.query.event,
                                                event_data: req.body.event_data ? req.body.event_data : req.query.event_data,
                                                user_id: req.body.user_id,
                                                product_id: req.body.product_id,
                                                geo_ip: req.body.geo_ip,
                                                country: respon?.data?.countryName,
                                                state: respon?.data?.regionName,
                                                city: respon?.data?.cityName,
                                                pincode: respon?.data?.zipCode,
                                                page_name: req.body?.page_name?.toLowerCase(),
                                                source: req?.body?.source,
                                                tracker_record: req?.body?.tracker_record,
                                                order_id: req?.body?.order_id,
                                            });

                                            log.save().then(function (response) {
                                                if (response) {
                                                    res.status(200).send({
                                                        status: "success",
                                                        message: "log created successfully.",
                                                        result: response
                                                    });
                                                } else {
                                                    res.status(200).send({
                                                        status: "error",
                                                        message: "Something went wrong please try again later !!",
                                                    });
                                                }
                                            });
                                        }).catch(err => console.log(err));
                                } else {
                                    var log = new Log({
                                        user: userId,
                                        log_category: req.body.category ? req.body.category : req.query.log_category,
                                        project: projectId,
                                        type: req.body.type ? req.body.type : req.query.type,
                                        event: req.body.event ? req.body.event : req.query.event,
                                        event_data: req.body.event_data ? req.body.event_data : req.query.event_data,
                                        user_id: req.body.user_id,
                                        product_id: req.body.product_id,
                                        page_name: req.body?.page_name?.toLowerCase(),
                                        source: req?.body?.source,
                                        tracker_record: req.body?.tracker_record,
                                        order_id: req?.body?.order_id,
                                    });

                                    log.save().then(function (response) {
                                        if (response) {
                                            res.status(200).send({
                                                status: "success",
                                                message: "log created successfully.",
                                                result: response
                                            });
                                        } else {
                                            res.status(200).send({
                                                status: "error",
                                                message: "Something went wrong please try again later !!",
                                            });
                                        }
                                    });
                                }
                            } else {
                                console.log("FAQE");
                                res.status(200).send({
                                    status: "success",
                                    message: "Order id not found",

                                });
                            }
                        })
                } else {
                    if (req.body.geo_ip) {
                        axios.get("https://api.ipinfodb.com/v3/ip-city/?key=f11fd98655e535fa7d79831a83b5fd2874a5ac0b04b1b4d8a2db93c9c4c16a5c&ip=" + req.body.geo_ip + "&format=json")
                            .then((respon) => {
                                var log = new Log({
                                    user: userId,
                                    log_category: req.body.category ? req.body.category : req.query.log_category,
                                    project: projectId,
                                    type: req.body.type ? req.body.type : req.query.type,
                                    event: req.body.event ? req.body.event : req.query.event,
                                    event_data: req.body.event_data ? req.body.event_data : req.query.event_data,
                                    user_id: req.body.user_id,
                                    product_id: req.body.product_id,
                                    geo_ip: req.body.geo_ip,
                                    country: respon?.data?.countryName,
                                    state: respon?.data?.regionName,
                                    city: respon?.data?.cityName,
                                    pincode: respon?.data?.zipCode,
                                    page_name: req.body?.page_name?.toLowerCase(),
                                    source: req?.body?.source,
                                    tracker_record: req?.body?.tracker_record,
                                    order_id: req?.body?.order_id,
                                });

                                log.save().then(function (response) {
                                    if (response) {
                                        res.status(200).send({
                                            status: "success",
                                            message: "log created successfully.",
                                            result: response
                                        });
                                    } else {
                                        res.status(200).send({
                                            status: "error",
                                            message: "Something went wrong please try again later !!",
                                        });
                                    }
                                });
                            }).catch(err => console.log(err));
                    } else {
                        var log = new Log({
                            user: userId,
                            log_category: req.body.category ? req.body.category : req.query.log_category,
                            project: projectId,
                            type: req.body.type ? req.body.type : req.query.type,
                            event: req.body.event ? req.body.event : req.query.event,
                            event_data: req.body.event_data ? req.body.event_data : req.query.event_data,
                            user_id: req.body.user_id,
                            product_id: req.body.product_id,
                            page_name: req.body?.page_name?.toLowerCase(),
                            source: req?.body?.source,
                            tracker_record: req.body?.tracker_record,
                            order_id: req?.body?.order_id,
                        });

                        log.save().then(function (response) {
                            if (response) {
                                res.status(200).send({
                                    status: "success",
                                    message: "log created successfully.",
                                    result: response
                                });
                            } else {
                                res.status(200).send({
                                    status: "error",
                                    message: "Something went wrong please try again later !!",
                                });
                            }
                        });
                    }

                }


            } else {
                res.status(200).send({
                    status: "success",
                    message: "Token not found.",
                });
            }
        })


    },

    log_list: async function (req, res) {
        var where = {};
        where["project"] = new mongoose.Types.ObjectId(req.body.project);
        where["log_category"] = new mongoose.Types.ObjectId(req.body.log_category);


        if (req.body.source) {
            where["source"] = req.body.source;
        }
        if (req.body.type) {
            where["type"] = req.body.type;
            if (req.body.type === "signup") {
                where["user_id"] = { $ne: "" }
            }
            if (req.body.type === "registration") {
                where["user_id"] = { $ne: "" }
            }
        }
        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            var start = moment(moment(req.body.start_date).startOf("day")).toISOString();
            var end = moment(moment(req.body.end_date).endOf("day")).toISOString();

            where["createdAt"] = {
                $gte: new Date(start),
                $lt: new Date(end),
            };
        };

        var count = await Log.find(where).countDocuments();
        Log.find(where, null, {
            limit: Number(req.body.limit),
            skip: Number(req.body.page),
        })
            .populate("log_category")
            .populate("project")
            .sort("-createdAt")
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                    message: "",
                    count: count,
                })
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    fetch_total_logs: async function (req, res) {
        var where = {};
        if (req.body.user) {
            where["user"] = req.body.user;
        }

        const customer = await Log.find(where).countDocuments();

        res.status(200).send({
            status: "success",
            message: "Projects counted",
            customer: customer,
        });
    },
    add_client_user: function (req, res) {
        var where = {};
        where["mobile"] = req.body.mobile;
        User.findOne(where).then((response) => {
            if (response != null) {
                res.status(200).send({
                    status: "error",
                    message: "Mobile Number exists in the database.",
                });
            } else {
                var where = {};
                where["email"] = req.body.email;
                User.findOne(where).then((response) => {
                    if (response != null) {
                        res.status(200).send({
                            status: "error",
                            message: "Email exists in the database.",
                        });
                    } else {
                        bcryptjs.genSalt(saltRounds, (err, salt) => {
                            bcryptjs.hash(req.body.password, salt, (err, hash) => {
                                var Usersdata = new User({
                                    full_name: req.body.full_name,
                                    email: req.body.email,
                                    mobile: req.body.mobile,
                                    password: hash,
                                    address: req.body.address,
                                    client: req.body.client,
                                    category: req.body.category,
                                    role: "client-user"
                                });
                                Usersdata.save().then(function (response) {
                                    if (response) {
                                        res.status(200).send({
                                            status: "success",
                                            message: "Users has been created successfully.",
                                            result: response
                                        });
                                    } else {
                                        res.status(200).send({
                                            status: "error",
                                            message: "Something went wrong please try again later !!",
                                        });
                                    }
                                });
                            });
                        });
                    }
                });
            }
        });
    },
    client_user_list: function (req, res) {
        var where = {};

        where["deleted"] = 0;

        if (req.body.status) {
            where["active"] = req.body.active;
        };

        if (req.body.full_name) {
            where["full_name"] = req.body.full_name;
        };

        where["client"] = req.body.client;
        where["role"] = "client-user";

        User.find(where)
            .populate("category")
            .populate({
                path: "category",
                populate: ["project"],
            })
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    update_clientUserCategory: function (req, res) {
        var where = {};

        where["deleted"] = 0;
        where["_id"] = req.body.id;
        where["role"] = "client-user"

        User.findOneAndUpdate(
            where,
            {
                category: req.body.category
            },
            {
                new: true,
            }
        )
            .exec()
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    message: "Category updated.",
                });
                return;
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: "Something went wrong",
                });
                return;
            });
    },
    fetch_client_user_category_list: function (req, res) {
        var where = {};

        where["_id"] = req.body.id;
        where["role"] = "client-user";

        User.findOne(where)
            .then((response) => {
                LogCategory.find({ "_id": { "$in": response?.category } })
                    .then((respon) => {
                        res.status(200).send({
                            status: "success",
                            result: respon,
                        });
                    }).catch((error) => {
                        res.status(200).send({
                            status: "error",
                            message: error,
                        });
                    })
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },

    fetch_client_user_data: function (req, res) {
        var where = {};

        where["_id"] = req.body.id;
        where["role"] = "client-user";

        User.findOne(where)
            .populate("client", 'website_url android_url ios_url')
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    upload_create: function (req, res) {
        Upload.findOne({ order_id: req.body.order_id }).then((resp) => {
            if (resp != null) {
                res.status(200).send({
                    status: "error",
                    message: "data already present",
                });
            } else {
                Log.findOne({ order_id: req.body.order_id }).then((respon) => {
                    if (respon != null) {
                        var upload = new Upload({
                            user: req.body.user,
                            date: req.body.date,
                            order_id: req.body.order_id,
                            correct: 1
                        });
                        upload.save().then(function (response) {
                            if (response) {
                                res.status(200).send({
                                    status: "success",
                                    message: "data Uploaded"
                                });
                            } else {
                                res.status(200).send({
                                    status: "error",
                                    message: "Something went wrong please try again later !!",
                                });
                            }
                        });
                    } else {
                        var upload = new Upload({
                            user: req.body.user,
                            date: req.body.date,
                            order_id: req.body.order_id,
                            correct: 0
                        });
                        upload.save().then(function (response) {
                            if (response) {
                                res.status(200).send({
                                    status: "success",
                                    message: "data Uploaded"
                                });
                            } else {
                                res.status(200).send({
                                    status: "error",
                                    message: "Something went wrong please try again later !!",
                                });
                            }
                        });
                    }
                });
            }
        })
    },
    fetch_upload: function (req, res) {
        var where = {};
        if (req.body.role === "client-user") {
            where['user'] = new mongoose.Types.ObjectId(req.body.user);
            if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
                where["date"] = {
                    $gte: new Date(req.body.start_date),
                    $lt: new Date(req.body.end_date),
                };
            }
            where["correct"] = 0;
            Upload.aggregate([
                { $match: where },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                            date1: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        "_id.date": 1,
                    },
                },
            ]).then((inward_response) => {
                var where1 = {};
                if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
                    where1["date"] = {
                        $gte: new Date(req.body.start_date),
                        $lt: new Date(req.body.end_date),
                    };
                }
                where1["correct"] = 1;
                where1['user'] = new mongoose.Types.ObjectId(req.body.user);
                Upload.aggregate([
                    { $match: where1 },
                    {
                        $group: {
                            _id: {
                                date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                                date1: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            },
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $sort: {
                            "_id.date": 1,
                        },
                    },
                ]).then((correct) => {
                    // var data = [];
                    // if (inward_response.length != 0 && correct.length != 0) {
                    //     for (var i = 0; i < inward_response.length; i++) {
                    //         for (var j = 0; j < correct.length; j++) {
                    //             if (inward_response[i]?._id.date === correct[j]?._id.date) {
                    //                 data.push({ date: inward_response[i]?._id.date, fake: inward_response[i]?.count, correct: correct[j]?.count })
                    //             } else if (inward_response[i]?._id.date != correct[j]?._id.date) {
                    //                 data.push({ date: inward_response[i]?._id.date, fake: inward_response[i]?.count, correct: 0 })
                    //                 data.push({ date: inward_response[i]?._id.date, fake: 0, correct: correct[j]?.count })
                    //             }
                    //         }
                    //     }
                    // } else if (inward_response.length === 0) {
                    //     for (var j = 0; j < correct.length; j++) {
                    //         data.push({ date: inward_response[i]?._id.date, fake: 0, correct: correct[j]?.count })
                    //     };
                    // } else if (correct.length === 0) {
                    //     for (var j = 0; j < inward_response.length; j++) {
                    //         data.push({ date: inward_response[i]?._id.date, fake: inward_response[i]?.count, correct: 0 })
                    //     }
                    // }

                    res.status(200).send({
                        correct: correct,
                        fake: inward_response,
                        status: "success",
                    });
                    //////////////
                });
                //////////////
            });
        } else {
            if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
                where["date"] = {
                    $gte: new Date(req.body.start_date),
                    $lt: new Date(req.body.end_date),
                };
            }
            where["correct"] = 0;
            Upload.aggregate([
                { $match: where },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                            date1: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        "_id.date": 1,
                    },
                },
            ]).then((inward_response) => {
                var where1 = {};
                if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
                    where1["date"] = {
                        $gte: new Date(req.body.start_date),
                        $lt: new Date(req.body.end_date),
                    };
                }
                where1["correct"] = 1;
                Upload.aggregate([
                    { $match: where1 },
                    {
                        $group: {
                            _id: {
                                date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                                date1: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            },

                            count: { $sum: 1 },
                        },
                    },
                    {
                        $sort: {
                            "_id.date": 1,
                        },
                    },
                ]).then((correct) => {
                    // var data = [];
                    // if (inward_response.length != 0 && correct.length != 0) {
                    //     for (var i = 0; i < inward_response.length; i++) {
                    //         for (var j = 0; j < correct.length; j++) {
                    //             if (inward_response[i]?._id.date === correct[j]?._id.date) {
                    //                 data.push({ date: inward_response[i]?._id.date, fake: inward_response[i]?.count, correct: correct[j]?.count })
                    //             } else if (inward_response[i]?._id.date != correct[j]?._id.date) {
                    //                 data.push({ date: inward_response[i]?._id.date, fake: inward_response[i]?.count, correct: 0 })
                    //                 data.push({ date: inward_response[i]?._id.date, fake: 0, correct: correct[j]?.count })
                    //             }
                    //         }
                    //     }
                    // } else if (inward_response.length === 0) {
                    //     for (var j = 0; j < correct.length; j++) {
                    //         data.push({ date: inward_response[i]?._id.date, fake: 0, correct: correct[j]?.count })
                    //     };
                    // } else if (correct.length === 0) {
                    //     for (var j = 0; j < inward_response.length; j++) {
                    //         data.push({ date: inward_response[i]?._id.date, fake: inward_response[i]?.count, correct: 0 })
                    //     }
                    // }

                    res.status(200).send({
                        correct: correct,
                        fake: inward_response,
                        status: "success",
                    });
                    //////////////
                });
                //////////////
            });
        }
    },
    fetch_date_bise_upload: function (req, res) {
        var where = {};
        // if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
        //     where["date"] = {
        //         $gte: new Date(req.body.start_date),
        //         // $lt: new Date(req.body.end_date),
        //     };
        // }
        var da = new Date(req.body.start_date);
        where["createdAt"] = {
            $gte: new Date(req.body.start_date),
            $lt: new Date(da).setDate(da.getDate() + 1),
        };
        if (req.body.role === "client-user") {
            where['user'] = req.body.user;
        }
        where['correct'] = Number(req.body.correct);
        Upload.find(where).then(respon => {
            res.status(200).send({
                result: respon,
                status: "success",
            });
        }).catch(err => console.log(err));
    },
    create_plan: function (req, res) {
        var where = {};
        where["name"] = req.body.name;
        where["deleted"] = 0;
        Plan.findOne(where).then((respon) => {
            if (respon != null) {
                res.status(200).send({
                    status: "error",
                    message: "Plan with this name already in db"
                });
            } else {
                var plan = new Plan({
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    old_price: req.body.old_price,
                    project_limit: req.body.project_limit,
                    validity_days: req.body.validity_days
                });
                plan.save().then(function (response) {
                    if (response) {
                        res.status(200).send({
                            status: "success",
                            message: "Plan created"
                        });
                    } else {
                        res.status(200).send({
                            status: "error",
                            message: "Something went wrong please try again later !!",
                        });
                    }
                });
            }
        })
    },
    fetch_all_plan: function (req, res) {
        var where = {};
        where["deleted"] = 0;
        Plan.find(where).then(response => {
            res.status(200).send({
                status: "success",
                result: response
            });
        }).catch((err) => console.log(err));
    },
    fetch_singel_plan: function (req, res) {
        var where = {};
        where["deleted"] = 0;
        where["_id"] = req.body.id;
        Plan.findOne(where).then(response => {
            res.status(200).send({
                status: "success",
                result: response
            });
        }).catch((err) => console.log(err));
    },
    update_plan: function (req, res) {
        Plan.findOneAndUpdate(
            { _id: req.body.id },
            {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                old_price: req.body.old_price,
                project_limit: req.body.project_limit,
                validity_days: req.body.validity_days
            },
            {
                new: true,
            }
        )
            .exec()
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    message: "Plan data successfully updated.",
                });
                return;
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: "Something went wrong",
                });
                return;
            });
    },
    update_plan_status: function (req, res) {
        Plan.findOneAndUpdate(
            { _id: req.body.id },
            {
                active: req.body.status
            },
            {
                new: true,
            }
        )
            .exec()
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    message: "Plan status updated.",
                });
                return;
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: "Something went wrong",
                });
                return;
            });
    },
    delete_plan: function (req, res) {
        Plan.findOneAndUpdate(
            { _id: req.body.id },
            {
                deleted: 1
            },
            {
                new: true,
            }
        )
            .exec()
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    message: "Plan status updated.",
                });
                return;
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: "Something went wrong",
                });
                return;
            });
    }
}