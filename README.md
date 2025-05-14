### How to Add New Products:

To add new products, you'll need to edit the `loadProducts()` function in the script.js file:

1. Find the appropriate category array (main-shop, mystery-boxes, or seasonal)
2. Add a new product object with:

1. id: A unique identifier (use 1-100 for main shop, 101-200 for mystery boxes, 201+ for seasonal)
2. name: The product name
3. price: The product price
4. image: The path to the product image





For example, to add a new main shop product:
{ id: 9, name: "New Bracelet", price: 1.25, image: "/images/new-bracelet.png" }
