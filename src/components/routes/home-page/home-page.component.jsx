import { useEffect, useState,useRef } from "react";
import { getTasksRecords, signOutUser,setTaskDone,deleteSingleTask,updateTaskDescription,deleteAllTask,createTaskDoc } from "../../../utils/firebase/firebase.utils";
import Button from "../../button/button.component";
import Input from "../../input/input.component";

import EditModal from "../../edit-modal/edit-modal.component";
import LoadingSpinner from "../../loading-spinner/loading-spinner.component";
import EditIcon from "../../edit-icon/edit-icon.component";
import DeleteIcon from "../../delete-icon/delete-icon.component";
import Checkbox from "../../checkbox/checkbox.component";
import ConfirmModal from "../../confirm-modal/confirm-modal.component";


const HomePage = ({user})=>{
    const [task,setTask] = useState('');
    const email = user.email;
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [editingTask,setEditingTask] = useState(null);
    const myInputRef = useRef();
    const [isConfirmModalOpen,setIsConfirmModalOpen] = useState(false);
    const[toDeleteTask,setToDeleteTask] = useState(null);

    useEffect(() => {
        myInputRef.current.focus();
      }, []);

    const openEditModal = (task) =>{
        setEditingTask(task);
    }
    const closeEditModal = ()=>{
        setEditingTask(null);
    }
    const updateData = (documents) => {
        setData(documents);
        setLoading(false);
      };

      const handleEditSubmit =async (task, newDescription) => {

        setLoading(true);
        await updateTaskDescription(task, newDescription);
      
        // Refresh the task list
        getListOfTasks(email,updateData);
        
      };

    useEffect(()=>{
        const email = user.email;

        getListOfTasks(email,updateData);

    },[user.email],);
    
    
    const signoutHandler = async ()=>{
        await signOutUser();
    }

    const onInputChangeHandler = (event)=>{
        const taskDesc = event.target.value;
        setTask(taskDesc);
    }

    const onFormSubmitHandler = async (event)=>{
        event.preventDefault();
        if(task ===""){
            alert("Please input something.");
            myInputRef.current.focus();
        }else{
            setLoading(true);

            await createTaskDoc(user,task);
    
            getListOfTasks(email,updateData);
    
            setTask("");
        }

    }

    const confirmDelete = async()=>{
        setIsConfirmModalOpen(false);
        setLoading(true);
        await deleteSingleTask(toDeleteTask);
        
        getListOfTasks(email,updateData);
    }
    const cancelDelete = ()=>{
        setIsConfirmModalOpen(false)
    }

    function getListOfTasks(email,updateData){
        getTasksRecords(email, updateData)
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setLoading(false);
        });
        
    }

    async function toggleTaskStatus(task){
        setLoading(true);
        await setTaskDone(task);
        getListOfTasks(email,updateData);

    }

    const handleDeleteClick = (task)=>{
        setIsConfirmModalOpen(true);
        setToDeleteTask(task);
    }


    async function deleteAllTheTasks(){
        setLoading(true);
        await deleteAllTask();
        getListOfTasks(email,updateData);
  
    }

    const countUndoneTasks = () => {
        return data.filter((task) => !task.isDone).length;
      };
    return(
        <div className="w-full lg:w-full h-screen bg-gray-300">
            <div id="header" className="h-[250px] bg-gradient-to-r from-cyan-500 to-blue-500 justify-center text-center py-2">
                <h1 className="text-white text-3xl">ToDo List</h1>
            </div>
            <div id="task-container" className="mx-auto lg:w-[600px] w-[350px] lg:h-[400px] h-[300px] -mt-[180px]">
                <div className="flex justify-between py-2">
                    <h2 className="text-2xl text-white">My Tasks</h2>
                    <p className="underline cursor-pointer text-white" onClick={signoutHandler}>Sign Out</p>

                    
                </div>
                <form onSubmit={onFormSubmitHandler}>
                    <div className="flex flex-row justify-between gap-x-2 mt-[20px]">
                        <Input inputOptions={{
                            className:"rounded px-2 py-3 w-[290px] lg:w-[550px] focus:border-blue-600 focus:outline-none focus:ring focus:ring-green-300",
                            placeholder:"type task here",
                            onChange:onInputChangeHandler,
                            value:task,
                            ref:myInputRef
                        }} />
                        <Button buttonOptions={{
                            className:"px-2 py-2 border-2 border-white rounded text-white hover:bg-blue-600",
                            
                            type:'submit'
                            }} 
                            text="Add"
                            
                        />
                    </div>
                </form>
                <div className="bg-white h-[450px] mt-[20px] rounded shadow-md overflow-y-auto">
                    <div className="flex justify-between px-3 py-2">
                        <p className="text-gray-500">{countUndoneTasks()} task left</p><p className="text-gray-500 hover:cursor-pointer underline hover:text-gray-700" onClick={()=>deleteAllTheTasks()}>delete all task</p>
                        
                    </div>
                    <hr></hr>
                    {loading ?(<LoadingSpinner/>):(
                        <>
                            {data.map((item)=>{
                                return(
                                    <div key={item.id}>
                                    <div key={item.id} className="flex flex-row justify-between px-3 py-3 hover:bg-slate-200">
                                            <div className="flex gap-x-2 items-center">
                                                <Checkbox
                                                    type="checkbox" 
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                                                    checked={item.isDone}
                                                    onChange={()=>toggleTaskStatus(item)}
                                                    name={item.id}
                                                /> 
                                            
                                               
                                                <p className={`text-base text-gray-700 font-medium ${item.isDone ? 'line-through':''}`}>{item.taskDescription}</p>
                                            </div>

                                            <div className="flex gap-x-5">

                                                <EditIcon task={item} onClick={openEditModal} title="Edit"/>
                                      
                                                <DeleteIcon task={item} onClick={handleDeleteClick} title="Delete"/>

                                            </div>
                                           
                                                                      
                                    </div>
                                    <hr/>
                                    </div>
                                )
                            })}
                        </>
                    )}

                </div>
            </div>

            {editingTask && (
                        <EditModal
                            task={editingTask}
                            onSave={handleEditSubmit}
                            onClose={closeEditModal}
                        />
                    )}    
            {isConfirmModalOpen && (<ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={confirmDelete}
                onClose={cancelDelete}
                task={toDeleteTask}
            
            /> 
            )}                           
        </div>
    )
}

export default HomePage;