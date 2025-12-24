const mongoose = require("mongoose");
const Log = require("../models/Log");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

module.exports = {
    fetch_all_logs: async function (req, res) {
        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = userId;
        where["project"] = projectId;

        if (req.body.log_category) {
            where["log_category"] = req.body.log_category;
        }

        if (req.body.source && req.query.source != "") {
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

        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }

        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            where["createdAt"] = {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date),
            };
        } else {
            where["createdAt"] = {
                $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            };
        }
        const countLogs = await Log.find(where).countDocuments();

        Log.find(where, null, {
            limit: parseInt(req.body.limit),
            skip: parseInt(req.body.page),
        })
            .sort("-createdAt")
            .then((response) => {
                res.status(200).send({
                    status: "success",
                    result: response,
                    count: countLogs
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    user_visited_pages: function (req, res) {
        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = userId;
        where["project"] = projectId;
        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        if (req.body.source && req.query.source != "") {
            where["source"] = req.body.source;
        }
        if (req.body.type) {
            where["type"] = req.body.type;
        }
        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            where["createdAt"] = {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date),
            };
        } else {
            where["createdAt"] = {
                $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            };
        }
        where["source"] = "website";

        Log.find(where)
            .sort("createdAt")
            .then((response) => {
                if (response == null) {
                    res.status(200).send({
                        status: "error",
                        message: "data not found",
                    });
                }
                
                var productMax = [];

                var updatedProductList = [];

                response.map((pid) => {
                    productMax.push({
                        page_name: pid.page_name,
                        state: pid.state,
                        city: pid.city,
                        event: pid.event,
                        event_data: pid.event_data,
                        quantity: 1,
                        id: pid?._id
                    });
                });

                productMax?.map((p, i) => {
                    const productExists = updatedProductList.some((product) => product.page_name === p.page_name);
                    if (productExists) {
                        // console.log("User exists");
                        var index = updatedProductList.findIndex((product) => product.page_name === p.page_name);
                        var qty = updatedProductList[index].quantity;
                        updatedProductList.splice(index, 1);
                        updatedProductList.push({ id: p.id, quantity: p.quantity + qty, page_name: p.page_name, state: p.state, city: p.city, event_data: p.event_data, event: p.event });
                    } else {
                        updatedProductList.push({ id: p.id, quantity: p.quantity, page_name: p.page_name, state: p.state, city: p.city, event_data: p.event_data, event: p.event });
                    }
                });
                var where1 = {};
                if (req.body.type) {
                    where1["type"] = req.body.type;
                }
                where1["user"] = userId;
                where1["project"] = projectId;
                if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
                    where1["createdAt"] = {
                        $gte: new Date(req.body.start_date),
                        $lt: new Date(req.body.end_date),
                    };
                } else {
                    where1["createdAt"] = {
                        $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
                    };
                }
                if (req.body.pincode) {
                    where1["pincode"] = req.body.pincode;
                }
                where1["source"] = "android";
                Log.find(where1)
                    .sort("createdAt")
                    .populate("user log_category project")
                    .then((response1) => {
                        if (response == null) {
                            res.status(200).send({
                                status: "error",
                                message: "data not found",
                            });
                        }
                        var productMax1 = [];

                        var updatedProductList1 = [];

                        response1.map((pid) => {
                            productMax1.push({
                                page_name: pid.page_name,
                                state: pid.state,
                                city: pid.city,
                                event: pid.event,
                                event_data: pid.event_data,
                                quantity: 1,
                                id: pid?._id
                            });
                        });

                        productMax1?.map((p, i) => {
                            const productExists = updatedProductList1.some((product) => product.page_name === p.page_name);
                            if (productExists) {
                                // console.log("User exists");
                                var index = updatedProductList1.findIndex((product) => product.page_name === p.page_name);
                                var qty = updatedProductList1[index].quantity;
                                updatedProductList1.splice(index, 1);
                                updatedProductList1.push({ id: p.id, quantity: p.quantity + qty, page_name: p.page_name, state: p.state, city: p.city, event_data: p.event_data, event: p.event });
                            } else {
                                updatedProductList1.push({ id: p.id, quantity: p.quantity, page_name: p.page_name, state: p.state, city: p.city, event_data: p.event_data, event: p.event });
                            }
                        });


                        // res.status(200).send({
                        //     status: "success",
                        //     message: "Data Found.",
                        //     website: updatedProductList.sort((a, b) => a.page_name.localeCompare(b.page_name)),
                        //     android: updatedProductList1.sort((a, b) => a.page_name.localeCompare(b.page_name)),
                        //     ios: updatedProductList2.sort((a, b) => a.page_name.localeCompare(b.page_name))
                        // });
                        var where2 = {};
                        if (req.body.type) {
                            where2["type"] = req.body.type;
                        }
                        where2["user"] = userId;
                        where2["project"] = projectId;
                        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
                            where2["createdAt"] = {
                                $gte: new Date(req.body.start_date),
                                $lt: new Date(req.body.end_date),
                            };
                        } else {
                            where2["createdAt"] = {
                                $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
                            };
                        }
                        if (req.body.pincode) {
                            where2["pincode"] = req.body.pincode;
                        }
                        where2["source"] = "ios";
                        Log.find(where2)
                            .sort("createdAt")
                            .populate("user log_category project")
                            .then((response2) => {
                                if (response == null) {
                                    res.status(200).send({
                                        status: "error",
                                        message: "data not found",
                                    });
                                }
                                var productMax2 = [];

                                var updatedProductList2 = [];

                                response2.map((pid) => {
                                    productMax2.push({
                                        page_name: pid.page_name,
                                        state: pid.state,
                                        city: pid.city,
                                        event: pid.event,
                                        event_data: pid.event_data,
                                        quantity: 1,
                                        id: pid?._id
                                    });
                                });

                                productMax2?.map((p, i) => {
                                    const productExists = updatedProductList2.some((product) => product.page_name === p.page_name);
                                    if (productExists) {
                                        // console.log("User exists");
                                        var index = updatedProductList2.findIndex((product) => product.page_name === p.page_name);
                                        var qty = updatedProductList2[index].quantity;
                                        updatedProductList2.splice(index, 1);
                                        updatedProductList2.push({ id: p.id, quantity: p.quantity + qty, page_name: p.page_name, state: p.state, city: p.city, event_data: p.event_data, event: p.event });
                                    } else {
                                        updatedProductList2.push({ id: p.id, quantity: p.quantity, page_name: p.page_name, state: p.state, city: p.city, event_data: p.event_data, event: p.event });
                                    }
                                });


                                res.status(200).send({
                                    status: "success",
                                    message: "Data Found.",
                                    website: updatedProductList.sort((a, b) => a.page_name.localeCompare(b.page_name)),
                                    android: updatedProductList1.sort((a, b) => a.page_name.localeCompare(b.page_name)),
                                    ios: updatedProductList2.sort((a, b) => a.page_name.localeCompare(b.page_name))
                                });
                            });
                    });
            });
    },
    city_wise_list: function (req, res) {
        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = userId;
        where["project"] = projectId;
        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        if (req.body.type) {
            where["type"] = req.body.type;
        }
        if (req.body.source && req.query.source != "") {
            where["source"] = req.body.source;
        }
        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            where["createdAt"] = {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date),
            };
        } else {
            where["createdAt"] = {
                $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            };
        }

        Log.find(where)
            .sort("createdAt")
            .then((response) => {
                if (response == null) {
                    res.status(200).send({
                        status: "error",
                        message: "data not found",
                    });
                }
                var productMax = [];

                var updatedProductList = [];

                response.map((pid) => {
                    productMax.push({
                        page_name: pid.page_name,
                        state: pid.state,
                        city: pid.city,
                        event: pid.event,
                        event_data: pid.event_data,
                        quantity: 1,
                        country: pid.country,
                    });
                });

                productMax?.map((p, i) => {
                    const productExists = updatedProductList.some((product) => product.city === p.city);
                    if (productExists) {
                        // console.log("User exists");
                        var index = updatedProductList.findIndex((product) => product.city === p.city);
                        var qty = updatedProductList[index].quantity;
                        updatedProductList.splice(index, 1);
                        updatedProductList.push({ id: p.id, quantity: p.quantity + qty, page_name: p.page_name, state: p.state, city: p.city, event_data: p.event_data, event: p.event, country: p.country });
                    } else {
                        updatedProductList.push({ id: p.id, quantity: p.quantity, page_name: p.page_name, state: p.state, city: p.city, event_data: p.event_data, event: p.event, country: p.country });
                    }
                });
                res.status(200).send({
                    status: "success",
                    message: "data found.",
                    result: updatedProductList.sort((a, b) => b.quantity - a.quantity)
                });
            });
    },
    order_count_list: function (req, res) {
        var where = {};
        where["type"] = "checkout";

        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        where["user"] = new mongoose.Types.ObjectId(userId);
        where["project"] = new mongoose.Types.ObjectId(projectId);
        // if (req.body.type) {
        //     where["type"] = req.body.type;
        // }

        if (req.body.source && req.query.source != "") {
            where["source"] = req.body.source;
        }
        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            where["createdAt"] = {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date),
            };
        } else {
            where["createdAt"] = {
                $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            };
        }

        Log.aggregate([
            { $match: where },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } }
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
            res.status(200).send({
                result: inward_response,
                status: "success",
                token: req.token,
            });
            //////////////
        });
    },
    activeuserdata: function (req, res) {
        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = new mongoose.Types.ObjectId(userId);
        where["project"] = new mongoose.Types.ObjectId(projectId);
        if (req.body.type) {
            where["type"] = req.body.type;
        }
        if (req.body.source && req.query.source != "") {
            where["source"] = req.body.source;
        }
        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            where["createdAt"] = {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date),
            };
        } else {
            where["createdAt"] = {
                $gt: new Date(new Date().getTime() - 1000 * 60 * 5)
            };
        }
        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        Log.aggregate([
            { $match: where },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                    },
                    uniqueValues: { $addToSet: "$geo_ip" },
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
            where1["user"] = new mongoose.Types.ObjectId(userId);
            where1["project"] = new mongoose.Types.ObjectId(projectId);
            if (req.body.type) {
                where1["type"] = req.body.type;
            }
            if (req.body.source && req.query.source != "") {
                where1["source"] = req.body.source;
            }
            if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
                where1["createdAt"] = {
                    $gte: new Date(req.body.start_date),
                    $lt: new Date(req.body.end_date),
                };
            } else {
                where1["createdAt"] = {
                    $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 6)
                };
            }
            if (req.body.pincode) {
                where1["pincode"] = req.body.pincode;
            };
            Log.aggregate([
                { $match: where1 },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        "_id.date": 1,
                    },
                },
            ]).then((inward_response2) => {
                res.status(200).send({
                    result: inward_response,
                    uniqueValues: inward_response[0]?.uniqueValues?.length,
                    status: "success",
                    last_seven_days: inward_response2
                });
                //////////////
            });
            //////////////
        });
    },
    user_filtered_logs: function (req, res) {
        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = userId;
        where["project"] = projectId;

        if (req.body.source && req.query.source != "") {
            where["source"] = req.body.source;
        }
        if (req.body.type) {
            where["type"] = req.body.type;
        }
        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            where["createdAt"] = {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date),
            };
        } else {
            where["createdAt"] = {
                $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            };
        }
        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        Log.find(where)
            .sort("createdAt")
            .then((response) => {
                if (response == null) {
                    res.status(200).send({
                        status: "error",
                        message: "data not found",
                    });
                }
                var productMax = [];

                var updatedProductList = [];

                response.map((pid) => {
                    if (pid?.user_id) {
                        productMax.push({
                            user_id: pid.user_id,
                            quantity: 1,
                        });
                    } else {
                        return;
                    }
                });

                productMax?.map((p, i) => {
                    const productExists = updatedProductList.some((product) => product.user_id === p.user_id);
                    if (productExists) {
                        var index = updatedProductList.findIndex((product) => product.user_id === p.user_id);
                        var qty = updatedProductList[index].quantity;
                        updatedProductList.splice(index, 1);
                        updatedProductList.push({ user_id: p.user_id, quantity: p.quantity + qty });
                    } else {
                        updatedProductList.push({ user_id: p.user_id, quantity: p.quantity });
                    }
                });
                res.status(200).send({
                    status: "success",
                    message: "Data Found.",
                    result: updatedProductList.sort((a, b) => b.quantity - a.quantity),
                });
            });
    },
    product_filtered_logs: function (req, res) {
        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = userId;
        where["project"] = projectId;

        if (req.body.source && req.query.source != "") {
            where["source"] = req.body.source;
        }

        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            where["createdAt"] = {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date),
            };
        } else {
            where["createdAt"] = {
                $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            };
        }
        if (req.body.type) {
            where["type"] = req.body.type;
        }
        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        Log.find(where)
            .sort("createdAt")
            .then((response) => {
                if (response == null) {
                    res.status(200).send({
                        status: "error",
                        message: "data not found",
                    });
                }
                var productMax = [];

                var updatedProductList = [];

                response.map((pid) => {
                    if (pid?.product_id) {
                        productMax.push({
                            product_id: pid.product_id,
                            quantity: 1,
                        });
                    } else {
                        return;
                    }
                });

                productMax?.map((p, i) => {
                    const productExists = updatedProductList.some((product) => product.product_id === p.product_id);
                    if (productExists) {
                        var index = updatedProductList.findIndex((product) => product.product_id === p.product_id);
                        var qty = updatedProductList[index].quantity;
                        updatedProductList.splice(index, 1);
                        updatedProductList.push({ product_id: p.product_id, quantity: p.quantity + qty });
                    } else {
                        updatedProductList.push({ product_id: p.product_id, quantity: p.quantity });
                    }
                });
                res.status(200).send({
                    status: "success",
                    message: "Data Found.",
                    result: updatedProductList.sort((a, b) => b.quantity - a.quantity),
                });
            });
    },
    log_list_according_user_Id: function (req, res) {
        var where = {};

        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        where["user"] = new mongoose.Types.ObjectId(userId);
        where["project"] = new mongoose.Types.ObjectId(projectId);

        where["user_id"] = req.body.user_id;

        if (req.body.type) {
            where["type"] = req.body.type;
        }
        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        Log.find(where)
            .sort("-createdAt")
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
    log_list_according_product_Id: function (req, res) {
        var where = {};

        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        where["user"] = new mongoose.Types.ObjectId(userId);
        where["project"] = new mongoose.Types.ObjectId(projectId);

        where["product_id"] = req.body.product_id;

        if (req.body.type) {
            where["type"] = req.body.type;
        }
        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        Log.find(where)
            .sort("-createdAt")
            .then((response) => {

                var productMax = [];

                var updatedProductList = [];

                response.map((pid) => {
                    if (pid?.user_id) {
                        productMax.push({
                            user_id: pid.user_id,
                            quantity: 1,
                        });
                    } else {
                        return;
                    }
                });

                productMax?.map((p, i) => {
                    const productExists = updatedProductList.some((product) => product.user_id === p.user_id);
                    if (productExists) {
                        var index = updatedProductList.findIndex((product) => product.user_id === p.user_id);
                        var qty = updatedProductList[index].quantity;
                        updatedProductList.splice(index, 1);
                        updatedProductList.push({ user_id: p.user_id, quantity: p.quantity + qty });
                    } else {
                        updatedProductList.push({ user_id: p.user_id, quantity: p.quantity });
                    }
                });



                res.status(200).send({
                    status: "success",
                    result: response,
                    users: updatedProductList.sort((a, b) => b.quantity - a.quantity),
                });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    pincode_list_according_logs: function (req, res) {
        const decodedToken = jwt.decode(req.body.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = userId;
        where["project"] = projectId;

        if (req.body.type) {
            where["type"] = req.body.type;
        }
        if (req.body.source && req.query.source != "") {
            where["source"] = req.body.source;
        }
        if (req.body.start_date && req.body.start_date != "" && req.body.end_date && req.body.end_date != "") {
            where["createdAt"] = {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date),
            };
        } else {
            where["createdAt"] = {
                $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            };
        }

        Log.find(where)
            .sort("createdAt")
            .then((response) => {
                if (response == null) {
                    res.status(200).send({
                        status: "error",
                        message: "data not found",
                    });
                }
                var productMax = [];

                var updatedProductList = [];

                response.map((pid) => {
                    productMax.push({
                        pincode: pid?.pincode,
                        quantity: 1,
                        country: pid.country,
                    });
                });

                productMax?.map((p, i) => {
                    const productExists = updatedProductList.some((product) => product.pincode === p.pincode);
                    if (productExists) {
                        // console.log("User exists");
                        var index = updatedProductList.findIndex((product) => product.pincode === p.pincode);
                        var qty = updatedProductList[index].quantity;
                        updatedProductList.splice(index, 1);
                        updatedProductList.push({ quantity: p.quantity + qty, pincode: p.pincode });
                    } else {
                        updatedProductList.push({ quantity: p.quantity, pincode: p.pincode });
                    }
                });
                res.status(200).send({
                    status: "success",
                    message: "data found.",
                    result: updatedProductList.sort((a, b) => b.quantity - a.quantity)
                });
            });
    },
    fetch_log_on_daily: async function (req, res) {
        const decodedToken = jwt.decode(req.body.token || req.query.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = userId;
        where["project"] = projectId;

        where["log_category"] = req.body.log_category;

        where["createdAt"] = {
            $gt: new Date(new Date().getTime() - 1000 * 60 * 10)
        };
        where["type"] = "page visit";
        where["user_id"] = { $ne: "" }
        where["product_id"] = { $ne: "" }
        Log.find(where)
            .select("user_id product_id type")
            .sort("-createdAt")
            .then((page_visit) => {

                var where1 = {};
                where1["user"] = userId;
                where1["project"] = projectId;

                where1["createdAt"] = {
                    $gt: new Date(new Date().getTime() - 1000 * 60 * 10)
                };
                where1["type"] = "add to cart";
                where1["log_category"] = req.body.log_category;
                where1["user_id"] = { $ne: "" }
                where1["product_id"] = { $ne: "" }
                Log.find(where1)
                    .select("user_id product_id type")
                    .sort("-createdAt")
                    .then((add_to_cart) => {

                        var where2 = {};
                        where2["user"] = userId;
                        where2["project"] = projectId;
                        where2["createdAt"] = {
                            $gt: new Date(new Date().getTime() - 1000 * 60 * 10)
                        };
                        where2["type"] = "checkout";
                        where2["log_category"] = req.body.log_category;
                        where2["user_id"] = { $ne: "" }
                        Log.find(where2)
                            .select("user_id product_id type")
                            .sort("-createdAt")
                            .then((checkout) => {

                                var where3 = {};
                                where3["user"] = userId;
                                where3["project"] = projectId;
                                where3["createdAt"] = {
                                    $gt: new Date(new Date().getTime() - 1000 * 60 * 10)
                                };
                                where3["type"] = "login";
                                where3["log_category"] = req.body.log_category;
                                where3["user_id"] = { $ne: "" };

                                Log.find(where3)
                                    .select("user_id type")
                                    .sort("-createdAt")
                                    .then((login) => {
                                        ////Page Visit
                                        var productMax = [];

                                        var updatedProductList = [];

                                        page_visit.map((pid) => {
                                            productMax.push({
                                                user_id: pid.user_id,
                                                product_id: pid.product_id,
                                                type: pid.type,
                                            });
                                        });

                                        productMax?.map((p, i) => {
                                            const productExists = updatedProductList.some((product) => product.user_id === p.user_id);
                                            if (productExists) {
                                                // console.log("User exists");
                                                var index = updatedProductList.findIndex((product) => product.user_id === p.user_id);

                                                updatedProductList.splice(index, 1);
                                                updatedProductList.push({ user_id: p.user_id, product_id: p.product_id, type: p.type });
                                            } else {
                                                updatedProductList.push({ user_id: p.user_id, product_id: p.product_id, type: p.type });
                                            }
                                        });


                                        ////Add to Cart
                                        var productMax1 = [];

                                        var updatedProductList1 = [];

                                        add_to_cart.map((pid) => {
                                            productMax1.push({
                                                user_id: pid.user_id,
                                                product_id: pid.product_id,
                                                type: pid.type,
                                            });
                                        });

                                        productMax1?.map((p, i) => {
                                            const productExists = updatedProductList1.some((product) => product.user_id === p.user_id);
                                            if (productExists) {
                                                // console.log("User exists");
                                                var index = updatedProductList1.findIndex((product) => product.user_id === p.user_id);

                                                updatedProductList1.splice(index, 1);
                                                updatedProductList1.push({ user_id: p.user_id, product_id: p.product_id, type: p.type });
                                            } else {
                                                updatedProductList1.push({ user_id: p.user_id, product_id: p.product_id, type: p.type });
                                            }
                                        });
                                        console.log(login, login?.length)
                                        res.status(200).send({
                                            status: "success",
                                            page_visit: updatedProductList,
                                            add_to_cart: updatedProductList1,
                                            checkout: checkout,
                                            login: login
                                        });
                                    })
                                    .catch((error) => {
                                        res.status(200).send({
                                            status: "error",
                                            message: error,
                                        });
                                    });

                            })
                            .catch((error) => {
                                res.status(200).send({
                                    status: "error",
                                    message: error,
                                });
                            });
                    })
                    .catch((error) => {
                        res.status(200).send({
                            status: "error",
                            message: error,
                        });
                    });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
    fetch_log_on_daily_for_survey: async function (req, res) {
        const decodedToken = jwt.decode(req.body.token || req.query.token);
        const userId = decodedToken?.user;
        const projectId = decodedToken?.project;

        var where = {};
        where["user"] = userId;
        where["project"] = projectId;

        where["log_category"] = req.body.log_category;

        where["createdAt"] = {
            $gt: new Date(new Date().getTime() - 1000 * 60 * 60)
        };
        where["type"] = "page visit";
        where["user_id"] = { $ne: "" }
        where["product_id"] = { $ne: "" }
        Log.find(where)
            .select("user_id product_id type")
            .sort("-createdAt")
            .then((page_visit) => {

                var where1 = {};
                where1["user"] = userId;
                where1["project"] = projectId;

                where1["createdAt"] = {
                    $gt: new Date(new Date().getTime() - 1000 * 60 * 60)
                };
                where1["type"] = "add to cart";
                where1["log_category"] = req.body.log_category;
                where1["user_id"] = { $ne: "" }
                where1["product_id"] = { $ne: "" }
                Log.find(where1)
                    .select("user_id product_id type")
                    .sort("-createdAt")
                    .then((add_to_cart) => {

                        var where2 = {};
                        where2["user"] = userId;
                        where2["project"] = projectId;
                        where2["createdAt"] = {
                            $gt: new Date(new Date().getTime() - 1000 * 60 * 60)
                        };
                        where2["type"] = "checkout";
                        where2["log_category"] = req.body.log_category;
                        where2["user_id"] = { $ne: "" }
                        Log.find(where2)
                            .select("user_id product_id type")
                            .sort("-createdAt")
                            .then((checkout) => {

                                var where3 = {};
                                where3["user"] = userId;
                                where3["project"] = projectId;
                                where3["createdAt"] = {
                                    $gt: new Date(new Date().getTime() - 1000 * 60 * 60)
                                };
                                where3["type"] = "login";
                                where3["log_category"] = req.body.log_category;
                                where3["user_id"] = { $ne: "" };

                                Log.find(where3)
                                    .select("user_id type")
                                    .sort("-createdAt")
                                    .then((login) => {
                                        ////Page Visit
                                        var productMax = [];

                                        var updatedProductList = [];

                                        page_visit.map((pid) => {
                                            productMax.push({
                                                user_id: pid.user_id,
                                                product_id: pid.product_id,
                                                type: pid.type,
                                            });
                                        });

                                        productMax?.map((p, i) => {
                                            const productExists = updatedProductList.some((product) => product.user_id === p.user_id);
                                            if (productExists) {
                                                // console.log("User exists");
                                                var index = updatedProductList.findIndex((product) => product.user_id === p.user_id);

                                                updatedProductList.splice(index, 1);
                                                updatedProductList.push({ user_id: p.user_id, product_id: p.product_id, type: p.type });
                                            } else {
                                                updatedProductList.push({ user_id: p.user_id, product_id: p.product_id, type: p.type });
                                            }
                                        });


                                        ////Add to Cart
                                        var productMax1 = [];

                                        var updatedProductList1 = [];

                                        add_to_cart.map((pid) => {
                                            productMax1.push({
                                                user_id: pid.user_id,
                                                product_id: pid.product_id,
                                                type: pid.type,
                                            });
                                        });

                                        productMax1?.map((p, i) => {
                                            const productExists = updatedProductList1.some((product) => product.user_id === p.user_id);
                                            if (productExists) {
                                                // console.log("User exists");
                                                var index = updatedProductList1.findIndex((product) => product.user_id === p.user_id);

                                                updatedProductList1.splice(index, 1);
                                                updatedProductList1.push({ user_id: p.user_id, product_id: p.product_id, type: p.type });
                                            } else {
                                                updatedProductList1.push({ user_id: p.user_id, product_id: p.product_id, type: p.type });
                                            }
                                        });
                                        console.log(login, login?.length)
                                        res.status(200).send({
                                            status: "success",
                                            page_visit: updatedProductList,
                                            add_to_cart: updatedProductList1,
                                            checkout: checkout,
                                            login: login
                                        });
                                    })
                                    .catch((error) => {
                                        res.status(200).send({
                                            status: "error",
                                            message: error,
                                        });
                                    });

                            })
                            .catch((error) => {
                                res.status(200).send({
                                    status: "error",
                                    message: error,
                                });
                            });
                    })
                    .catch((error) => {
                        res.status(200).send({
                            status: "error",
                            message: error,
                        });
                    });
            })
            .catch((error) => {
                res.status(200).send({
                    status: "error",
                    message: error,
                });
            });
    },
}