const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'containers-us-west-48.railway.app',
    user: 'root',
    password: 'yRnj9VFzP4FZQNwhKogj',
    database: 'railway',
    port: 6921
})

function getVMdata(callback) {
  pool.query('SELECT * FROM vm_data', (error, results) => {
    if (error) {
      console.log('Error fetching data from database:', error);
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

module.exports = { getVMdata }
