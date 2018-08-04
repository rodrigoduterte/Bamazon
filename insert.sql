use bamazon;

insert into departments (department_name, overhead_costs) values ('Food', 245.60);
insert into departments (department_name, overhead_costs) values ('Clothing', 1247.20);
insert into departments (department_name, overhead_costs) values ('Beauty', 365.14);

insert into products (product_name, department_id, price, stock_quantity) values ('Potatoes - Yukon Gold 5 Oz', 2, 24.03, 2);
insert into products (product_name, department_id, price, stock_quantity) values ('Glass Clear 8 Oz', 1, 11.74, 52);
insert into products (product_name, department_id, price, stock_quantity) values ('Chives - Fresh', 1, 33.59, 85);
insert into products (product_name, department_id, price, stock_quantity) values ('Tarragon - Fresh', 2, 16.63, 71);
insert into products (product_name, department_id, price, stock_quantity) values ('Pie Box - Cello Window 2.5', 3, 24.97, 72);
insert into products (product_name, department_id, price, stock_quantity) values ('Wine - Saint - Bris 2002, Sauv', 3, 3.29, 79);
insert into products (product_name, department_id, price, stock_quantity) values ('Wine - Domaine Boyar Royal', 2, 2.45, 59);
insert into products (product_name, department_id, price, stock_quantity) values ('Ice Cream - Fudge Bars', 2, 33.26, 17);
insert into products (product_name, department_id, price, stock_quantity) values ('Beer - Corona', 1, 28.04, 41);
insert into products (product_name, department_id, price, stock_quantity) values ('Juice - Apple 284ml', 1, 17.62, 53);

insert into sales (item_id, price, quantity) values (4,16.63 ,3 );
insert into sales (item_id, price, quantity) values (4,16.63 ,3 );
insert into sales (item_id, price, quantity) values (2,11.74 ,2 );
insert into sales (item_id, price, quantity) values (2,11.74 ,2 );
insert into sales (item_id, price, quantity) values (3,33.59 ,4 );
insert into sales (item_id, price, quantity) values (3,33.59 ,4 );