var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('localhost:8088/shopping');

var products = [
	new Product({
		imagePath: 'images/it/manage.jpg',
		title: 'Управление',
		description: 'управление проектами',
		price: 10
	}),
	new Product({
		imagePath: 'images/it/ui-ux.jpg',
		title: 'Опыт взаимодействия',
		description: 'Дизайн интерфейсов и опыта взаимодействия',
		price: 20
	}),
	new Product({
		imagePath: 'images/it/web-dev.jpg',
		title: 'Разработка ПО',
		description: 'Разработка ПО и веб',
		price: 40
	}),
	new Product({
		imagePath: 'images/it/dev-ops.jpg',
		title: 'Администрирование серверов',
		description: 'Администрирование серверов и сетей',
		price: 15
	}),
	new Product({
		imagePath: 'images/it/support.jpg',
		title: 'Обслуживание',
		description: 'Обслуживание и поддержка',
		price: 50
	})
];

var done = 0;
for (var i = 0; i < products.length; i++) {
	products[i].save(function (err, result) {
		done++;
		if (done === products.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}