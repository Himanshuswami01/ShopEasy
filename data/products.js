export const products = [
    // Men's Clothing
    {
        id: 'm1',
        name: "Classic Fit Oxford Shirt",
        category: "mens",
        subcategory: "shirts",
        price: 49.99,
        salePrice: null,
        colors: ["white", "light-blue", "pink"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        images: [
            "/images/products/mens/oxford-shirt-1.jpg",
            "/images/products/mens/oxford-shirt-2.jpg",
            "/images/products/mens/oxford-shirt-3.jpg"
        ],
        description: "A timeless Oxford shirt crafted from premium cotton. Perfect for both casual and formal occasions.",
        features: [
            "100% cotton Oxford fabric",
            "Button-down collar",
            "Regular fit",
            "Machine washable"
        ],
        stock: 100,
        rating: 4.5,
        reviews: 128
    },
    {
        id: 'm2',
        name: "Slim Fit Chino Pants",
        category: "mens",
        subcategory: "pants",
        price: 59.99,
        salePrice: 44.99,
        colors: ["khaki", "navy", "olive", "black"],
        sizes: ["28x30", "30x30", "32x30", "34x30", "36x30"],
        images: [
            "/images/products/mens/chinos-1.jpg",
            "/images/products/mens/chinos-2.jpg"
        ],
        description: "Modern slim-fit chinos made from stretch cotton for comfort and style.",
        features: [
            "98% cotton, 2% elastane",
            "Slim fit",
            "Flat front",
            "Side and back pockets"
        ],
        stock: 75,
        rating: 4.3,
        reviews: 89
    },

    // Women's Clothing
    {
        id: 'w1',
        name: "Floral Wrap Dress",
        category: "womens",
        subcategory: "dresses",
        price: 79.99,
        salePrice: 59.99,
        colors: ["blue-floral", "red-floral", "black-floral"],
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
            "/images/products/womens/wrap-dress-1.jpg",
            "/images/products/womens/wrap-dress-2.jpg"
        ],
        description: "A beautiful wrap dress featuring a flattering silhouette and romantic floral print.",
        features: [
            "100% viscose",
            "V-neck wrap design",
            "Three-quarter length sleeves",
            "Midi length"
        ],
        stock: 50,
        rating: 4.7,
        reviews: 156
    },
    {
        id: 'w2',
        name: "High-Waisted Skinny Jeans",
        category: "womens",
        subcategory: "jeans",
        price: 69.99,
        salePrice: null,
        colors: ["dark-blue", "light-blue", "black"],
        sizes: ["24", "26", "28", "30", "32"],
        images: [
            "/images/products/womens/skinny-jeans-1.jpg",
            "/images/products/womens/skinny-jeans-2.jpg"
        ],
        description: "Classic high-waisted skinny jeans with stretch for ultimate comfort.",
        features: [
            "92% cotton, 6% polyester, 2% elastane",
            "High-rise waist",
            "Skinny fit",
            "5-pocket styling"
        ],
        stock: 85,
        rating: 4.4,
        reviews: 203
    },

    // Kids' Clothing
    {
        id: 'k1',
        name: "Dinosaur Print T-Shirt",
        category: "kids",
        subcategory: "t-shirts",
        price: 24.99,
        salePrice: 19.99,
        colors: ["blue", "green", "grey"],
        sizes: ["3-4Y", "4-5Y", "5-6Y", "6-7Y"],
        images: [
            "/images/products/kids/dino-tee-1.jpg",
            "/images/products/kids/dino-tee-2.jpg"
        ],
        description: "Fun and playful dinosaur print t-shirt perfect for active kids.",
        features: [
            "100% organic cotton",
            "Crew neck",
            "Short sleeves",
            "Machine washable"
        ],
        stock: 60,
        rating: 4.8,
        reviews: 45
    },

    // Add more products...
    {
        id: 'm3',
        name: "Wool Blend Blazer",
        category: "mens",
        subcategory: "jackets",
        price: 199.99,
        salePrice: 159.99,
        colors: ["navy", "grey", "black"],
        sizes: ["38R", "40R", "42R", "44R"],
        images: [
            "/images/products/mens/blazer-1.jpg",
            "/images/products/mens/blazer-2.jpg"
        ],
        description: "A sophisticated wool blend blazer perfect for business and formal occasions.",
        features: [
            "80% wool, 20% polyester",
            "Two-button closure",
            "Notch lapels",
            "Interior pockets"
        ],
        stock: 30,
        rating: 4.6,
        reviews: 67
    },
    {
        id: 'w3',
        name: "Silk Blouse",
        category: "womens",
        subcategory: "tops",
        price: 89.99,
        salePrice: null,
        colors: ["ivory", "blush", "black", "navy"],
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
            "/images/products/womens/silk-blouse-1.jpg",
            "/images/products/womens/silk-blouse-2.jpg"
        ],
        description: "Elegant silk blouse with a relaxed fit and subtle sheen.",
        features: [
            "100% silk",
            "Button-front closure",
            "Long sleeves with buttons",
            "Chest pocket"
        ],
        stock: 40,
        rating: 4.5,
        reviews: 92
    }
];

// Categories and subcategories structure
export const categories = {
    mens: {
        name: "Men's Wear",
        subcategories: {
            shirts: "Shirts",
            pants: "Pants",
            jackets: "Jackets & Coats",
            suits: "Suits",
            activewear: "Activewear",
            accessories: "Accessories"
        }
    },
    womens: {
        name: "Women's Wear",
        subcategories: {
            dresses: "Dresses",
            tops: "Tops & Blouses",
            pants: "Pants",
            skirts: "Skirts",
            jeans: "Jeans",
            activewear: "Activewear",
            accessories: "Accessories"
        }
    },
    kids: {
        name: "Kids' Fashion",
        subcategories: {
            boys: "Boys' Clothing",
            girls: "Girls' Clothing",
            babies: "Baby Clothes",
            accessories: "Accessories"
        }
    }
};

// Helper function to filter products by category
export function getProductsByCategory(category, subcategory = null) {
    return products.filter(product => {
        if (subcategory) {
            return product.category === category && product.subcategory === subcategory;
        }
        return product.category === category;
    });
}

// Helper function to get product by ID
export function getProductById(id) {
    return products.find(product => product.id === id);
}

// Helper function to get featured products
export function getFeaturedProducts(limit = 8) {
    return products
        .filter(product => product.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Helper function to get sale products
export function getSaleProducts(limit = 8) {
    return products
        .filter(product => product.salePrice !== null)
        .sort((a, b) => {
            const aDiscount = (a.price - a.salePrice) / a.price;
            const bDiscount = (b.price - b.salePrice) / b.price;
            return bDiscount - aDiscount;
        })
        .slice(0, limit);
} 