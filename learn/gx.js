var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '43.138.152.216',
  user     : '342414384',
  password : 'xiaohu',
  database : 'test'
});
 
connection.connect();
 
var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
var modSqlParams = ['CodesBug工具', 'http://www.codesbug.com',6];
//改
connection.query(modSql,modSqlParams,function (err, result) {
   if(err){
         console.log('[UPDATE ERROR] - ',err.message);
         return;
   }        
  console.log('--------------------------UPDATE----------------------------');
  console.log('UPDATE affectedRows',result.affectedRows);
  console.log('-----------------------------------------------------------------\n\n');
});
 
connection.end();