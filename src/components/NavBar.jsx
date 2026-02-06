import {useState, useEffect} from "react";


export const NavBar = ({changePage, disabledEventDropdown, setEvent, defaultEvent, setNationality, defaultNationality}) => {
  const isSmall = window.innerWidth < 500
  

  return (
    <div className = "flex flex-col bg-white drop-shadow-sm sm:px-30 text-lg py-3 fixed top-0 w-screen z-100">

      {isSmall && 
        <div className="flex flex-col justify-center items-center gap-2">

            <div className="flex flex-row gap-2">
              
              <h1 className = "text-lg py-2 font-bold">WCA Comp Sim</h1>
              <a href="" className="py-1 hover:bg-gray-200 transition py-2 px-3 rounded-md">Home</a>
              <a href="" onClick={()=>changePage("")} className="py-1 hover:bg-gray-200 transition py-2 px-3 rounded-md">Stats</a>
            </div>
        </div>


      }

      {!isSmall && 
        <div className = "flex text-xl gap-3">
            <h1 className = " py-2 pr-5 ">WCA Comp Sim</h1>

            <a href="#" onClick={()=>changePage("Home")} className="hover:bg-gray-200 transition py-2 px-3 rounded-md">Home</a>
            <a href="#" onClick={()=>changePage("Stats")}  className=" hover:bg-gray-200 transition py-2 px-3 rounded-md">Stats</a>
        </div>


      }

    </div>

  )
}
