// App modules
const { timezone } = require('../configs/app.js')

function log(ctx){
    console.log(`${new Date().toLocaleString('pt-BR', { timezone })} - ${ctx}`)
}

module.exports.log = log
