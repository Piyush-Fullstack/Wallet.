import React, { useState } from 'react'
import './index.css'
import '@qpokychuk/gilroy/normal.css';

const App = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const operators = ['+', '-', '*', '/']
  const [display, setdisplay] = useState('')

  const cleardisplay = () => {
    setdisplay('')
  }

  const backspace = () => {
    setdisplay(display.slice(0, -1))
  }

  const handleClick = (value) => {
    const lastChar = display.slice(-1);
    if (operators.includes(value)) {
      if (display === '') return;
      if (operators.includes(lastChar)) return;
    }
    setdisplay(display + value)
  }

  const calculate = () => {
    const lastChar = display.slice(-1);
    try {
      if (operators.includes(lastChar)) {
        alert('Invalid Format')
        return;
      }
      if (display !== "") {
        setdisplay(eval(display).toString())
      }
    } catch (error) {
      setdisplay('Error')
      setTimeout(() => {
        setdisplay('')
      }, 1000);
    }
  }

  return (
    <>
      <h1>Calculator</h1>
      <div className="container">
        <div className="heading">
          <input 
            value={display}
            readOnly
            className='input'
            type="text" 
            placeholder="0"
          />
        </div>
        <div className="box">
            {/* Numbers Map */}
            {numbers.map((num, idx) => {
              return <button onClick={() => handleClick(num.toString())} key={idx} className='items'>{num}</button>
            })}

            {/* Operators Map */}
            {operators.map((op, idx) => {
              return <button onClick={() => handleClick(op)} key={idx} className='items'>{op}</button>
            })}

            {/* Special Buttons */}
            <button onClick={calculate} className='items'>=</button>
            <button onClick={backspace} className='items'>⌫</button>
            <button onClick={cleardisplay} className='items ac'>AC</button>
        </div>
      </div>
    </>
  )
}

export default App;