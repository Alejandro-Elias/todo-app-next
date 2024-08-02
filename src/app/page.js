"use client";

import data from './data.json'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(3);
  const [inputValue, setInputValue] = useState('');

  const [todo, setTodo] = useState([])

  useEffect(() => {
    setTodo(data)
  }, [])
  

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      setCount(prevCount => {
        const newCount = prevCount + 1;
        return newCount;
      });
  
      const newTodo = {
        id: count + 1,
        texto: inputValue,
        bol: false
      };
  
      try {
        const response = await fetch('/api/crud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTodo)
        });
  
        if (response.ok) {
          const data = await response.json();
          setTodo(prevTodo => [...prevTodo, data]);
          setInputValue("");
        } else {
          console.error('Error al guardar el todo');
        }
      } catch (error) {
        console.error('Error al hacer la solicitud:', error);
      }
    }
  };
  
  
  const handleClick = () => {
    setIsActive(!isActive)    
  }

  const handleCheck = (id) => {
    setTodo(prevTodo =>
      prevTodo.map(task =>
        task.id === id ? { ...task, bol: !task.bol } : task
      )
    );
  };

  return (
    <>
      <main className='bg-veryLightGrayishBlue flex flex-col' >
      <div className='bg-[url("/bg-mobile-light.jpg")] bg-no-repeat bg-cover h-[200px] px-5 flex flex-col justify-evenly py-3'>
        <div className=' flex justify-between items-center ml-1'>
          <h1 className='text-white text-[26px] font-bold uppercase tracking-[10px]'>Todo</h1>
          <img className='w-5 h-5' src="/icon-moon.svg" alt="" />
        </div>
        <div className='w-full bg-white h-12 rounded-lg flex gap-4 items-center'>
          <div onClick={handleClick} className={`h-6 w-6 border-2 rounded-full ml-5 flex justify-center items-center ${isActive ? 'bg-gradient-to-br from-cyan-300 to-purple-600' : ''}`}>
            <img src="/icon-check.svg" alt="icon check" />
          </div>
          <input value={inputValue} onKeyDown={handleKeyDown} onChange={handleChange} className='border-0 active:border-0 focus:border-0 outline-none placeholder:text-[12px]' type="text" placeholder='Create a new ToDo...' />
          <p className='text-xs text-darkGrayishBlue' ></p>

        </div> 
      </div>
            

        <div className='px-11 -m-6'>
          {todo.map((task) => (
            <div key={task.id} className='w-full first-of-type:rounded-t-md bg-white h-12 flex gap-4 items-center border'>
              <div onClick={() => handleCheck(task.id)} className={`h-6 w-6 border-2 rounded-full ml-5 flex justify-center items-center ${task.bol ? 'bg-gradient-to-br from-cyan-300 to-purple-600' : ''}`}>
                <img src="/icon-check.svg" alt="icon check" />
              </div>
              <p className={` text-xs truncate w-60 text-wrap  ${task.bol ? 'text-darkGrayishBlue line-through' : 'text-veryDarkGrayishBlue'} `}> {task.texto} </p>
            </div>
          ))}
          <div className='w-full rounded-b-md bg-white h-12 flex items-center border justify-between px-6'>
            <p className='text-xs text-darkGrayishBlue' > {todo.length} items left </p>
            <p className='text-xs text-darkGrayishBlue' >Clear Completed</p>
          </div>
        </div>

        <div className='p-5' >
          <div className='w-full rounded-b-md bg-white h-12 flex items-center border justify-between px-6'>
            <ul className='w-full flex justify-between px-16 text-darkGrayishBlue font-bold text-sm'>
              <a><li className=' hover:text-sky-700'>All</li></a>
              <a><li className=' hover:text-sky-700'>Active</li></a>
              <a><li className=' hover:text-sky-700'>Completed</li></a>              
            </ul>
          </div>
        </div>
        



        <div className='min-h-[300px] flex items-end justify-center' >
          <p className='text-darkGrayishBlue'>Drag and drop to reorder list</p>
        </div>
      </main>

      <footer className='bg-veryLightGrayishBlue p-5'>
        <div className="attribution text-xs">
          Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>.
          Coded by <a href="#">Your Name Here</a>.
        </div>
      </footer>
    </>
  )
}
