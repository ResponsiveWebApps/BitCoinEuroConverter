var express = require("express");
var app = express();
var request = require("request");
var bodyparser = require("body-parser");
var bitcore = require("bitcore-lib");

app.use(bodyparser.urlencoded({
  extended: true

}));
app.use(bodyparser.json());

app.set("view engine", "ejs");

function brainWallet(uinput, callBack){
  var input = new Buffer(uinput);
  var hash = bitcore.crypto.Hash.sha256(input);
  var bn = bitcore.crypto.BN.fromBuffer(hash);
  var pk = new bitcore.PrivateKey(bn).toWIF();
  var addy = new bitcore.PrivateKey(bn).toAddress();
  callBack(pk,addy);
};

function getPrice(returnPrice){
  request({
    url: "https://blockchain.info/ticker",
    json: true
  }, function(err, response, body){
    returnPrice(body.EUR.last);
  });

};



app.get("/", function(req, res){
  getPrice(function(lastPrice){
    res.render("converter", {
      lastPrice: lastPrice
    });
  });
});

app.get("/converter", function(req, res){
  getPrice(function(lastPrice){
    res.render("converter", {
      lastPrice: lastPrice
    });
  });
});

app.listen(8080, function(){
  console.log("Go.");
});
