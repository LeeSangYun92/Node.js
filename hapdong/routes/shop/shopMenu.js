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
            let selectShopQuery = 'select * from menu where shop_idx=?';
                
            connection.query(selectShopQuery,shop_idx, function(err, result){
                var menu_name = result[0].menu_name.split(',');
                var menu_price = result[0].menu_price.split(',');
                console.log(menu_name);
                console.log(menu_price);
                var data_list = new Array();

                for(var i = 0;i<menu_name.length;i++)
                {
                    var result_data = new Object();

                    result_data.menu_name = menu_name[i];
                    result_data.menu_price = menu_price[i]; 

                    data_list.push(result_data);
                }
                console.log(data_list);
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
                            data : data_list
                        });
                    }
                    else {
                        res.status(200).send({
                            message : "Successfully Get Shop Data No",
                            data : data_list
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