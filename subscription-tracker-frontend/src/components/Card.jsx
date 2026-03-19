function Card({title,value}) {
    return (
        <div style={{border:"1px solid #ccc",padding:"20px",borderRadius:"10px",width:"200px",margin:"10px",boxShadow:"2px 2px 10px rgba(0,0,0,0.1)"}}>
            <h3>{title}</h3>
            <h2>{value}</h2>
        </div>
    );
}
export default Card;