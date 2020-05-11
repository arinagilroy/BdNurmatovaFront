const base_url = 'http://176.57.78.17:8888/networkComponent';
var dataOfProducts;
var nowUpdatingProduct;

function newTbodyTr(obj, index) {
	var elem = `
		<tr data-toggle="modal" data-target="#myModal" onclick="showTr(event, ${index}, ${obj.id})">
			<th scope="row">${ obj.id }</th>
			<td>${ obj.name }</td>
			<td>${ obj.topology }</td>
			<td>${ obj.networkArchitecture }</td>
			<td>${ obj.deliveryTime }</td>
			<td>`;

				if(obj.manufacturerCompany) {

					elem += `
						<div class="dropright">
							<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								инфо
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a class="dropdown-item" href="#"><strong>id:</strong> ${ obj.manufacturerCompany.id }</a>
								<a class="dropdown-item" href="#"><strong>address:</strong> ${ obj.manufacturerCompany.address }</a>
								<a class="dropdown-item" href="#"><strong>phone:</strong> ${ obj.manufacturerCompany.phone }</a>
							</div>
						</div>
					`;

				} else {
					elem += `null`;
				}

			elem += `</td><td>`;

			if(obj.supplierCompany) {

					elem += `
						<div class="dropright">
							<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								инфо
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a class="dropdown-item" href="#"><strong>id:</strong> ${ obj.supplierCompany.id }</a>
								<a class="dropdown-item" href="#"><strong>address:</strong> ${ obj.supplierCompany.address }</a>
								<a class="dropdown-item" href="#"><strong>phone:</strong> ${ obj.supplierCompany.phone }</a>
								<a class="dropdown-item" href="#"><strong>price:</strong> ${ obj.supplierCompany.deliverPrice }</a>
							</div>
						</div>
					`;

				} else {
					elem += `null`;
				}

		elem += `
			<td>${ obj.price }</td>
			<td>
				<button type="button" class="btn btn-danger" onclick="deleteThisProduct(${ obj.id })">Delete</button>
			</td>
		</tr>`;

	return elem;
}

class PostApi {
  static getProducts() {
    return fetch(base_url+'/netComponents', {
      method: 'GET'
    }).then(res => res.json());
  }

  static deleteProduct(id) {
		return fetch(base_url+'/netComponents?id='+id, {
			method: 'DELETE'
		}).then(res => res.json());
	}

	static updateThisProduct(body, sup, man) {
		console.log(body);
		return fetch(base_url+`/netComponents?supplId=${sup}&manufactId=${man}`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json' },
			body: body
		}).then(res => res.json());
	}

	static createNew(body, sup, man) {
		console.log(body);
		return fetch(base_url+`/netComponents?supplId=${sup}&manufactId=${man}`, {
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

	if(event.target.tagName.toLowerCase() != 'button') {
		let realObj = dataOfProducts[domNum];
		nowUpdatingProduct = realObj;


		Object.entries(realObj).forEach((item, index) => {
			if(item[0] != 'id') {
				modalSpan[index].textContent = item[0];
				if(item[0] == 'manufacturerCompany' || item[0] == 'supplierCompany') {
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

		if(key == 'manufacturerCompany' || key == 'supplierCompany') {
			if(item.getAttribute('data-value') != item.value) {
				console.log(key + ': ' + nowUpdatingProduct[key]);

				if(key == 'manufacturerCompany') {
					manINC = item.value;
				} else if(key == 'supplierCompany') {
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
		if(key == 'supplierCompany') {
			sup = modalInput[index].value;
		} else if(key == 'manufacturerCompany') {
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
