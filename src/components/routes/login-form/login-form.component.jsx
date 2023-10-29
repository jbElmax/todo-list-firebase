import { useState } from "react";
import Button from "../../button/button.component";
import Input from "../../input/input.component";
import Label from "../../label/label.component";
import GoogleLogo from "../../../assets/google_logo.svg";
import { signInWithGooglePopup,signInAuthUserWithEmailAndPassword } from "../../../utils/firebase/firebase.utils";
import { Link,useNavigate } from "react-router-dom";

const defaultFieldsValue = {
    email:'',
    password:''
}
const LoginForm = ()=>{
    const[signInFields,setSignInFields]= useState(defaultFieldsValue);
    const{email,password} = signInFields;
    const navigate = useNavigate();

    const onChangeHandler = (event)=>{
        const{name,value} = event.target;

        setSignInFields({...signInFields,[name]:value});
     
    }
    const onGoogleBtnClickHandler = async ()=>{
        await signInWithGooglePopup();
    }
    const resetFormFields = () => {
        setSignInFields(defaultFieldsValue);
    }
    const onSubmitHandler = async (event)=>{
        event.preventDefault();

        try{
            await signInAuthUserWithEmailAndPassword(email,password);
            resetFormFields();
            navigate("/");
        }catch(error){
            switch(error.code){
                case "auth/wrong-password":
                    alert("incorrect password for email");
                break;

                case "auth/user-not-found":
                    alert("account not found");
                break; 
                case "auth/invalid-login-credentials":
                    alert("Invalid login credentials");
                    break; 
                default:
                    console.log("error occured while signing in",error.message)
            }
        }
    }
    return(
        <div className="container-xl mx-auto bg-gray-400 h-screen p-6"> 
            <div className="bg-white w-[300px] lg:w-[400px] mx-auto rounded-md shadow-md px-4 py-6">
                <h1 className="text-3xl text-gray-700 text-center" >ToDo List</h1>
                {/* <h2 className="text-xl text-gray-700 text-center mt-[15px]" >Enter Credentials</h2> */}
                
               
                    <form onSubmit={onSubmitHandler}>
                    <div className="flex flex-col">
                        <Label 
                            htmlFor="username" 
                            className="mt-[20px] text-gray-700" 
                            text="Email"
                        />
                        <Input inputOptions={{
                            id:'username',
                            type:'text',
                            className:'py-2 rounded mt-[10px] border-2 border-gray-300 text-gray-800 px-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200',
                            onChange:onChangeHandler,
                            name:'email',
                            value:email
                            }} 
                        />                               
                        <Label htmlFor="pass" className="mt-[20px] text-gray-700" text="Password"/>
                        <Input inputOptions={{
                            id:'pass',
                            type:'password',
                            className:'py-2 rounded mt-[10px] border-2 border-gray-300 text-gray-800 px-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200',
                            onChange:onChangeHandler,
                            name:'password',
                            value:password

                            }}
                        />                    
                        <Button text='Sign In' buttonOptions={{
                            type:'submit',
                            className:'w-full bg-blue-500 rounded mt-[30px] text-white py-2 hover:bg-blue-600 border-2 border-blue-600',
                            

                            }} 
                        />
                        </div>
                    </form>
                    <p className="text-center text-gray-700 mt-[15px]">Or</p>
                    <Button text='Sign In w/ Google' logo={GoogleLogo} buttonOptions={{
                        className:'w-full bg-blue text-gray-800 border-2 border-blue-500 py-2 mt-[10px] rounded hover:bg-blue-200 flex items-center justify-center gap-x-1',
                        onClick:onGoogleBtnClickHandler
                        }} 
                    />
                    <p className="text-gray-700 mt-[15px] text-sm items-center flex justify-between">Do not have an Account?<Link to="/signup" className="ml-[5px] text-blue-500 underline text-sm cursor-pointer">Sign Up</Link></p>
                

            </div>
            
        </div>
    )
}

export default LoginForm;