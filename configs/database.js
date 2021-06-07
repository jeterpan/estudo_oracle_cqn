require('dotenv').config()

module.exports = {
    schema_teste: process.env.ORACLE_SCHEMA_RM || 'TESTE'
    , connectionPool: {
        bd_version: process.env.ORACLE_VERSION || 12
        , time_zone: process_env.ORACLE_TIME_ZONE || 'America_Sao_Paulo'
        , user: process.env.ORACLE_USER
        , password: process.env.ORACLE_PASSWORD
        , connectString: process.env.ORACLE_CONNECTIONSTRING
        , sessionCallback: initSession
        , poolMin: 10
        , poolMax: 10
        , poolIncrement: 0
    }
}
