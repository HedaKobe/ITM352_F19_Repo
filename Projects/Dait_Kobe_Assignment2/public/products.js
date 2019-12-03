// Author: Kobe Dait
// File Description: Products database

//Format used from Lab13
products =
    [
        {
            // Products 1
            "exotic": "Hedgehog",
            "price": 96.00,
            "image": "./images/hedgehog.png"
        },
        {
            // Products 2
            "exotic": "Chinchilla",
            "price": 150.00,
            "image": "./images/chinchilla.png"
        },
        {
            // Products 3
            "exotic": "Bearded Dragon",
            "price": 60.00,
            "image": "./images/bearded_dragon.png"
        },
        {
            // Products 4
            "exotic": "Axolotl",
            "price": 35.00,
            "image": "./images/axolotl.png"
        },
        {
            // Products 5
            "exotic": "Tarantula",
            "price": 131.00,
            "image": "./images/tarantula.png"
        }
    ];

if (typeof module != 'undefined') {
    module.exports.products = products;
}