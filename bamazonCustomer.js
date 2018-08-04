var bamazon = require('./bamazon');

var customer = {
    ans: [],
    availableProductIds : [],
    availableProductNames : [],
    availablePrices : [],
    availableQty: [],
    Answers : [], //[id,idx,qty,'ask qty'];
    Questions : [{
        name: "productToBuy",
        message:"Please enter the product id of the product you want to buy",
        type: "input",
        filter: function (val) {
            var id,idx,qty;
            id = parseInt(val);
            idx = customer.availableProductIds.indexOf(id);
            qty = customer.availableQty[idx];
            customer.Answers = [id,idx,qty,'ask qty'];
            return val;
        },
        validate: function (input) {
            if (customer.Answers[1] > -1) {
                return true;
            } else {
                console.log('\nProduct not found');
                return false;
            }
        }
    },{
        name: "qtyToBuy",
        message:"Please enter how many you want to buy",
        type: "input",
        validate: (input) => {
            if (Number.isInteger(parseFloat(input))) {
                if( customer.Answers[2] >= parseInt(input) && parseInt(input) > 0){
                    customer.Answers[2] = parseInt(input);
                    customer.Answers[3] = 'buy product'
                    return true;
                } else {
                    console.log('\nInsufficient or Invalid quantity');
                    return false;
                }
            } else {
                console.log('\nInsufficient or Invalid quantity');
                return false;
            }
        }
    }],   
    showTable : () => {
        bamazon.queryDB.query('SELECT * FROM available_for_sale', function (error, results) {
            if (error) throw error;
            bamazon.viewTable(results);
            customer.availableProductIds = results.map((record) => {return parseInt(record['item_id'])});
            customer.availableProductNames = results.map((record) => {return record['product_name']});
            customer.availablePrices = results.map((record) => {return parseFloat(record['price'])});
            customer.availableQty = results.map((record) => {return parseInt(record['stock_quantity'])});
            customer.askID();
        });
    },
    askID : () => {
        bamazon.prompts.next(customer.Questions[0]);
    },
    askQty : () => {
        bamazon.prompts.next(customer.Questions[1]);
    },
    buyProduct : () => {
        bamazon.queryDB.query(`call customer_buys(${customer.Answers[0]},${customer.Answers[2]});`,function(error,results) {
            if (error) throw error;
            var idx = customer.Answers[1];
            var prod = customer.availableProductNames[idx];
            var price = customer.availablePrices[idx];
            // var prod = availableProductNames[idx];
            // var price = availablePrices[idx];
            var qty = customer.Answers[2];
            console.log(`You bought: ${qty} unit/s of ${prod} at \$${price} each`);
            console.log(`The total value of items bought is: \$${(price * qty).toFixed(2)}`);
            if (price) {
                customer.Answers = [];
                bamazon.prompts.next(bamazon.primaryOptions);
            }
        });
    }
}


module.exports = customer;