function FormInput({placeholder,value,onChange,type="text"}) {
    return (
        <input 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
            type={type} 
            style={{padding:"10px",margin:"5px",border:"1px solid #ccc",borderRadius:"5px",width:"200px"}} 
        />
    );
}
export default FormInput;