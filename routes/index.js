var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');

/* GET home page. */
router.get('/', function (req, res, next) {
	var successMsg = req.flash('success')[0]; // store in req.flash('success', 'Успешная покупка!');
	Product.find(function (err, docs) {
		var productChunks = [];
		var chunkSize = 3;
		for (var i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		}
		res.render('shop/index', {title: 'Корзина для покупок', products: productChunks, successMsg: successMsg, noMessages: !successMsg}); // success match in view ./shop/index.hbs
	});
});

router.get('/add-to-cart/:id', function (req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function (err, product) {
		if (err) {
			return res.redirect('/');
			<!--todo Возможно стоит вывести сообщение об ошибке-->
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	});
});

router.get('/shopping-cart', function (req, res, next) {
	if (!req.session.cart) {
		return res.render('shop/shopping-cart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function (req, res, next) {
	if (!req.session.cart) {
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);
	var errMsg = req.flash('error')[0];
	res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function (req, res, next) {
	if (!req.session.cart) {
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);

	var stripe = require("stripe")(
		"sk_test_enD3GHwZ0TCw6267i2PQjaa7"
	);

	stripe.charges.create({
		amount: cart.totalPrice * 100,
		currency: "usd",
		source: req.body.stripeToken,  // on checkout.js hidden input value
		description: "test charge"
	}, function (err, charge) {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('/checkout');
		}
		req.flash('success', 'Успешная покупка!');
		req.session.cart = null;
		res.redirect('/');
	});
});

module.exports = router;
