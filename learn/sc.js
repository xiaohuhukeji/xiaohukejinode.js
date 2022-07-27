var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '43.138.152.216',
  user     : '342414384',
  password : 'xiaohu',
  database : 'test'
});
 
 
connection.connect();
 
var delSql = 'DELETE FROM websites where id=6';
//删
connection.query(delSql,function (err, result) {
        if(err){
          console.log('[DELETE ERROR] - ',err.message);
          return;
        }        
 
       console.log('--------------------------DELETE----------------------------');
       console.log('DELETE affectedRows',result.affectedRows);
       console.log('-----------------------------------------------------------------\n\n');  
});
 
connection.end();