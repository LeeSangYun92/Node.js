const express = require('express');
const router = express.Router();

const async = require('async');
const pool = require('../../config/dbPool.js');

router.delete('/',function(req,res){
    let user_id  = req.body.user_id;
    let shop_idx = req.body.shop_idx;
    console.log(user_id);

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
        function(connection,callback){
            let selectShopQuery = 'delete from bookmark where user_id=? and shop_idx=?';
            console.log(user_id);
            connection.query(selectShopQuery,[user_id,shop_idx], function(err, result){
                if(err){
                    res.status(500).send({
                        message : "Internal Server Error"
                    });
                    callback("connection.query Error : " + err);
                }
                else{
                    res.status(200).send({
                        message : "Successfully delete bookmark",
                    });
                    callback(null,"Successfully delete bookmark");
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