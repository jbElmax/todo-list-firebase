import Label from "../../label/label.component";
import Input from "../../input/input.component";
import Button from "../../button/button.component";
import { useState } from "react";
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../../utils/firebase/firebase.utils";
import { useNavigate } from "react-router-dom";

const defaultFormFields = {
    displayName:'',
    email:'',
    password:'',
    confirmPassword:''
}
const SignUpForm = ()=>{
    const [formFields,setFormFields] = useState(defaultFormFields);
    const {displayName,email,password,confirmPassword} = formFields;
    const navigate = useNavigate();

    const onChangeHandler = (event)=>{
        const {name,value} = event.target;

        setFormFields({...formFields,[name]:value});
    }
    const backToLogin = ()=>{
        navigate("/login");
    }
    const onSubmitFormHandler = async(event)=>{
        event.preventDefault();
        if(password !== confirmPassword){
            alert("Passwords did not match.");
        }

        try{
            //create user 
            const {user} = await createAuthUserWithEmailAndPassword(email,password);
            await createUserDocumentFromAuth(user,{displayName})
            setFormFields(defaultFormFields);
            navigate("/");

        }catch(error){
            //alert error
            if(error.code === 'auth/email-already-in-use'){
                alert('Email already exist.');
            }
            console.log("unable to create a user",error.message)
        }
    }
    return(
        <div className="container-xl mx-auto bg-gray-400 h-screen p-6"> 
            <div className="bg-white w-[320px] lg:w-[500] mx-auto rounded-md shadow-md px-4 py-6">
                <form onSubmit={onSubmitFormHandler}>
                    <h1 className="text-3xl text-gray-700 text-center" >Sign Up</h1>

                    <div className="flex flex-col">
                    <Label 
                            htmlFor="displayName" 
                            className="mt-[20px] text-gray-700" 
                            text="DisplayName"
                        />
                        <Input inputOptions={{
                            id:'displayName',
                            type:'text',
                            className:'py-2 rounded mt-[10px] border-2 border-gray-300 text-gray-800 px-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200',
                            onChange:onChangeHandler,
                            name:'displayName',
                            value:displayName
                            }} 
                        /> 
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
                        <Label htmlFor="confirmPass" className="mt-[20px] text-gray-700" text="Confirm Password"/>
                        <Input inputOptions={{
                            id:'confirmPass',
                            type:'password',
                            className:'py-2 rounded mt-[10px] border-2 border-gray-300 text-gray-800 px-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200',
                            onChange:onChangeHandler,
                            name:'confirmPassword',
                            value:confirmPassword

                            }}
                        />                     
                        <Button text='Sign Up' buttonOptions={{
                            type:'submit',
                            className:'w-full bg-blue-500 rounded mt-[30px] text-white py-2 hover:bg-blue-600 border-2 border-blue-600',
                            

                            }} 
                        />

                    </div>
                </form>
                <Button text="Back to Login" buttonOptions={{
                    type:'button',
                    className:'w-full bg-white-500 rounded mt-[30px] text-gray-700 py-2 hover:bg-slate-300 border-2 border-blue-600',
                    onClick:backToLogin
                }}/>

            </div>
            
        </div>
    )
}

export default SignUpForm;