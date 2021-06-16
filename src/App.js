
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cancel from './Image/cancel.png';
import Delete from './Image/delete.png';
import Done from './Image/done.png';
import Edit from './Image/edit.png';
import _ from 'underscore';


function App() {
  const [allTasks, setTasks] = useState([]);
  const [valueInputShop, setTextShop] = useState('');
  const [valueInputDate, setTextDate] = useState('');
  const [valueInputPrice, setTextPrice] = useState('');
  const [valueTempInputShop, setTempTextShop] = useState('');
  const [valueTempInputDate, setTempTextDate] = useState('');
  const [valueTempInputPrice, setTempTextPrice] = useState('');
  const [tempIndex, setTempIndex] = useState(null);

  const counter = () => {
    const count = _.reduce(allTasks, function (memo, item) {return memo + item.price}, 0);
    return count
  }
  
  useEffect(async () => {
    await axios.get('http://localhost:7777/allTasks').then(res => {
      setTasks(res.data);
    });
  },[]);

  const editTask = ((item, index) => {
    setTempIndex(index);
    const {shop, date, price} = item;
    setTempTextShop(shop);
    setTempTextDate(date);
    setTempTextPrice(price);
  });

  const doneTask = async () => {
    if(valueTempInputShop === '') {
      alert("Недопустимое значение магазина");
    } else if(valueTempInputDate < 1 || valueTempInputDate === '') {
      alert("Недопустимая дата");
    } else if(valueTempInputPrice < 1) {
      alert("Недопустимое значение цены");
    } else {
      let {_id} = allTasks[tempIndex]
      await axios.patch('http://localhost:7777/updateTask', {
        _id,
        shop: valueTempInputShop,
        date: valueTempInputDate,
        price: valueTempInputPrice
      }).then(res => {
        setTasks(res.data);
        setTempIndex(null);  
      })
    }
  }

  const addNewTask = async () => {
    if(!valueInputShop || !valueInputDate || !valueInputPrice){
      alert("Недопустимое значение одного из поля");
    } else {
      await axios.post('http://localhost:7777/createTask', {
        shop: valueInputShop,
        date: valueInputDate,
        price: valueInputPrice
      }).then(res => {
        setTextShop('');
        setTextDate('');
        setTextPrice('');
        setTasks([ ...allTasks, res.data]);
      });
    }
  }

  const removeTask = async (item, index) => {
    await axios.delete(`http://localhost:7777/deleteTask?_id=${item._id}`).then(res => {
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
              <p className= 'total-amount'>{`${counter()} руб.`}</p>  
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
                        value={valueTempInputShop}
                        className = 'shop-textarea'
                        onChange = {(e) => setTempTextShop(e.target.value)}
                      ></textarea>
                      <input
                        type='date'
                        value={valueTempInputDate}
                        onChange = {(e) => setTempTextDate(e.target.value)}
                      ></input>
                      <input
                        type= 'number'
                        value= {valueTempInputPrice}
                        className = 'price-input'
                        onChange = {(e) => setTempTextPrice(e.target.value)}
                      ></input>
                      <img
                        src= {Done}
                        className = 'imageDone'
                        alt= 'imageDone'
                        onClick= {() => doneTask(item, index)}
                      ></img>
                      <img
                        src={Cancel}
                        className = 'imageCancel'
                        alt= 'imageCancel'
                        onClick= {() => setTempIndex(null)}
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
                          alt= 'imageEdit'
                          onClick= {() => editTask(item, index)}
                        ></img>
                        <img
                          src= {Delete}
                          className = 'imageDelete'
                          alt= 'imageDelete'
                          onClick= {() => removeTask(item, index)}
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
