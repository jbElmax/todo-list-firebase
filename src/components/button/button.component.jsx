
const Button = ({buttonOptions,text,logo})=>{
    return(
        <button {...buttonOptions}>
            {logo? <img src ={logo} alt="Logo"/>:''}{text}
        </button>
    )
}

export default Button;