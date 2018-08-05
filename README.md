# Bamazon


## Overview

This is an application that can be used by the customers, managers and supervisors. Any inputs that are successfully completed will be stored to the Bamazon database.
The database server to store the data from the users is MySQL. Customers can enter new orders every time the previous order is successfully completed. Once Managers 
and Supervisors choose "Return to Main Menu", the program closes down shortly after a new option is chosen.

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

The bamazon.js file runs the create.js and appends insert.js 