require('dotenv').config();
var fs = require('fs');
var Rx = require('rxjs');

var customer;
var manager;
var supervisor;

var bamazon = {
    mysql : require('mysql'),
    cTable : require('console.table'),
    inquirer : require('inquirer'),
    prompts : new Rx.Subject(),
    validator : require('validator'),
    primaryOptions : {
        name : "firstoptions",
        message : "Bamazon Program Menu",
        choices : ['Customer','Manager','Supervisor','Exit Program'],
        type: "list"
    },
    viewTable : function(table) {
        console.log(this.cTable.getTable(table));
    }
}
module.exports = bamazon;

var db = {
    host     : process.env.host,
    user     : process.env.uname,
    password : process.env.password,
    multipleStatements: true
}


var file = fs.readFileSync('./create.sql').toString();

bamazon.createDB = bamazon.mysql.createConnection(db); //connection to create database bamazon

//connects to mysql server
bamazon.createDB.connect(function(err) {
    if (err) throw err;
    // executes commands from create.sql and insert.sql
    bamazon.createDB.query('select * from bamazon.sales;',function (err){
        if (err) {
            createDB(fs.readFileSync('./insert.sql').toString());
        } else {
            createDB('');
        }
    });
});

function createDB (file2) {
    bamazon.createDB.query(file+file2, function (err, result) {
        if (err) throw err;
        if (result) {
          bamazon.createDB.end();
          Object.assign(db,{database:'bamazon'});
          // opens connection to allow users to connect
          bamazon.queryDB = bamazon.mysql.createConnection(db);
          bamazon.queryDB.connect(function(err){
              menu();
          });
        }
    });
} 

function menu() {
    bamazon.inquirer.prompt(bamazon.prompts).ui.process.subscribe(({ answer }) => {
        if (answer === 'Customer') {
            runCustomer();
        } else if (answer === 'Manager') {
            runManager();
            return;
        } else if (answer === 'Supervisor') {
            runSupervisor();
            return;
        } else if (answer === 'Exit Program') {
            bamazon.queryDB.close();
            bamazon.prompts.complete();
            process.exit();
        }
        if (customer !== undefined) {
            if (customer.Answers[3] === 'ask qty') {
                customer.askQty();
            }
            if (customer.Answers[3] === 'buy product') {
                customer.buyProduct();
            }
        }
        if (manager !== undefined) {
            manager[answer]();
        }
        if (supervisor !== undefined) {
            supervisor[answer]();
        }
    });
    bamazon.prompts.next(bamazon.primaryOptions);
}

function runCustomer() {    
    customer = require('./bamazonCustomer');
    customer.showTable();
}

function runManager() {
    manager = require('./bamazonManager');
    manager.viewOptions();
}

function runSupervisor() {
    supervisor = require('./bamazonSupervisor');
    supervisor.viewOptions();
}