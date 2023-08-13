const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'containers-us-west-205.railway.app',
    user: 'root',
    password: 'QevFmGHPe7pyh4nrE8a9',
    database: 'railway',
    port: 6786
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
