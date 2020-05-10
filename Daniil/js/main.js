const base_url = 'http://176.57.78.17:8888/workshop';
var dataOfProducts;
var nowUpdatingProduct;

function newTbodyTr(obj, index) {
	var elem = `
		<tr>
			<th scope="row">${ obj.id }</th>
			<td>${ obj.name }</td>
			<td>${ obj.numberOfEmployees }</td>
			<td>${ obj.numberOfShiftsPerDay }</td>
			<td>${ obj.annualOverhaulPrice }</td>`;

			elem += `
				<td>
					<button type="button" class="btn btn-primary" style= "background-color:#543a31" toggle="modal" data-target="#myModal" onclick="showTr(event, ${index}, ${obj.id})">Update</button>
					<button type="button" class="btn btn-danger" style= "background-color:#543a31" onclick="deleteThisProduct(${ obj.id })">Delete</button>
				</td>
			</tr>`;

	return elem;
}

class PostApi {
  static getProducts() {
    return fetch(base_url+'/workshops', {
      method: 'GET'
    }).then(res => res.json());
  }

  static deleteProduct(id) {
		return fetch(base_url+'/workshop?id='+id, {
			method: 'DELETE'
		}).then(res => res.json());
	}

	static updateThisProduct(body, sup, man) {
		// console.log(body);
		return fetch(base_url+`/workshop?supplId=${sup}&manufactId=${man}`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json' },
			body: body
		}).then(res => res.json());
	}

	static createNew(body) {
		console.log(body);
		return fetch(base_url+`/workshop`, {
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
	var newProduct = {};
	// var man;
	// var sup;

	var modalSpan = document.querySelectorAll('.modal-body2 > span');
	var modalInput = document.querySelectorAll('.modal-body2 > input');

	modalSpan.forEach((item, index) => {
		var key = item.textContent;
		// if(key == 'supplier') {
		// 	sup = modalInput[index].value;
		// } else if(key == 'consumer') {
		// 	man = modalInput[index].value;
		// } else {
			newProduct[key] = modalInput[index].value;
		// }
	});

	console.log(newProduct);
	// console.log(man);
	// console.log(sup);


	PostApi.createNew(JSON.stringify(newProduct))
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
