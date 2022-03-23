const mysql = require('mysql')
const oracle = require('oracledb')
class DB {
  createPool() {}
  getConnection() {}
  query() {}
  getSqlPromise(sqlArr, callback) {
    return sqlArr.map(sql => {
      return new Promise((resolve, reject) => {
        callback(sql, resolve, reject)
      })
    })
  }
  beginTransaction() {}
}

class DbMySql extends DB {
  constructor({ host, port, user, password, database }) {
    super()
    this.pool = this.createPool(host, port, user, password, database)
  }
  // 创建连接
  createPool(host, port, user, password, database) {
    return mysql.createPool({
      host, port, user, password, database
    })
  }
  // 获取连接
  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err)
        } else {
          resolve(connection)
        }
      })
    })
  }
  query(sql) {
    return new Promise((resolve, reject) => {
      this.getConnection().then(connection => {
        connection.query(sql, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }).catch(err => {
        reject(err)
      })
    })
  }
  // 事务执行
  async beginTransaction(sqlArr) {
    try {
      const connection = await this.getConnection()
      await connection.beginTransaction()
      const promiseArr = sqlArr.map(sql => {
        return new Promise((resolve, reject) => {
          connection.query(sql, (err, res) => {
            if (err) {
              reject(err)
            } else {
              resolve(res)
            }
          })
        })
      })
      try {
        const data = await Promise.all(promiseArr)
        await connection.commit()
        connection.release()
        return Promise.resolve(data)
      } catch (e) {
        connection.rollback()
        return Promise.reject(e)
      }
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

class DbOracle extends DB {
  constructor(dbConfig) {
    super()
    this.dbConfig = dbConfig
  }
  async getConnection() {
    return await oracle.getConnection(this.dbConfig)
  }
  async query(sql) {
    const connection = await this.getConnection()
    // 执行sql
    const result = await connection.execute(sql)
    // 释放连接
    connection.release()
    return result
  }
  async beginTransaction(sqlArr) {
    const connection = await this.getConnection()
    try {
      const promiseArr = this.getSqlPromise(sqlArr, async(sql, res, req) => {
        try {
          const data = await connection.execute(sql)
          res(data)
        } catch (e) {
          req(e)
        }
      })
      const data = await Promise.all(promiseArr)
      await connection.commit()
      await connection.release()
      return data
    } catch (e) {
      await connection.rollback()
      await connection.release()
      return e
    }
  }
}

function getDbConfig(config, dbType) {
  const { user, password, host, port, database } = config
  switch (dbType) {
    case 'mysql':
      return config
    case 'oracle':
      return {
        user,
        password,
        connectString: `${host}:${port}/${database}`
      }
    case 'sqlserver':
      return {
        user,
        password,
        server: host,
        port: port ? Number(port) : 1433,
        database,
        options: {
          encrypt: false // 是否加密
        }
      }
    default:
      return config
  }
}
function getDb(config, dbtype) {
  const dbConfig = getDbConfig(config, dbtype)
  let db
  switch (dbtype) {
    case 'mysql':
      db = new DbMySql(dbConfig)
      break
    case 'oracle':
      db = new DbOracle(dbConfig)
      break
    case 'sqlserver':
      break
  }
  return db
}
export default {
  getConfig(connectStr) {
    const config = {}
    const arr = connectStr.split(';')
    arr.forEach(item => {
      const [key, value] = item.split('=')
      switch (key) {
        case 'User ID': config.user = value; break
        case 'Password': config.password = value; break
        case 'Host': config.host = value; break
        case 'Port': config.port = value; break
        case 'SID': case 'Service Name': config.database = value; break
      }
    })
    return config
  },
  async testConnect(config, dbtype) {
    try {
      const db = getDb(config, dbtype)
      await db.getConnection()
      return { success: true }
    } catch (e) {
      return { success: false, msg: e && e.message, error: e }
    }
  },
  async query(dbtype, config, sqlstr) {
    try {
      const db = getDb(config, dbtype)
      const data = await db.query(sqlstr)
      return { success: true, data }
    } catch (e) {
      return { success: false, msg: e && e.message, error: e }
    }
  },
  async beginTransaction(config, dbtype, sqlArr) {
    try {
      const db = getDb(config, dbtype)
      const data = await db.beginTransaction(sqlArr)
      return { success: true, data }
    } catch (e) {
      return { success: false, msg: e && e.message, error: e }
    }
  }
}
