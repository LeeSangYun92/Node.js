const express = require('express');
const router = express.Router();

const async = require('async');
const pool = require('../../config/dbPool.js');

router.get('/:user_id',function(req,res){
    
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
            let selectShopQuery = 'select shop_name,shop_content,shop_image,review_count from shop where shop_idx in (select shop_idx from bookmark where user_id=?)';
                
            connection.query(selectShopQuery,String(req.params.user_id), function(err, result){
                if(err){
                    res.status(500).send({
                        message : "Internal Server Error"
                    });
                    callback("connection.query Error : " + err);
                }
                else{
                    res.status(200).send({
                        message : "Successfully Get Shop Data",
                        data : result
                    });
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
