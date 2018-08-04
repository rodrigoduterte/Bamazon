-- drop database if exists bamazon; 
create database if not exists bamazon;
use bamazon;

create table if not exists departments (
   department_id integer auto_increment primary key,
   department_name text,
   overhead_costs decimal(10,2)
);

create table if not exists products (
   item_id integer auto_increment,
   product_name text,
   department_id integer NOT NULL,
   price decimal(10,2),
   stock_quantity decimal(10,0),
   product_sales decimal(10,2),
   foreign key (department_id) references departments(department_id),
   primary key(item_id)
);

create table if not exists sales (
    item_id integer,
    price decimal(10,2),
    quantity decimal(10,0),
    foreign key(item_id) references products(item_id)
);

create table if not exists purchases (
    item_id integer,
    quantity decimal(10,0),
    foreign key(item_id) references products(item_id)
);

create or replace view productsForSale as
    select item_id, product_name, price, stock_quantity from products;

create or replace view available_for_sale as
    select item_id, product_name, price, stock_quantity 
    from products
    where stock_quantity > 0;

create or replace view low_inventory as
    select item_id, product_name, stock_quantity
    from products
    where stock_quantity < 5;

create or replace view departmentList as
    select department_name as "name", department_id as "value" from departments;

create or replace view productSales as
    select 
        p.item_id,
        p.department_id,
        s.price * s.quantity as 'item_sale_value' 
    from products p inner join sales s on (p.item_id = s.item_id);

create or replace view productSalesByDept as
    select
        department_id,
        SUM(item_sale_value) as department_sale
    from productSales
    GROUP BY department_id;

create or replace view productSalesByItem as
    select
        item_id,
        SUM(item_sale_value) as item_sale
    from productSales
    GROUP BY item_id;

create or replace view profitByDept as
    select
        d.department_id as 'Department ID',
        d.department_name as 'Department Name',
        psd.department_sale as 'Department Sales',
        d.overhead_costs as 'Department Overhead',
        psd.department_sale - d.overhead_costs as 'Department Profit'
    from departments d inner join productSalesByDept psd on (d.department_id = psd.department_id); 

create event if not exists updateSalesColumnOfProducts
    ON SCHEDULE EVERY 1 SECOND
    DO
        UPDATE products p inner join productsalesbyitem pp 
            on (p.item_id = pp.item_id)
            SET p.product_sales = pp.item_sale; 


-- delimiter $$
DROP PROCEDURE IF EXISTS add_inventory_qty;
create procedure add_inventory_qty(in item integer, in qty decimal(10,0))
    begin
        update products 
        set stock_quantity = stock_quantity + qty
        where item_id = item;
    end;

DROP PROCEDURE IF EXISTS customer_buys;
create procedure customer_buys(
    in item integer,
    in qty decimal(10,0)
)
    begin
		declare pricevar decimal(10,2);
        select price into pricevar from products where item_id = item;
        insert into sales values (item,pricevar,qty);
        update products
        set stock_quantity = stock_quantity - qty
        where item_id = item;
    end;

DROP PROCEDURE IF EXISTS add_item;
create procedure add_item(
    in item integer,
    in qty decimal(10,0)
)
    begin
        insert into purchases values (item,qty);
        update products
        set stock_quantity = stock_quantity + qty
        where item_id = item;
    end;

DROP PROCEDURE IF EXISTS add_product;
create procedure add_product
(
    in pn text,
    in dn text,
    in p decimal(10,2),
    in sq decimal(10,0)
)
    begin
        insert into products(product_name, department_id, price, stock_quantity) values (pn,dn,p,sq);
    end;

DROP PROCEDURE IF EXISTS add_department;
create procedure add_department
(
    in dn text,
    in oc decimal(10,2)
)
    begin
        insert into departments(department_name, overhead_costs) values(dn,oc);
    end;