import { RxCross1 } from "react-icons/rx";
export const Popup = ({popupHeader, popupMsg, setPopupOn, popupColor, setDisableUpdatePopup = null}) => {
  return (
    <div className ={`fixed z-100 rounded-md top-0 bottom-0 my-auto right-0 left-0 mx-auto text-center bg-white border-2
      border-gray-400 w-[95vw] md:w-2xl h-50 pt-3 pb-30 z-100`}>
      <h1 className = {`font-bold text-${popupColor} underline pb-3 text-2xl`}>{popupHeader}:</h1>
      <p className = "text-lg px-5">
      {popupMsg}
      </p>
      <button type="" onClick={()=>setPopupOn(null)} className = "absolute right-2
        top-2 cursor-pointer hover:bg-gray-100 p-3 text-2xl rounded-md border-2 border-gray-200">
        <RxCross1 size={20}/>
      </button>

      {setDisableUpdatePopup &&
        <div className = "mt-1 text-lg font-bold flex flex flex-row gap-2 items-center justify-center">
          <label htmlFor="showingPopupInFuture">Don't show again</label>
          <input type="checkbox" name="showingPopupInFuture" id="showingPopupInFuture" onChange={
            (e) => {
              if (e.target.checked) {
                setDisableUpdatePopup(true)
              } else {
                setDisableUpdatePopup(false)
              }
            }
          }  />
        </div>

      }
    </div>
  )
}
