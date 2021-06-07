// Third part modules
const oracledb = require('oracledb')

// App modules
const dbConfig = require('../../../configs/database.js')

function 


// Initializes a pool of connections for Oracle Database, using the node-oracledb driver

async function initialize() {
    const pool = await oracledb.createPool(dbConfig.connectionPool)
}

module.exports.initialize = initialize


// Close the pool of connections of Oracle Database

async function close() {
    await oracledb.getPool().close()
}

module.exports.close = close


// Executes a simple SQL statement

function executaSQL(declaracao, binds = [], opcoes = {}) {

    return new Promise(async (resolve, reject) => {

        let connection

        opcoes.outFormat = oracledb.OUT_FORMAT_OBJECT
        opcoes.autoCommit = true

        try {
            connection = await oracledb.getConnection()

            await connection.execute(`ALTER SESSION SET TIME_ZONE=${dbConfig.time}`)

            const result = await connection.execute(declaracao, binds, opcoes)
            resolve(result)

        } catch (err) {
            reject(err)

        } finally {
            if (connection) {
                try {
                    await connection.close()
                } catch (err) {
                    console.err(err)
                }
            }
        }
    })
}

module.exports.executaSQL = executaSQL


// Oracle Continuos Query Notification (CQN)

