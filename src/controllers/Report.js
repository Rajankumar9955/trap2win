const mongoose = require("mongoose");
const Log = require("../models/Log");
const User = require("../models/User");

module.exports = {
    user_visited_pages: function (req, res) {
        var where = {};

        if (req.body.user && req.query.user != "") {
            where["user"] = new mongoose.Types.ObjectId(req.body.user);
        }
        if (req.body.project && req.query.project != "") {
            where["project"] = new mongoose.Types.ObjectId(req.body.project);
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
        where["source"] = "website";
        Log.find(where)
            .sort("createdAt")
            .populate("user log_category project")
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
                // res.status(200).send({
                //     status: "success",
                //     message: "Data Found.",
                //     result: updatedProductList.sort((a, b) => a.page_name.localeCompare(b.page_name))
                // });

                var where1 = {};

                if (req.body.user && req.query.user != "") {
                    where1["user"] = req.body.user;
                }
                if (req.body.project && req.query.project != "") {
                    where1["project"] = req.body.project;
                }
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
                where1["source"] = "android";
                if (req.body.pincode) {
                    where1["pincode"] = req.body.pincode;
                }
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

                        if (req.body.user && req.query.user != "") {
                            where2["user"] = req.body.user;
                        }
                        if (req.body.project && req.query.project != "") {
                            where2["project"] = req.body.project;
                        }
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
        var where = {};

        if (req.body.user && req.query.user != "") {
            where["user"] = req.body.user;
        }
        if (req.body.project && req.query.project != "") {
            where["project"] = req.body.project;
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
            .populate("user log_category project")
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
                        country: pid.country,
                        event: pid.event,
                        event_data: pid.event_data,
                        quantity: 1,
                        id: pid?._id
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

        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        if (req.body.user && req.query.user != "") {
            where["user"] = new mongoose.Types.ObjectId(req.body.user);
        }
        if (req.body.project && req.query.project != "") {
            where["project"] = new mongoose.Types.ObjectId(req.body.project);
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
            });
            //////////////
        });
    },
    activeuserdata: function (req, res) {
        var where = {};

        if (req.body.user && req.query.user != "") {
            where["user"] = new mongoose.Types.ObjectId(req.body.user);
        }
        if (req.body.project && req.query.project != "") {
            where["project"] = new mongoose.Types.ObjectId(req.body.project);
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
                        date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } }
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
            if (req.body.user && req.query.user != "") {
                where1["user"] = new mongoose.Types.ObjectId(req.body.user);
            }
            if (req.body.project && req.query.project != "") {
                where1["project"] = new mongoose.Types.ObjectId(req.body.project);
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
            }
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
                    uniqueValues: inward_response[0]?.uniqueValues?.length ,
                    status: "success",
                    last_seven_days: inward_response2
                });
                //////////////
            });
        });
    },
    user_visited_pages_client: function (req, res) {
        var where = {};

        if (req.body.category && req.query.category != "") {
            where["log_category"] = req.body.category;
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
        where["source"] = "website";
        User.findOne({ "_id": req.body.user }).then((respon) => {
            if (!req.body.category) {
                where["log_category"] = { "$in": respon?.category }
            }
            Log.find(where)
                .sort("createdAt")
                .populate("user log_category project")
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
                    // res.status(200).send({
                    //     status: "success",
                    //     message: "Data Found.",
                    //     result: updatedProductList.sort((a, b) => a.page_name.localeCompare(b.page_name))
                    // });

                    var where1 = {};
                    if (req.body.pincode) {
                        where1["pincode"] = req.body.pincode;
                    }
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
                    where1["source"] = "android";
                    if (req.body.category && req.query.category != "") {
                        where1["log_category"] = req.body.category;
                    }
                    if (!req.body.category) {
                        where1["log_category"] = { "$in": respon?.category }
                    }
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

                            if (req.body.category && req.query.category != "") {
                                where2["log_category"] = req.body.category;
                            }
                            if (req.body.pincode) {
                                where2["pincode"] = req.body.pincode;
                            }
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
                            where2["source"] = "ios";
                            if (!req.body.category) {
                                where2["log_category"] = { "$in": respon?.category }
                            }
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
        })
    },
    city_wise_list_client: function (req, res) {
        var where = {};

        if (req.body.category && req.query.category != "") {
            where["log_category"] = req.body.category;
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
        User.findOne({ "_id": req.body.user }).then((respon) => {
            if (!req.body.category) {
                where["log_category"] = { "$in": respon?.category }
            }
            Log.find(where)
                .sort("createdAt")
                .populate("user log_category project")
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
                            country: pid.country,
                            event: pid.event,
                            event_data: pid.event_data,
                            quantity: 1,
                            id: pid?._id
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
        });
    },
    order_count_list_client: function (req, res) {
        var where = {};
        where["type"] = "checkout";
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
        User.findOne({ "_id": req.body.user }).then((respon) => {
            if (req.body.category && req.query.category != "") {
                where["log_category"] = req.body.category;
            } else {
                where["log_category"] = { "$in": respon?.category }
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
        });
    },
    activeuserdata_client: function (req, res) {
        var where = {};

        if (req.body.pincode) {
            where["pincode"] = req.body.pincode;
        }
        if (req.body.category && req.query.category != "") {
            where["log_category"] = new mongoose.Types.ObjectId(req.body.category);
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
        User.findOne({ "_id": req.body.user }).then((respon) => {
            if (!req.body.category) {
                where["log_category"] = { "$in": respon?.category }
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

                var where1 = {};

                if (req.body.category && req.query.category != "") {
                    where1["log_category"] = new mongoose.Types.ObjectId(req.body.category);
                }
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
                if (!req.body.category) {
                    where1["log_category"] = { "$in": respon?.category }
                }
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
                        status: "success",
                        last_seven_days: inward_response2
                    });
                    //////////////
                });
            });
        });
    }

}