const http = require('http')
const https = require('https')


// HTTPs GET method

async function get(hostname, port, path, headers, maxRedirects, query) {
    return new Promise( async (resolve, reject) => {

        //@TODO: Tive que juntar a query string no path para funcionar
        // sera que esta é a única forma, ou podemos usar um objeto query (que ainda nao funcionou) dentro de options? 
        caminho = encodeURI(path + query)
        //console.log(`Hostname: ${hostname}`)
        //console.log(`Path: ${JSON.stringify(path)}`)
        //console.log(`Headers: ${JSON.stringify(headers)}`)
        //console.log(`Query: ${JSON.stringify(query)}`)

        //@TODO: Analisar se preciso usar: maxRedirects: 20 no options (isso veio do Postman, mas...ao carregar o https aqui no Node, eu tive problema para carregar apenas follow-redirects, accabei carregando entao a lib completa do https)
        
        const options = {
            hostname
            , port
            , path: caminho
            , method: 'GET'
            , headers
            , maxRedirects
            , query
        }

        let chunks = []

        const req = await http.request(options, res => {
            res.on( 'data', chunk => chunks.push(chunk) )
            res.on( 'end', () => {
                const body = Buffer.concat(chunks).toString()
                resolve(body)
            })
        })
        req.on('error', e => {
            reject(e)
        })
        req.end()

    })
}

module.exports.get = get


// HTTPs PUT method

async function put(hostname, port, path, headers, body) {
    return new Promise( async (resolve, reject) => {

        const options = {
            hostname
            , port
            , path
            , method: 'PUT'
            , headers
            , maxRedirects
        }

        const chunks = []

        let eventDataNumber = 0
        let eventEndNumber = 0

        const req = await http.request(options, res => {

            //res.on( 'data', chunk => chunks.push(chunk) )

            res.on( 'data', function(chunk) {
                eventDataNumber += 1
                console.log(`Chunk data number: ${eventDataNumber}`)
                chunks.push(chunk)
            })

            res.on( 'end', () => {

                eventEndNumber += 1
                console.log(`Event end number: ${eventEndNumber}`)

                if (res.statusCode == 200 || res.statusCode == 201) {
                    const result = {
                        success: true
                        , data: Buffer.concat(chunks)
                    }
                    resolve( JSON.stringify(result) )

                } else if (res.statusCode == 500) {

                    //console.log(JSON.stringify(body))
                    
                    retorno = Buffer.concat(chunks).toString()

                    const result = {
                        success: false
                        , data: retorno
                    }
                    reject (result)
                } else {
                    const result = {
                        success: false
                        //, data: `HTTP error: ${res.statusCode}`
                        , data: Buffer.concat(chunks).toString()
                    }
                    reject( result )
                }

                //resolve( )

            })
        })

        req.on( 'error', e => {

            console.log(`Event error ocurred`)

            const result = {
                success: false
                , data: `HTTP error: ${e}`
            }
            reject( result )
        } )
        req.write( JSON.stringify(body) )
        req.end()

    })
}

module.exports.put = put


// HTTPs POST method
// Creio que o POST é igual ao PUT, entao copiei isso da funcao acima e vou adaptar o nome da funcao e do metodo apenas

async function post(hostname, port, path, headers, maxRedirects, body) {
    return new Promise( async (resolve, reject) => {

        const options = {
            hostname
            , port
            , path
            , method: 'POST'
            , headers
            , maxRedirects
        }

        const chunks = []

        let eventDataNumber = 0
        let eventEndNumber = 0
        
        let retorno

        const req = await https.request(options, res => {

            //res.on( 'data', chunk => chunks.push(chunk) )

            res.on( 'data', function(chunk) {
                eventDataNumber += 1
                console.log(`Chunk data number: ${eventDataNumber}`)
                chunks.push(chunk)
            })

            res.on( 'end', () => {

                eventEndNumber += 1
                console.log(`Event end number: ${eventEndNumber}`)

                if (res.statusCode == 200 || res.statusCode == 201) {

                    retorno = Buffer.concat(chunks).toString()
/*
                    const result = {
                        success: true
                        , data: retorno
                    }
*/
                    //resolve( retorno )

                } else if (res.statusCode == 500) {

                    //console.log(JSON.stringify(body))
                    
                    retorno = Buffer.concat(chunks).toString()

                    const result = {
                        statusCode: res.statusCode
                        , success: false
                        , data: retorno
                    }
                    reject(result)
                } else {
                    const result = {
                        success: false
                        //, data: `HTTP error: ${res.statusCode}`
                        , data: Buffer.concat(chunks).toString()
                    }
                    reject(result)
                }

                resolve( retorno )

            })
        })

        req.on( 'error', e => {

            console.log(`Event error ocurred`)

            const result = {
                error: e
                , success: false
                , data: `HTTP error: ${e}`
            }
            reject( result )
        } )
        req.write( body )
        req.end()

    })
}

module.exports.post = post
