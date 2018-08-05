# Bamazon


## Overview

This is an application that can be used by the customers, managers and supervisors. Any inputs that are successfully completed will be stored to the Bamazon database.
The database server to store the data from the users is MySQL. Customers can enter new orders every time the previous order is successfully completed. Once Managers 
and Supervisors chose "Return to Main Menu", the program closes down shortly after a new option is chosen. This is one of the things that need improvement.  

## Menu

* Customer
* Manager
    * View Products for Sale
    * View Low Inventory
    * Add to Inventory
    * Add New Product
    * Return to Main Menu
* Supervisor
    * View Product Sales by Department
    * Add New Department
    * Return to Main Menu

## Database

The bamazon.js file runs the create.sql and appends insert.sql to the create.sql when no database exists. Once the mock data from the insert.js gets inserted, 
the insert.js will not be appended again. The database consists of tables, views, procedures and events

## Require of Files

Refer to the dependencychart.png file

## Plans for Improvement

1. The program closes only when the "Exit Program" is chosen.
2. Insert the additions of qty to the purchases table
3. Put more style and color to the prompt
4. Run results of queries that customers use every 100 milliseconds.
5. Make the code more concise and put more comments