var bamazon = require('./bamazon');

var profitbydept = [];

function getTableOften () {
    bamazon.queryDB.query('select * from profitbydept;',(err,results)=>{profitbydept = results});
}

function defaultWhenBlank (arr,) {

}

getTableOften();
setInterval(getTableOften,100);

var sv = {
    addDepartment: [],
    Questions: [{
        name: 'options',
        message: 'Select the actions you would like to perform',
        type: 'list',
        choices: ['View Product Sales by Department','Add New Department','Return to Main Menu']
    },{
        name: 'newDeptName',
        message: 'Please type the name of the New Department',
        type: 'input',
        default: function() {
            sv.addDepartment = [];
            return 'Add New Department';
        },
        filter: function(val){
            if (val === 'Add New Department') {
                return val;
            } else {
                sv.addDepartment.push(val);
                return 'Add New Department';
            }
        },
        validator: function(){
            if(sv.addDepartment[0].length > 0) {
                return true;
            } else {
                sv.addDepartment.pop();
                return false;
            }
        }
    },{
        name: 'newDeptOC',
        message: 'Please type the amount of the overhead cost of the new department',
        type: 'input',
        validator: function(input){
            var validated = sv.addDepartment[1].toString();
            if(bamazon.validator.isDecimal(validated,{decimal_digits:'0,2'})) {
                return true;
            } else {
                sv.addDepartment.pop();
                return false;
            }
        },
        filter: function(val) {
            sv.addDepartment.push(Number(val));
            return 'Add New Department';
        }
    }],
    viewOptions : () => {
        bamazon.prompts.next(sv.Questions[0]);
    },
    'Add New Department' : () => {
        if (sv.addDepartment.length === 2) { 
            bamazon.queryDB.query('call add_department(?,?);',sv.addDepartment,(err,results)=>{
                if(!err) {
                    console.log('Successfully added the '+ sv.addDepartment[0] +'department with a cost of ' + sv.addDepartment[1]);
                    sv.viewOptions();
                }  else {
                    console.log(err);
                    sv.viewOptions();
                }
            });
        } else {
            bamazon.prompts.next(sv.Questions[sv.addDepartment.length+1]);
        } 
    },
    'View Product Sales by Department' : () => {
        bamazon.viewTable(profitbydept);
        bamazon.prompts.next(bamazon.primaryOptions);
    },
    'Return to Main Menu': function(){
        bamazon.prompts.next(bamazon.primaryOptions);
    }
}

module.exports = sv;