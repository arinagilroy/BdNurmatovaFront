const base_url = 'http://176.57.78.17:8888/workshop';
var dataOfProducts;
var nowUpdatingProduct;

function newTbodyTr(obj, index) {
	var elem = `
		<tr>
			<th scope="row">${ obj.clearProfit }</th>
			<td>`;

			if(obj.workshop) {

				elem += `
					<div class="dropright">
						<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							инфо
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<a class="dropdown-item" href="#"><strong>id:</strong> ${ obj.workshop.id }</a>
						<a class="dropdown-item" href="#"><strong>name:</strong> ${ obj.workshop.name }</a>
						<a class="dropdown-item" href="#"><strong>phone:</strong> ${ obj.workshop.numberOfEmployees }</a>
						<a class="dropdown-item" href="#"><strong>number of shifts:</strong> ${ obj.workshop.numberOfShiftsPerDay }</a>
						</div>
					</div>
				`;

			} else {
				elem += `null`;
			}

			elem += `
			</td>
		</tr>`;

	return elem;
}

class PostApi {
  static getResult(num) {
    return fetch(base_url+'/calculateAnnualClearProfit?averageSalary=' + num, {
      method: 'GET'
    }).then(res => res.json());
  }
}

// document.addEventListener('DOMContentLoaded', function() {
// 	var tablesCategory = document.querySelectorAll('.dropdown-item');
//
// 	tablesCategory.forEach((item, index) => {
// 		item.addEventListener('click', tableSelection);
// 	})
//
// 	//Создание карточек для таблицы товаров
// 	// PostApi.getProducts()
// 	// 	.then(data => {
// 	// 		console.log(data);
// 	// 		resetShow(data);
// 	// 	})
// 	// 	.catch(err => {
// 	// 		console.log('Error', err);
// 	// 	});
//
//
// });

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
		document.querySelector('.active').style.display = 'block';
	}, 1000);
}

function showResult() {
	var zp = document.querySelector('.zp');
	console.log(base_url+'/calculateAnnualClearProfit?averageSalary='+zp.value);
	PostApi.getResult(zp.value)
		.then(data => {
			console.log(data);
			resetShow(data);
		})
		.catch(err => {
			console.log('Error: ', err);
		});
}
