const base_url = 'http://176.57.78.17:8888/oilProducts';
var dataOfProducts;
var nowUpdatingProduct;

function newTbodyTr(obj, index) {
	var elem = `
		<tr>
			<th scope="row">${ obj.id }</th>
			<td>${ obj.name }</td>
			<td>${ obj.arriving }</td>
			<td>${ obj.departureData }</td>
			<td>${ obj.arriveData }</td>
			<td>`;

				if(obj.consumer) {

					elem += `
						<div class="dropright">
							<button class="btn btn-secondary dropdown-toggle" style ="background-color: #373737" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								инфо
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a class="dropdown-item" href="#"><strong>id:</strong> ${ obj.consumer.id }</a>
								<a class="dropdown-item" href="#"><strong>address:</strong> ${ obj.consumer.address }</a>
								<a class="dropdown-item" href="#"><strong>phone:</strong> ${ obj.consumer.phone }</a>
								<a class="dropdown-item" href="#"><strong>bank account id:</strong> ${ obj.consumer.bankAccountId }</a>
							</div>
						</div>
					`;

				} else {
					elem += `null`;
				}

			elem += `</td><td>`;

			if(obj.supplier) {

					elem += `
						<div class="dropright">
							<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								инфо
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a class="dropdown-item" href="#"><strong>id:</strong> ${ obj.supplier.id }</a>
								<a class="dropdown-item" href="#"><strong>address:</strong> ${ obj.supplier.address }</a>
								<a class="dropdown-item" href="#"><strong>phone:</strong> ${ obj.supplier.phone }</a>
								<a class="dropdown-item" href="#"><strong>bank account id:</strong> ${ obj.supplier.bankAccountId }</a>
							</div>
						</div>
					`;

				} else {
					elem += `null`;
				}

		elem += `
			<td>${ obj.volume }</td>
			<td>
				<button type="button" class="btn btn-primary" style ="background-color: #373737" data-toggle="modal" data-target="#myModal" onclick="showTr(event, ${index}, ${obj.id})">Update</button>
				<button type="button" class="btn btn-danger" style ="background-color: #373737" onclick="deleteThisProduct(${ obj.id })">Delete</button>
			</td>
		</tr>`;

	return elem;
}

class PostApi {
  static getProducts() {
    return fetch(base_url+'/oilProducts', {
      method: 'GET'
    }).then(res => res.json());
  }

  static deleteProduct(id) {
		return fetch(base_url+'/oilProduct?id='+id, {
			method: 'DELETE'
		}).then(res => res.json());
	}

	static updateThisProduct(body, sup, man) {
		console.log(body);
		return fetch(base_url+`/oilProduct?supplId=${sup}&manufactId=${man}`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json' },
			body: body
		}).then(res => res.json());
	}

	static createNew(body, sup, man) {
		console.log(body);
		return fetch(base_url+`/oilProduct?supplId=${sup}&manufactId=${man}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json' },
			body: body
		}).then(res => res.json());
	}
}

document.addEventListener('DOMContentLoaded', function() {
	var tablesCategory = document.querySelectorAll('.dropdown-item');

	tablesCategory.forEach((item, index) => {
		item.addEventListener('click', tableSelection);
	})

	//Создание карточек для таблицы товаров
	PostApi.getProducts()
		.then(data => {
			console.log(data);
			resetShow(data);

		})
		.catch(err => {
			console.log('Error', err);
		});


});

function resetShow(data) {
	dataOfProducts = data;
	let showTable = document.querySelector('.active');
			showTable = showTable.querySelector('tbody');

			showTable.innerHTML = '';

			data.forEach((item, index) => {
				let newElem = newTbodyTr(item, index);

				showTable.innerHTML += newElem;
			});
}

function tableSelection() {
	var elem = this;
	var dataId = +elem.getAttribute('data-table');
	console.log(dataId--);

	var tableSection = document.querySelectorAll('.table-section');
	tableSection.forEach(item => {
		item.classList.remove('active');
	})

	tableSection[dataId].classList.add('active');
	console.log(tableSection[dataId]);
}



function showTr(event, domNum, id) {
	var modalSpan = document.querySelectorAll('.modal-body > span');
	var modalInput = document.querySelectorAll('.modal-body > input');
	var modalTitleID = document.querySelector('.modal-title > span');

	var allTr = event.target.closest('tr');
	domNum = domNum--;

	modalTitleID.textContent = id;

	if(event.target.tagName.toLowerCase() == 'button') {
		let realObj = dataOfProducts[domNum];
		nowUpdatingProduct = realObj;


		Object.entries(realObj).forEach((item, index) => {
			if(item[0] != 'id') {
				modalSpan[index].textContent = item[0];
				if(item[0] == 'consumer' || item[0] == 'supplier') {
					if(item[1]) {
						modalInput[index].setAttribute('data-value', item[1].id);
						modalInput[index].value = item[1].id;
					} else {
						modalInput[index].setAttribute('data-value', -1);
						modalInput[index].value = '';
					}
				} else {
					modalInput[index].value = item[1];
				}
			}
		});
	}
}

function updateThisProduct() {
	var modalSpan = document.querySelectorAll('.modal-body > span');
	var modalInput = document.querySelectorAll('.modal-body > input');
	var supINC = '-1';
	var manINC = '-1';

	modalInput.forEach((item, index) => {
		let key = modalSpan[index].textContent;

		if(key == 'consumer' || key == 'supplier') {
			if(item.getAttribute('data-value') != item.value) {
				console.log(key + ': ' + nowUpdatingProduct[key]);

				if(key == 'consumer') {
					manINC = item.value;
				} else if(key == 'supplier') {
					supINC = item.value;
				}
			}
		} else {
			nowUpdatingProduct[key] = item.value;
		}
	});
	console.log(nowUpdatingProduct);
	console.log(manINC);
	console.log(supINC);

	PostApi.updateThisProduct(JSON.stringify(nowUpdatingProduct), supINC, manINC)
		.then(data => {
			console.log(data);
		 	resetShow(data);
		})
		.catch(err => {
			console.log('Error: ', err);
		});
}

function createNewProduct() {
	var newProduct = {
		deliveryTime: "03.02.2020",
		name: "Apple",
		networkArchitecture: "Computer",
		price: 30000,
		topology: "Bus"
	}
	var man;
	var sup;

	var modalSpan = document.querySelectorAll('.modal-body2 > span');
	var modalInput = document.querySelectorAll('.modal-body2 > input');

	modalSpan.forEach((item, index) => {
		var key = item.textContent;
		if(key == 'supplier') {
			sup = modalInput[index].value;
		} else if(key == 'consumer') {
			man = modalInput[index].value;
		} else {
			newProduct[key] = modalInput[index].value;
		}
	});

	console.log(newProduct);
	console.log(man);
	console.log(sup);


	PostApi.createNew(JSON.stringify(newProduct), sup, man)
		.then(data => {
			console.log(data);
		 	resetShow(data);
		})
		.catch(err => {
			console.log('Error: ', err);
		});
}

function deleteThisProduct(id) {
	console.log(id);

	PostApi.deleteProduct(id)
		.then(data => {
			console.log(data);
			resetShow(data);
		})
		.catch(err => {
			console.log('Error', err);
		});
}
