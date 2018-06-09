const express = require('express');
const router = express.Router();
const async = require('async');
const pool = require('../../config/dbPool.js');
const moment = require('moment')
const upload = require('../../config/multer.js');

// router.post('/', upload.array('image'), function (req, res) { //add review
//     const shop_name = req.body.shop_name;
//     const shop_category = req.body.shop_category;
//     const shop_info = req.body.shop_info;
//     const menu_name =  req.body.menu_name;
//     const menu_price = req.body.menu_price;
//     const shop_content = req.body.shop_content;
//     let taskArray = [
//         function (callback) {
//             pool.getConnection(function (err, connection) {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).send({
//                         message: "Internal Server Error"
//                     });
//                     callback("pool.getConnection Error : " + err);
//                 } else {
//                     callback(null, connection);
//                 }
//             })
//         },
//         function (connection, callback) {

//             insertReviewQuery = 'INSERT INTO shop(shop_name,shop_category,shop_content,shop_image,shop_info,review_count) VALUES (?,?,?,?,?,?)'
//             connection.query(insertReviewQuery, [shop_name, shop_category, shop_content, req.files[0].location, shop_info, 0], function (err, result) {
//                 if (err) {
//                     res.status(500).send({
//                         message: "Internal Server Error1"
//                     });
//                     connection.release();
//                     callback("Insert Review Error : " + err)
//                 } else {
//                     callback(null, connection);
//                 }
//             })
//         },
//         function (connection, callback) {
            
//             let insertQuery = "insert into menu values((select shop_idx from shop where shop_name= ?),?,?)";
//             for(var i=0;i<menu_name.length;i++)
//             {
//                 connection.query(insertQuery, [shop_name,menu_name[i],menu_price[i]],function(err,result){
//                     if( i === menu_name.length)
//                     {
//                         if (err) {
//                             res.status(500).send({
//                                 message: "Internal Server Error2"
//                             });
//                             connection.release();
//                             callback("Update Reviewcount of shop Error : " + err)
//                         } else {
//                             res.status(201).send({
//                                 message: 'success to add review & update reviewcount of shop'
//                             })
//                             connection.release();
//                             callback(null, "success to update ");
//                         }
//                     }
//                 })
//             }

//             // let insertQuery = "insert into menu values((select shop_idx from shop where shop_name= ?),?,?)";
//             // connection.query(insertQuery, [shop_name,menu_name,menu_price], function (err, result) {
//             //     if(err){
//             //         res.status(500).send({
//             //           message : "Internal Server Error2"
//             //         });
//             //         connection.release();
//             //         callback("Update Reviewcount of shop Error : " + err)
//             //       } else{
//             //         res.status(201).send({
//             //           message : 'success to add review & update reviewcount of shop'
//             //         })
//             //         connection.release();
//             //         callback(null,"success to update ");
//             //       }
//             // })  
//         }
//     ]
//     async.waterfall(taskArray, function (err, result) {
//         if (err)
//             console.log(err);
//         else
//             console.log(result);
//     })
// })

router.post('/', upload.array('image'), function (req, res) {
    const shop_name = req.body.shop_name;
    const shop_category = req.body.shop_category;
    const shop_info = req.body.shop_info;
    const menu_name = req.body.menu_name;
    const menu_price = req.body.menu_price;
    const shop_content = req.body.shop_content;

    let taskArray = [
        function (callback) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    res.status(500).send({
                        message: "Internal Server Error"
                    });
                    callback("pool.getConnection Error : " + err);
                } else {
                    callback(null, connection);
                }
            })
        },
        function (connection, callback) {
            let { shop_category, shop_name, shop_content } = req.body;
            let insertShopQuery = 'INSERT INTO shop(shop_name,shop_category,shop_content,shop_image,shop_info) VALUES(?,?,?,?,?)'
            connection.query(insertShopQuery, [shop_name, shop_category, shop_content, req.files[0].location, shop_info], function (err, result) {
                if (err) {
                    res.status(500).send({
                        message: 'insert shop query Error'
                    })
                    connection.release();
                    callback('insert shop query Error' + err);
                } else {
                    // console.log("result ="+ JSON.stringify(result));
                    callback(null, connection);
                    // callback(null);
                }
            })
        },
        function (connection, callback) {
            let selectQuery = 'SELECT shop_idx FROM shop WHERE shop_name = ?';
            connection.query(selectQuery, req.body.shop_name, function (err, result) {
                if (err) {
                    res.status.send({
                        message: "select Query ERR"
                    })
                    connection.release();
                    callback("Select Query error")
                } else {
                    callback(null, result[0].shop_idx, connection);
                }
            })
        },
        // function (shop_idx, connection, callback) {
        //     console.log(shop_idx)


        //     let mname = [], mprice = [];
        //     mname = menu_name.split(',');
        //     mprice = menu_price.split(',');


        //     mname = menu_name;
        //     mprice = menu_price;
        //     console.log(mname);
        //     console.log(mprice);

        //     // async.forEach(arr, function(item,callback){
        //     //     let insertQuery = 'INSERT INTO menu(shop_idx,menu_name,menu_price) VALUES (?,?,?) '
        //     //     connection.query(insertQuery, [shop_idx, mname[item], mprice[item]], function (err, result) {
        //     //         // if (err) {
        //     //         //     res.status(500).send({
        //     //         //         message: 'Insert menu Query Error '
        //     //         //     })
        //     //         //     connection.release();
        //     //         //     callback('Insert menu Query Error :' + err)
        //     //         // }
        //     //         console.log(mname[item]);
        //     //     })
        //     // },function(err){
        //     //     if (err) {
        //     //             res.status(500).send({
        //     //                 message: 'Insert menu Query Error '
        //     //             })
        //     //             connection.release();
        //     //             callback('Insert menu Query Error :' + err)
        //     //     }
        //     // });
        //     for (var i = 0; i < mname.length; i++) {
        //         let insertQuery = 'INSERT INTO menu(shop_idx,menu_name,menu_price) VALUES (?,?,?) '
        //         connection.query(insertQuery, [shop_idx, mname, mprice], function (err, result) {
        //             // if (err) {
        //             //     res.status(500).send({
        //             //         message: 'Insert menu Query Error '
        //             //     })
        //             //     connection.release();
        //             //     callback('Insert menu Query Error :' + err)
        //             // }
        //         })
        //     }
        //     connection.release();
        //     res.status(201).send({
        //         message: 'Success to insert '
        //     })
        //     callback(null, 'Success to insert ');

        // },
        function(shop_idx,connection,callback){
            
            let mname ="" , mprice="";

            for(var i =0;i<menu_name.length;i++)
            {
                if(i === menu_name.length-1)
                {
                    mname += menu_name[i];
                    mprice += menu_price[i];
                }
                else{
                    mname += menu_name[i]+",";
                    mprice += menu_price[i]+",";
                }
            }
            console.log(mname);
            console.log(mprice);

            let insertQuery = "INSERT INTO menu(shop_idx,menu_name,menu_price) VALUES (?,?,?)";
            connection.query(insertQuery,[shop_idx, mname, mprice],function(err,result){
              if(err){
                res.status(500).send({
                  message : "Internal Server Error"
                });
                connection.release();
                callback("Insert menu Query Error : " + err)
              } else{
                res.status(201).send({
                  message : 'success add to shop'
                })
                connection.release();
                callback(null,"success add to shop");
              }
            })
          }
    
    ];

    async.waterfall(taskArray, function (err, result) {
        if (err)
            console.log(err)
        else
            console.log(result)
    })
})

module.exports =router;