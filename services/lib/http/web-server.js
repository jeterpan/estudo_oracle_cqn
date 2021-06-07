//TODO: em vez de sempre apresentar que o servidor está escutando em localhost,
//       apresentar em quais IPs ele está disponível
//      Porque eu poderia estar, por exemplo, dentro de uma VM ou Docker

// Node.js native modules
const http = require('http')
const fs = require('fs')
const path = require('path')

// Third party modules
const cors = require('cors')
const morgan = require('morgan')
const express = require('express')

// App modules
const { log } = require('../../../lib/libjet.js')
const webServerCfg = require('../../../configs/web-server.js')
const servidorWebSocket = require('./webSocket-server.js')
const roteador = require('./router.js')

//const roteador = require('../services/roteador.js')
// Vamos colocar este import aqui apenas para testarmos a conexao com o banco
//  mas ele poderá ser apagado depois
//const banco = require('../services/banco.js')

let httpServer

function initialize() {

    return new Promise( (resolve, reject) => {

        const app = express()

        app.use(cors())

        httpServer = http.createServer(app)

        app.use( morgan('combined') )

        //app.use('/api', roteador)

        // Define a pasta para conteúdo estático
        app.use( express.static( path.join('./', 'public') ) )

        //app.use('/api', roteador)

        //app.get('/', function (_req, res) {
        //    res.sendFile(__dirname + '/../public/index.html')
        //})

        httpServer.listen(webServerCfg.http_port)
            .on('listening', () => {
                //console.log(`${new Date().toLocaleString('pt-BR', { timezone: 'America/Sao_Paulo' })} - Servidor Web escutando em localhost:${webServerCfg.http_port}`)
                log(`Servidor Web escutando em localhost:${webServerCfg.http_port}`)
            })
            .on('error', err => {
                reject(err)
            })

        // @TODO: Por enquanto não estou usando await aqui, talvez não seja necessário.
        //         Hoje não tenho conhecimento para saber se também precisa
        //         Apenas estou iniciando o servidor WebSocket e por enqto creio que não precisa
        //        Também não estou tratando erros aqui, futuramente verificar se tb é necessário tratar
        //servidorWebSocket.inicializa(httpServer)

        resolve()

    })
}

module.exports.initialize = initialize

function close() {
    return new Promise( (resolve, reject) => {
        httpServer.close( (err) => {
            if (err) {
                reject(err)
                return
            }

            resolve()
        })
    })
}

module.exports.close = close
