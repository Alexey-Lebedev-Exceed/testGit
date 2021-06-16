let allTasks = [];
let valueInputShop = '';
let valueInputPrice = '';
let valueInputDate = '';
let tempIndex = null;
let tempShop = '';
let tempPrice = '';
let tempDate = '';
let res = null;
let totalAmount = 0;
let total = document.getElementById('total-amount');
let tempTextShopBlur = '';
let tempDateTaskBlur = '';
let tempTextPriceBlur = '';

window.onload = async () => {
  inputShop = document.getElementById('add-task-shop');
  inputShop.addEventListener('change', updateValueShop);
  inputDate = document.getElementById('date-task');
  inputDate.addEventListener('change', updateValueDate);
  inputPrice = document.getElementById('add-task-price');
  inputPrice.addEventListener('change', updateValuePrice);

  const response = await fetch('http://localhost:7777/allTasks', {
    method: 'GET'
  });

  const result = await response.json();
  allTasks = result;
  design();
}

onClickButton = async () => {
  if(inputShop.value === '' || inputPrice.value === '' || inputDate.value === ''){
    alert("Недопустимое значение одного из поля");
  } else {
    const response = await fetch('http://localhost:7777/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        shop: valueInputShop,
        date: valueInputDate,
        price: valueInputPrice
      })
    });

    const result = await response.json();
    allTasks.push(result);
    inputShop.value = '';
    inputPrice.value = '';
    inputDate.value = '';
    design();
  }
}

updateValueShop = (event) => {
  valueInputShop = event.target.value;
}

updateValueDate = (event) => {
  valueInputDate = event.target.value;
}

updateValuePrice = (event) => {
  valueInputPrice = event.target.value;
}

design = () => {
  let totalAmount = 0;
  const content = document.getElementById('container-task');
  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.forEach((item, index) => {
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container';

    if (index === tempIndex) {
      const textEditShop = document.createElement('textarea');
      textEditShop.value = item.shop;
      textEditShop.className = 'shop-textarea';
      textEditShop.addEventListener('change', () => newTextShop(textEditShop))
      container.appendChild(textEditShop);

      const EditDate = document.createElement('input');
      EditDate.setAttribute('type', 'date');
      EditDate.value = item.date;
      EditDate.addEventListener('change', () => newDate(EditDate))
      container.appendChild(EditDate);

      const textEditPrice = document.createElement('input');
      textEditPrice.value = item.price;
      textEditPrice.className = 'price-input';
      textEditPrice.setAttribute('type', 'number');
      textEditPrice.addEventListener('change', () => newTextPrice(textEditPrice))
      container.appendChild(textEditPrice);

      const imageDone = document.createElement('img');
      imageDone.src = './done.png';
      container.appendChild(imageDone);
      imageDone.className = 'imageDone';
      imageDone.addEventListener('click', () => doneTask(item));

      const imageCancel = document.createElement('img');
      imageCancel.src = './cancel.png';
      container.appendChild(imageCancel);
      imageCancel.className = 'imageCancel';
      imageCancel.addEventListener('click', () => cancelTask());

    } else {
      const containerShop = document.createElement('div');
      containerShop.className = 'task-container-shop';
      container.appendChild(containerShop);

      const textShop1 = document.createElement('p');
      textShop1.innerText = `${index + 1}) Магазин : `;
      containerShop.appendChild(textShop1);

      const textShop = document.createElement('p');
      textShop.innerText = ` "${item.shop}"`;
      textShop.setAttribute('contenteditable', 'true');
      textShop.className = 'task-size ';
      textShop.addEventListener('blur', () => newTextShopBlur(item, textShop));
      containerShop.appendChild(textShop);


      const dateTask = document.createElement('p');
      dateTask.innerText = `${item.date}`;
      container.appendChild(dateTask);
      dateTask.setAttribute('contenteditable', 'true');
      dateTask.className = 'task-size ';
      dateTask.addEventListener('blur', () => newDateTaskBlur(item, dateTask));

      const containerPrice = document.createElement('div');
      containerPrice.className = 'task-container-price';
      container.appendChild(containerPrice);

      const textPrice = document.createElement('p');
      textPrice.innerText = `${item.price}`;
      textPrice.setAttribute('contenteditable', 'true');
      containerPrice.appendChild(textPrice);
      textPrice.className = 'task-size ';
      textPrice.addEventListener('blur', () => newTextPriceBlur(item, textPrice));
      
      const textPrice1 = document.createElement('p');
      textPrice1.innerText = ' руб.';
      containerPrice.appendChild(textPrice1);

      const containerImage = document.createElement('div');
      containerImage.className = 'task-container-image';
      container.appendChild(containerImage);

      const imageEdit = document.createElement('img');
      imageEdit.src = './edit.png';
      containerImage.appendChild(imageEdit);
      imageEdit.className = 'imageEdit';
      imageEdit.addEventListener('click', () => editTask(item, index));

      const imageDelete = document.createElement('img');
      imageDelete.src = './delete.png';
      containerImage.appendChild(imageDelete);
      imageDelete.className = 'imageDelete';
      imageDelete.addEventListener('click', () => removeTask(index));
    }

    totalAmount += +(item.price);
    total.innerText = `${totalAmount} руб.`;
    content.appendChild(container);
  });
}

editTask = (item, index) => {
  tempIndex = index;
  tempShop = item.shop;
  tempPrice = item.price;
  tempDate = item.date;
  design();
}

doneTask = async () => {

  if(tempShop === '') {
    alert("Недопустимое значение магазина");

  } else if(tempDate < 1 || tempDate === '') {
    alert("Недопустимая дата");

  } else if(tempPrice < 1) {
    alert("Недопустимое значение цены");

  } else {
    allTasks[tempIndex].shop = tempShop;
    allTasks[tempIndex].date = tempDate;
    allTasks[tempIndex].price = tempPrice;

    const response = await fetch('http://localhost:7777/updateTask', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(allTasks[tempIndex])
    });

    const result = await response.json();
    tempShop = '';
    tempPrice = '';
    tempDate = '';
    tempIndex = null;
    design();
  }
}

removeTask = async (index) => {
  const response = await fetch(`http://localhost:7777/deleteTask?_id=${allTasks[index]._id}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  allTasks.splice(index, 1);
  design();
}

cancelTask = () => {
  tempIndex = null;
  design();
}

newTextShop = (textEditShop) => {
  tempShop = textEditShop.value;
}

newDate = (EditDate) => {
  tempDate = EditDate.value;
}

newTextPrice = (textEditPrice) => {
  tempPrice = textEditPrice.value;
}

newTextShopBlur = async (item, textShop) => {
  tempTextShopBlur = textShop.innerText;
  item.shop = tempTextShopBlur;
  const response = await fetch('http://localhost:7777/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(item)
  });

  const result = await response.json();
  textShop = '';
  design();
}

newDateTaskBlur = async (item, dateTask) => {
  tempDateTaskBlur = dateTask.innerText;
  item.date = tempDateTaskBlur;
  const response = await fetch('http://localhost:7777/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(item)
  });

  const result = await response.json();
  dateTask = '';
  design();
}

newTextPriceBlur = async (item, textPrice) => {
  tempTextPriceBlur = textPrice.innerText;
  if(tempTextPriceBlur > 0){
    item.price = tempTextPriceBlur;
    const response = await fetch('http://localhost:7777/updateTask', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(item)
    });
  
    const result = await response.json();
    textPrice = '';
    design();
  } else {
    alert('Введите допустимое значение цены')
    return
  }
}