var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '43.138.152.216',
  user     : '342414384',
  password : 'xiaohu',
  database : 'jdtest'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});