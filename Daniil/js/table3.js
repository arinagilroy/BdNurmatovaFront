const base_url = 'http://176.57.78.17:8888/workshop';
var dataOfProducts;
var nowUpdatingProduct;

function newTbodyTr(obj, index) {
	var elem = `
		<tr>
			<th scope="row">${ obj.id }</th>
			<td>${ obj.name }</td>
			<td>${ obj.countInDay }</td>
			<td>${ obj.productionCosts }</td>
			<td>`;

			if(obj.workshop) {

				elem += `
					<div class="dropright">
						<button class="btn btn-secondary dropdown-toggle" type="button" style= "background-color:#543a31" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							инфо
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<a class="dropdown-item" href="#"><strong>id:</strong> ${ obj.workshop.id }</a>
							<a class="dropdown-item" href="#"><strong>address:</strong> ${ obj.workshop.name }</a>
							<a class="dropdown-item" href="#"><strong>phone:</strong> ${ obj.workshop.numberOfEmployees }</a>
							<a class="dropdown-item" href="#"><strong>bank account id:</strong> ${ obj.workshop.numberOfShiftsPerDay }</a>
						</div>
					</div>
				`;

			} else {
				elem += `null`;
			}

		 	elem += `
			</td>
			<td>${ obj.unitPrice }</td>
			<td>
				<button type="button" class="btn btn-primary" style= "background-color:#543a31" data-toggle="modal" data-target="#myModal" onclick="showTr(event, ${index}, ${obj.id})">Update</button>
				<button type="button" class="btn btn-danger" style= "background-color:#543a31" data-toggle="kss" onclick="deleteThisProduct(${ obj.id })">Delete</button>
			</td>
		</tr>`;

	return elem;
}

class PostApi {
  static getProducts() {
    return fetch(base_url+'/products', {
      method: 'GET'
    }).then(res => res.json());
  }

  static deleteProduct(id) {
		return fetch(base_url+'/product?id='+id, {
			method: 'DELETE'
		}).then(res => res.json());
	}

	static updateThisProduct(body) {
		return fetch(base_url+`/product`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json' },
			body: body
		}).then(res => res.json());
	}

	static createNew(body) {
		console.log(body);
		return fetch(base_url+`/product`, {
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

	modalTitleID.innerHTML = id;

	if(event.target.tagName.toLowerCase() == 'button') {
		let realObj = dataOfProducts[domNum];
		nowUpdatingProduct = realObj;

		Object.entries(realObj).forEach((item, index) => {
			if(item[0] != 'id') {
				if(item[0] == 'workshop') {
					modalSpan[index].textContent = 'workshop_id';
					modalInput[index].value = item[1].id;
				} else {
					modalSpan[index].textContent = item[0];
					modalInput[index].value = item[1];
				}
			}
		});
	}
}

function updateThisProduct() {
	var newUpdateProduct = nowUpdatingProduct;
	console.log(newUpdateProduct);

	var modalSpan = document.querySelectorAll('.modal-body > span');
	var modalInput = document.querySelectorAll('.modal-body > input');

	modalInput.forEach((item, index) => {
		let key = modalSpan[index].textContent;
		if(key != 's') {
			newUpdateProduct[key] = item.value;
		}
	});

	console.log(newUpdateProduct);

	PostApi.updateThisProduct(JSON.stringify(newUpdateProduct))
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
