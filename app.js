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
        var imgs = $(".list a.ph img"); 
        var times = $(".list span");        
        var urls = $(".list a.tit");
        for(var i=0;i<titles.length;i++) {
            //var obj = {};
            obj = {};
            obj['heading'] = $(titles[i]).text().trim();
            obj['imageUrl'] = $(imgs[i]).attr('src');
            obj['publishedDate'] = $(times[i]).text().trim();            
            obj['contentUrl'] = $(urls[i]).attr('href');
            result.push(obj);
        }       
        res.send(JSON.stringify(result));        
      });

})

//路徑 (ex : 127.0.0.1:3000/Detail)
app.get('/Detail',function(req,res){
    
        if (req.query['url']) {       
            
            request({
                url: req.query['url'],
                method: "GET"
              }, function(e,r,b) {
                if(e || !b) { return; }
                var $ = cheerio.load(b);
                var result = [];   
                var contents = $(".content p").text().trim();
                result.push(contents);
                res.send(JSON.stringify(result));                                                    
              });
    
        } else {
            var result = []; 
            result.push("URL Not Find");
            res.send(JSON.stringify(result));                                                    
        }
        
    })
    

//Web 監聽的 Port 
app.listen(PORT, function(){
    console.log('Example app listening on port 3000!')
})

