
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cancel from './Image/cancel.png'
import Delete from './Image/delete.png'
import Done from './Image/done.png'
import Edit from './Image/edit.png'

function App() {
  const [allTasks, setTasks] = useState([]);
  const [valueInputShop, setTextShop] = useState('');
  const [valueInputDate, setTextDate] = useState('');
  const [valueInputPrice, setTextPrice] = useState('');
  let [tempIndex, setTempIndex] = useState(null);


  useEffect( () => {
    axios.get('http://localhost:7777/allTasks').then(res => {
      setTasks(res.data);
    });
  }, [setTasks]);

  const addNewTask = async () => {
    await axios.post('http://localhost:7777/createTask', {
      shop: valueInputShop,
      date: valueInputDate,
      price: valueInputPrice
    }).then(res => {
      setTextShop('');
      setTextDate('');
      setTextPrice(0);
      setTasks([ ...allTasks, res.data]);
    });
  }

  const removeTask = async (item, index) => {
    await axios.delete(`http://localhost:7777/deleteTask?_id=${allTasks[index]._id}`).then(res => {
      allTasks.splice(index, 1);
      setTasks([ ...allTasks]);
    });
  }
  return (
    <div className= "App">
      <header className= "App-header">
        <div className= 'main-container'>
          <div className=' general-container'>
            <h1>Учет моих расходов</h1>
            <div className= 'input-container'>
              <div className= 'input-block'>
                <p>Куда было потрачено:</p>
                <input 
                type= "text"
                placeholder= "Куда было потрачено"
                required
                className= 'add-task-shop'
                value = {valueInputShop}
                onChange = {(e) => setTextShop(e.target.value)}
                />
              </div>
              <div className= 'date'>
                <input type= "date"
                className= 'date-task'
                value = {valueInputDate}
                onChange = {(e) => setTextDate(e.target.value)}
                />
              </div>
              <div className= 'input-block'>
                <p>Сколько было потрачено:</p>
                <input type= "number"
                placeholder= "Сколько было потрачено"
                required
                className= 'add-task-price'
                value = {valueInputPrice}
                onChange = {(e) => setTextPrice(e.target.value)}
                />
              </div>
              <button onClick= {() => addNewTask()}>Добавить</button>
            </div>
            <div className= 'total-amount-style'>
              <p>Итого:</p>
              <p className= 'total-amount'></p>  
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className='container-task'>
            {
              allTasks.map((item, index) =>
                <div key={`task-${index}`}>
                  {index === tempIndex ? (
                    <div className= 'task-container'>
                      <textarea
                        value={item.shop}
                        className = 'shop-textarea'
                        // onChange = {(e) => setTextShop(e.target.value)}
                      ></textarea>
                      <input
                        type='date'
                        value={item.date}
                        // onChange = {(e) => newDate(e.target.value)}
                      ></input>
                      <input
                        type= 'number'
                        value= {item.price}
                        className = 'price-input'
                        // onChange = {(e) => newTextPrice(e.target.value)}
                      ></input>
                      <img
                        src= {Done}
                        className = 'imageDone'
                        // onClick= {() => doneTask()}
                      ></img>
                      <img
                        src={Cancel}
                        className = 'imageCancel'
                        onClick= {() => setTempIndex(tempIndex= null)}
                      ></img>
                    </div>
                  ) : (
                    <div className= 'task-container'>
                      <div className= 'task-container-shop'>
                        <p>{`${index + 1}) Магазин : `}</p>
                        <p
                          className = 'task-size'
                          // onBlur= {() => newTextShopBlur()}
                        >{`"${item.shop}"`}</p>
                      </div>
                      <p
                        className = 'task-size'
                        // onBlur= {() => newDateTaskBlur()}
                      >{`${item.date}`}</p>
                      <div className = 'task-container-price'>
                        <p
                          className = 'task-size'
                          // onBlur= {() => newTextPriceBlur()}
                        >{`"${item.price}"`}</p>
                        <p> руб.</p>
                      </div>
                      <div className = 'task-container-image'>
                        <img
                          src= {Edit}
                          className = 'imageEdit'
                          // onClick={() => editTask()}
                        ></img>
                        <img
                          src= {Delete}
                          className = 'imageDelete'
                          onClick={() => removeTask(item, index)}
                        ></img>
                      </div>
                    </div>
                  )}
                </div>
              )
            }
        </div>
      </main>
    </div>
  );
}

export default App;
