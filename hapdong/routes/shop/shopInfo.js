const express = require('express');
const router = express.Router();

const async = require('async');
const pool = require('../../config/dbPool.js');

router.post('/',function(req,res){
    let shop_idx = req.body.shop_idx;
    let user_id = req.body.user_id;
    let flag = false;

    let taskArray = [
        function(callback){
            pool.getConnection(function(err,connection){
                if(err){
                    res.status(500).send({
                        message : "Internal Server Error"
                    });
                    callback("pool.getConnection Error : "+err)
                }
                else{
                    callback(null,connection);
                } 
            });
        },
        function (connection, callback) {

            checkQuery = 'select * FROM bookmark WHERE user_id=? and shop_idx=?'
            connection.query(checkQuery, [user_id,shop_idx], function (err, result) {
                if (err) {
                    res.status(500).send({
                        message: "Internal Server Error"
                    });
                    connection.release();
                    callback("Insert Review Error : " + err)
                } else {
                    if(result[0] === undefined)
                        flag = false;
                    else flag = true;
                    callback(null, connection);
                }
            })
        },
        function(connection,callback){
            let selectShopQuery = 'select shop_name, shop_image, shop_info, review_count from shop where shop_idx=?';
                
            connection.query(selectShopQuery,shop_idx, function(err, result){
                if(err){
                    res.status(500).send({
                        message : "Internal Server Error"
                    });
                    callback("connection.query Error : " + err);
                }
                else{
                    if(flag === true ) 
                    {
                        res.status(200).send({
                            message : "Successfully Get Shop Data Yes",
                            data : result
                        });
                    }
                    else {
                        res.status(200).send({
                            message : "Successfully Get Shop Data No",
                            data : result
                        });
                    }                   
                    callback(null,"Successfully Get Shop Data");
                }
                connection.release();
            });
        }       
    ];
    async.waterfall(taskArray, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
        }
    });
});

module.exports = router;