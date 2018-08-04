var bamazon = require('./bamazon');

var departments = [];
var lowinventory = [];
var products = [];

function getTableOften() {
    bamazon.queryDB.query('select * from departmentlist;',function (err,results){
        departments = JSON.parse(JSON.stringify(results));
    });
    bamazon.queryDB.query('select * from low_inventory;',function(err,results){
        lowinventory = results;
    });
    bamazon.queryDB.query('select * from productsforsale;',function(err,results){
        products = results;
    });
}

function repeatIfBlank(q) {
    process.stdout.write('\033c');
    bamazon.prompts.next(q);
}

getTableOften();
setInterval(getTableOften,100);
showDepartments = () => {return departments;};

var manage = {
    answered: 0,
    addQty:[],
    addProduct:[],
    Questions: [{
        name: "options",
        message: "Select the actions you would like to perform",
        type: "list",
        choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product','Return to Main Menu']
    },{
        name: "idToAddQty",
        message: function () {
           return bamazon.cTable.getTable(products) + "\nEnter the item id of the product you wish to increase quantity";
        },
        type: "input",
        // default: function () {return repeatIfBlank(this)},
        filter: function (val) {
            manage.addQty.push(Number(val));
            return 'Add to Inventory';
        },
        validate: function(input){
            var product = products.filter((e)=>{return e.item_id === manage.addQty[0]});
            if(product.length === 1){
                manage.answered = 1;
                return true;
            } else {
                manage.addQty.pop();
                console.log('\nProduct not found please enter an item id of a product available for sale.');
                return false;
            };
        }
    },{
        name: "qtyToAddQty",
        message: "Enter the qty you wish to add to the item",
        type: "input",
        filter: function (val) {
            manage.addQty.push(Number(val));
            return 'Add to Inventory';
        },
        validate: function(input){
            if(bamazon.validator.isInt(manage.addQty[1].toString(),{allow_leading_zeroes: false, gt: 0})){
                return true;
            } else {
                manage.addQty.pop();
                console.log('\nPlease enter a whole number for the quantity.');
                return false;
            };
        }
    },{
        name:"newProductName",
        message: "Enter the name of the new product",
        type:"input",
        filter: function (value) {
            manage.addProduct.push(value);
            return 'Add New Product';
        }
    },{
        name:"newProductDept",
        message: "Choose the department name of the new product",
        type:"list",
        choices: showDepartments,
        filter: function (value) {
            manage.addProduct.push(value);
            return 'Add New Product';
        }
    },{
        name:"newProductPrice",
        message: "Enter the price of the new product",
        type:"input",
        filter: function (val) {
            manage.addProduct.push(Number(val));
            return 'Add New Product';
        },
        validate: function(input){
            if (bamazon.validator.isDecimal(manage.addProduct[2].toString(),{decimal_digits:'0,2'})){
                return true;
            } else {
                manage.addProduct.pop();
                console.log('\nNot a valid format for price. Enter price with up to two decimal places. Try again');
                return false;
            }
        }
    },{
        name:"newProductQty",
        message: "Enter the quantity of the new product",
        type:"input",
        filter: function (val) {
            manage.addProduct.push(Number(val));
            return 'Add New Product';
        },
        validate: function(input){
            if(bamazon.validator.isInt(manage.addProduct[3].toString(),{allow_leading_zeroes: false})){
                return true;
            } else {
                manage.addProduct.pop();
                console.log('\nNot a valid format for quantity. Enter quantity without decimals');
                return false;
            }
        }
    }],
    viewOptions: () => {
        bamazon.prompts.next(manage.Questions[0]);
    },
    'View Products for Sale': function(){
        bamazon.viewTable(products);
        manage.viewOptions();
    },
    'View Low Inventory': function(){
        bamazon.viewTable(lowinventory);
        manage.viewOptions();
    },
    'Add to Inventory': function(){
        if (manage.addQty.length === 2){
            var qryStr = 'call add_item(?,?);';
            bamazon.queryDB.query(qryStr,manage.addQty,function(err,results){
                if(!err) {
                    console.log('\nQuantity successfully added');
                    manage.viewOptions();
                }  else {
                    console.log(err);
                    manage.viewOptions();
                }
            });
        } else {
            bamazon.prompts.next(manage.Questions[manage.addQty.length+1]);
        }   
    },
    'Add New Product': function(){
        var qryStr = 'call add_product(?,?,?,?)'; // find ways to pass array to mysql stored procedure
        if (manage.addProduct.length === 4){
            bamazon.queryDB.query(qryStr,manage.addProduct,function(err,results){
                if(!err) {
                    console.log('\nProduct successfully added');
                    manage.viewOptions();
                }  else {
                    console.log(err);
                    manage.viewOptions();
                }
            });
        } else {
            bamazon.prompts.next(manage.Questions[manage.addProduct.length+3]);
        }
    },
    'Return to Main Menu': function(){
        bamazon.prompts.next(bamazon.primaryOptions);
    }
}

module.exports = manage;