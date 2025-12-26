import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {SelectCubers} from './components/sections/SelectCubers'
import {NavBar} from './components/NavBar'

function App() {
  return (
    <>
      <NavBar/>
      <SelectCubers/>
    </>
  )

}

export default App
