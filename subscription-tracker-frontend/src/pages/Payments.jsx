import {useEffect,useState} from "react";
import API from "../services/api";

function Payments() {
    const [payments,setPayments]=useState([]);
    const [form,setForm]=useState({amount:"",date:"",subscriptionId:""});

    const fetchPayments=()=>{
        API.get("/payments")
            .then(res => {
                console.log("fetched payments:", res.data);
                const data = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.content) ? res.data.content : []);
                setPayments(data);
            })
            .catch(err=>console.error(err));
    };

    useEffect(()=>{
        fetchPayments();
    },[]);

    const handleSubmit=()=>{
        const payload = {
            amount: parseFloat(form.amount) || 0,
            paymentDate: new Date().toISOString().slice(0,10),
            subscription: { id: parseInt(form.subscriptionId) }
        };
        API.post(`/payments`, payload).then(fetchPayments).catch(err=>console.error(err));
       
    };
        return (
            <div className="p-4">
                <h1 className="mb-3">Payments</h1>
                <div className="card card-body mb-4">
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input className="form-control" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
                        </div>
                        <div className="col-md-4">
                            <input className="form-control" placeholder="Subscription ID" value={form.subscriptionId} onChange={e=>setForm({...form,subscriptionId:e.target.value})} />
                        </div>
                        <div className="col-md-4 d-flex">
                            <button className="btn btn-primary" onClick={handleSubmit}>Add Payment</button>
                        </div>
                    </div>
                </div>

                <div className="card card-highlight">
                    <div className="card-body">
                        <h5 className="card-title">Payments</h5>
                        <table className="table table-hover mt-3">
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Subscription</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(payments) ? payments : []).map(payment => (
                                    <tr key={payment.id}>
                                        <td>${payment.amount}</td>
                                        <td>{payment.subscription ? payment.subscription.id : '-'}</td>
                                        <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
}
export default Payments;