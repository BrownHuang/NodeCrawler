/**
 * @brief 新聞爬蟲程式
 * 
 * @author Brown Huang
 */

 // 引用套件
var express = require('express');
var request = require('request');
var cheerio = require("cheerio");

//取得環境變數的 Port  
const PORT = process.env.PORT || 3000

//建立 express 物件
const app = express()

//路徑 (ex : 127.0.0.1:3000/)
app.get('/', function(req, res){

    request({
        url: "http://news.ltn.com.tw/list/breakingnews",
        method: "GET"
      }, function(e,r,b) {
        if(e || !b) { return; }
        var $ = cheerio.load(b);
        var result = [];
        var titles = $(".list p");
        var imgs = $(".list img");   
        var urls = $(".list a");
        for(var i=0;i<titles.length;i++) {
            //var obj = {};
            obj = {};
            obj['title'] = $(titles[i]).text().trim();
            obj['img'] = $(imgs[i]).attr('src');
            obj['url'] = $(urls[i]).attr('href');
            result.push(obj);
        }       
        res.send(JSON.stringify(result));        
      });

})

//Web 監聽的 Port 
app.listen(PORT, function(){
    console.log('Example app listening on port 3000!')
})

