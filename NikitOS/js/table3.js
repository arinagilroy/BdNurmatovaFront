const base_url = 'http://176.57.78.17:8888/oilProducts';
var dataOfProducts;
var nowUpdatingProduct;

function newTbodyTr(obj, index) {
	var elem = `
		<tr>
			<th scope="row">${ obj.id }</th>
			<td>${ obj.address }</td>
			<td>${ obj.phone }</td>
			<td>${ obj.bankAccountId }</td>
			<td>
				<button type="button" class="btn btn-primary" data-toggle="modal" style="background-color:#373737" data-target="#myModal" onclick="showTr(event, ${index}, ${obj.id})">Update</button>
				<button type="button" class="btn btn-danger" style="background-color:#373737" data-toggle="kss" onclick="deleteThisProduct(${ obj.id })">Delete</button>
			</td>
		</tr>`;

	return elem;
}

class PostApi {
  static getProducts() {
    return fetch(base_url+'/consumers', {
      method: 'GET'
    }).then(res => res.json());
  }

  static deleteProduct(id) {
		return fetch(base_url+'/consumer?id='+id, {
			method: 'DELETE'
		}).then(res => res.json());
	}

	static updateThisProduct(body) {
		return fetch(base_url+`/consumer`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json' },
			body: body
		}).then(res => res.json());
	}

	static createNew(body) {
		console.log(body);
		return fetch(base_url+`/consumer`, {
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

	setTimeout(function() {
		document.querySelector('.spinner-border').remove();
		document.querySelector('.active').style.display = 'block';
	}, 1000);
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
				modalInput[index].value = item[1];
			}
		});
	}
}

function updateThisProduct() {
	var modalSpan = document.querySelectorAll('.modal-body > span');
	var modalInput = document.querySelectorAll('.modal-body > input');

	modalInput.forEach((item, index) => {
		let key = modalSpan[index].textContent;
		if(key != 's') {
			nowUpdatingProduct[key] = item.value;
		}
	});

	console.log(nowUpdatingProduct);

	PostApi.updateThisProduct(JSON.stringify(nowUpdatingProduct))
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
		address: "Apple",
		phone: 30000
	}

	var modalSpan = document.querySelectorAll('.modal-body2 > span');
	var modalInput = document.querySelectorAll('.modal-body2 > input');

	modalSpan.forEach((item, index) => {
		var key = item.textContent;

		newProduct[key] = modalInput[index].value;
	});

	console.log(newProduct);


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
