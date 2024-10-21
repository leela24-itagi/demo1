let cartCount = 0;
let cartItems = [];  

async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; 

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <div class="card-body">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
            </div>
            <ul class="list-group">
                <li class="list-group-item">Price: $${product.price}</li>
                <li class="list-group-item">Rating: ${product.rating}</li>
                <li class="list-group-item">Discount: ${product.discountPercentage}%</li>
            </ul>
            <div class="card-links">
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `;

        productGrid.appendChild(card);

        
        const addToCartButton = card.querySelector('.add-to-cart-btn');
        addToCartButton.addEventListener('click', function() {
            addToCart(product);
        });
    });
}

function addToCart(product) {
    cartItems.push(product); 
    cartCount++;
    document.getElementById('cartCount').textContent = cartCount;
}


function showCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItemsList = document.getElementById('cartItems');
    cartItemsList.innerHTML = '';  

    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('cart-item');

        li.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.thumbnail}" alt="${item.title}">
                <h3>${item.title}</h3>
            </div>
            <span class="cart-item-price">$${item.price}</span>
        `;

        cartItemsList.appendChild(li);
    });

    cartModal.style.display = 'block';
}

function closeModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

function filterProductsByCategory(products, category) {
    if (category === 'all') {
        return products;
    }
    return products.filter(product => product.category.toLowerCase() === category);
}

function searchProducts(products, searchTerm) {
    return products.filter(product => product.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

async function init() {
    const products = await fetchProducts();

    displayProducts(products);

    document.querySelectorAll('.sidebar ul li').forEach(categoryItem => {
        categoryItem.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            const filteredProducts = filterProductsByCategory(products, category);
            displayProducts(filteredProducts);
        });
    });

    document.getElementById('searchBar').addEventListener('input', function () {
        const searchTerm = this.value;
        const searchedProducts = searchProducts(products, searchTerm);
        displayProducts(searchedProducts);
    });

    
    document.getElementById('cartButton').addEventListener('click', showCart);

    
    document.querySelector('.close-btn').addEventListener('click', closeModal);
}


window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
}

window.onload = init;
