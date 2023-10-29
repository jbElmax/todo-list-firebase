import Button from "../button/button.component";

const ConfirmModal = ({onClose,onConfirm,isOpen,task})=>{

    return(
        isOpen &&(
            <div className="absolute inset-0 overflow-y-auto bg-black bg-opacity-50 py-6">
                <div className="bg-white p-4 rounded shadow-md lg:w-[450px] w-[350px] mx-auto">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Are you sure to delete the task?</h2>
                        <svg id="iconCloseLoan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={onClose}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>    
                    <p>{`"${task.taskDescription}"`}</p>
                    <div className="flex justify-end mt-[15px]">
                        <Button text = "Cancel" logo="" buttonOptions={{
                            onClick:onClose,
                            className:"bg-gray-400 hover:bg-gray-500 text-white p-2 rounded mr-2"
                        }} />
                                        
                        <Button text="Delete" buttonOptions={{
                            onClick:onConfirm,
                            className:"bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                            }} 
                        />
                        
                        

                    </div>
                </div>
        </div>
      )
    )
}

export default ConfirmModal;