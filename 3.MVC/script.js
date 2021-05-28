let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;
let tempIndex = -1;//temporary index for the ability to edit text in the task
let temp = '';

//page load actions
//loading input
window.onload = async function init () {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  input.addEventListener('keyup', keyPress);
  const response = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  let result = await response.json();
  allTasks = result.data;
  render();
}

//loading add button
onClickButton = async () => {
  if(input.value === ''){
    alert("Недопустимое значение");
  } else {
    allTasks.push({
      text: valueInput,
      isCheck: false
    });
    const response = await fetch('http://localhost:8000/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: valueInput,
        isCheck: false
      })
    });
    let result = await response.json();
    allTasks = result.data;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    //zeroing the value of the variable and the value of the input
    valueInput = '';
    input.value = '';
    render();  
  }
}

//loading the button for deleting all tasks
resetButton = () => {
  allTasks = [];
  render();  
}

updateValue = (event) => {
  valueInput = event.target.value;
}

//design function
render = () => {
  let content = document.getElementById('content-page');
  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }

  //sorting the array to display completed tasks at the bottom
  allTasks.sort((one, two) => {
    if (one.isCheck > two.isCheck) {
      return 1;
    } else if (one.isCheck < two.isCheck){
      return -1;
    } else {
      return 0;
    }
  });

  //general array enumeration
  allTasks.map((item, index) => {
    //add div (container)
    let container = document.createElement('div');
    container.id = `task-s{index}`;
    //add checkbox
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.isCheck;
    container.appendChild(checkbox);
    checkbox.className = 'checkbox-task';
    //add text
    if (tempIndex === index) {
      //add text to edit
      let textEdit = document.createElement('textarea');
      textEdit.value = item.text; //need to have text for editing, not emptiness
      textEdit.className = 'main-textarea';
      textEdit.addEventListener('keyup', (e) => keyPress1(e, textEdit));
      container.appendChild(textEdit);
      //add img to save edited text
      let imageDone = document.createElement('img');
      imageDone.src = './done.png';
      container.appendChild(imageDone);
      imageDone.className = 'imageDone';
      imageDone.addEventListener('click', () => doneTask());
      //add img to remove text editing
      let imageCancel = document.createElement('img');
      imageCancel.src = './cancel.png';
      container.appendChild(imageCancel);
      imageCancel.className = 'imageCancel';
      imageCancel.addEventListener('click', () => cancelTask());
      checkbox.disabled = true;
    } else {
      //add non-editable text
      let text = document.createElement('p');
      text.innerText = item.text;
      container.appendChild(text);
      text.className = item.isCheck ? 'text-task done-text-task' : 'text-task';
      //add img to remove text editing
      let imageEdit = document.createElement('img');
      imageEdit.src = './edit.png';
      container.appendChild(imageEdit);
      imageEdit.style.display = item.isCheck ? 'none' : 'flex';
      imageEdit.className = 'imageEdit';
      imageEdit.addEventListener('click', () => editTask(index));
      //add img to remove task
      let imageDelete = document.createElement('img');
      imageDelete.src = './delete.png';
      container.appendChild(imageDelete);
      imageDelete.className = 'imageDelete';
      imageDelete.addEventListener('click', () => removeTask(index));
    }

    //add conteiner in div html
    content.appendChild(container);
    container.className = 'task-container';
    //checkbox status tracking function
    checkbox.onchange = () => {
      onChangeCheckbox(index);
    };
  });
}

//jackdaw state function
onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

//delete button function
removeTask = async (index) => {
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  const response = await fetch(`http://localhost:8000/deleteTask?id=${allTasks[index].id}`, {
      method: 'DELETE'
  });
  let result = await response.json();
  allTasks = result.data;
  render();
}

//the function of checking the index to appear. the ability to edit
editTask = (index) => {
  tempIndex = index;
  render();
}

//save edited text function
doneTask = async () => {
  if(!temp.length){
    alert("Недопустимое значение");
  } else {
    allTasks[tempIndex].text = temp;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    const response = await fetch('http://localhost:8000/updateTask', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(allTasks[tempIndex])
    });
    let result = await response.json();
    allTasks = result.data;
    tempIndex = -1;
  render();
  }
}

//text edit undo function
cancelTask = () => {
  tempIndex = -1;
  render();
}

//form submit function
keyPress = (e) => {
  if(e.key == 'Enter'){
    onClickButton();
  }
  render();
}

//line break function in form
keyPress1 = (e, textEdit) => {
  if(e.ctrlKey && e.keyCode == 13) {
    textEdit.value += '\n';
  } else if(e.key === 'Enter'){
    doneTask(textEdit);
    render();
  } else {
    temp = e.target.value;
  }
}
