const express = require('express');
const router = express.Router();
const async = require('async');
const pool = require('../../config/dbPool');
const moment = require('moment')
const upload = require('../../config/multer.js');


router.post('/',upload.array('image'),function(req,res) { //add review
  const shop_idx = req.body.shop_idx;
  const user_id = req.body.user_id;
  const review_content = req.body.review_content;
  let taskArray =[  
    function(callback){
      pool.getConnection(function(err,connection){
        if(err){
          console.log(err);
          res.status(500).send({
            message : "Internal Server Error"
          });
          callback("pool.getConnection Error : " + err);
        } else {
          callback(null, connection);
        }
      })
    },
    function(connection,callback){
      insertReviewQuery = 'INSERT INTO review VALUES (?,?,?,?,?)'
      connection.query(insertReviewQuery,[shop_idx,user_id,moment().format('YYYY-MM-DD HH:mm'),req.files[0].location,review_content],function(err,result){
        if(err){
          res.status(500).send({
            message : "Internal Server Error1"
          });
          connection.release();
          callback("Insert Review Error : " + err)
        } else{
          callback(null,shop_idx,connection);
        }
      })
    },
    function(shop_idx,connection,callback){
      let updateQuery = "UPDATE shop SET review_count=review_count+1 WHERE shop_idx = ?";
      connection.query(updateQuery,shop_idx,function(err,result){
        if(err){
          res.status(500).send({
            message : "Internal Server Error2"
          });
          connection.release();
          callback("Update Reviewcount of shop Error : " + err)
        } else{
          res.status(201).send({
            message : 'success to add review & update reviewcount of shop'
          })
          connection.release();
          callback(null,"success to update ");
        }
      })
    }
  
  ]
  async.waterfall(taskArray,function(err,result) {
    if(err)
    console.log(err);
    else
    console.log(result);
  
  })
  })


module.exports =router;