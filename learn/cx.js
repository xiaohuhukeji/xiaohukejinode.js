var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '43.138.152.216',
  user     : '342414384',
  password : 'xiaohu',
  database : 'test'
});
 
connection.connect();
 
var  sql = 'SELECT * FROM websites';
//查
connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       console.log(result);
       console.log('------------------------------------------------------------\n\n');  
});
 
connection.end();