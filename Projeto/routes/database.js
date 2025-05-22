const{Pool}=require('pg')

const pool= new Pool({
    user:'postgres',
    host:'localhost',
    database:'Teste',
    password:'4825613',
    port: 5432,

});

module.exports = pool;
