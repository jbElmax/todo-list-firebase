import SpinnerGif from '../../assets/spinner.gif';

const LoadingSpinner = ()=>{
    return(
        <div className="flex items-center justify-center">
            <img src={SpinnerGif} alt='loading gif' className="w-[100px] h-[100px]" />
      </div>
    )
}

export default LoadingSpinner;