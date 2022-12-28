
const oracledb = require('oracledb');

const { Sequelize } = require('sequelize');

// Tell node-oracledb where to find the Oracle Instant Client 'Basic' package on macOS and Windows
if (process.platform === 'darwin') {
  oracledb.initOracleClient({libDir: process.env.HOME + '/Downloads/instantclient_19_8'});
} else if (process.platform === 'win32') {
  oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_8'});   // note the double backslashes
} // else you must set the system library search path before starting Node.js


const sequelize = new Sequelize({
  dialect: 'oracle',
  username: process.env.DBUSER,
  password: process.env.DBPASS,
  dialectOptions: {connectString: process.env.DBCONNSTRING},

});

module.exports.sequelize = sequelize;


async function simpleExecute(statement, binds = [], opts = {}) {
  let conn;
  let result = [];

  opts.outFormat = oracledb.OBJECT;

  try {
    conn = await oracledb.getConnection();
    result = await conn.execute(statement, binds, opts);
    return (result);
  } catch (err) {
    console.error(err);
    throw (err);
  } finally {
    if (conn) { // conn assignment worked, need to close
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports.simpleExecute = simpleExecute;

