// Third party modules
const dbConfig = require('./configs/database.js')
const database = require('./services/lib/db/database.js')

// App modules
const webServer = require('./services/lib/http/web-server.js')
const { converteFahrenheitParaCelsius } = require('./services/w3schools/w3schools')

// Thread pool setup

// Default initial size
const defaultThreadPoolSize = 10

// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.connectionPool.poolMax + defaultThreadPoolSize


// Function to starts up the app
async function startup() {

    try {

        const resultado = converteFahrenheitParaCelsius(22)
        console.log(resultado)

    } catch(err) {

        console.error(err)
        process.exit(1)
    }

    console.log('Iniciando aplicação...')

    try {

        console.log('Inicializando módulo: Banco de dados...')
        await database.initialize()

    } catch (err) {

        console.error(err)
        process.exit(1)
    }

    try { 

        console.log('Inicializando módulo: Servidor Web...')
        await webServer.initialize()

    } catch (err) {

        console.error(err)
        process.exit(1)
    }
}


// Starts up the app
startup()


// Function to shutdown gracefully the app
async function shutdown(e) {

    let err = e
    console.log('Finalizando aplicação...')

    try {

        console.log('Encerrando módulo: Servidor Web...')
        await webServer.close()

    } catch (e) {

        console.log('Erro ao encerrar Servidor Web', e)
        err = err || e
    }

    try {

        console.log('Encerrando módulo: Banco de dados...')
        await database.close()

    } catch (e) {

        console.log('Erro encontrado', e)
        err = err || e
    }

    console.log('Saindo do processo')

    if (err) {
        process.exit(1)
    } else {
        process.exit(0)
    }
}

process.on('SIGTERM', () => {

    console.log('Recebido SIGTERM')

    shutdown()
})

process.on('SIGINT', () => {

    console.log('Recebido SIGINT')

    shutdown()
})

process.on('uncaughtException', err => {

    console.log('Exceção não capturada')
    console.error(err)

    shutdown(err)
})
