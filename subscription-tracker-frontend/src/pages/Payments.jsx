import {useEffect,useState} from "react";
import API, { getAllUsers, getSubscriptionsByUserId, getAllSubscriptions } from "../services/api";
import Toast from "../components/Toast";

function Payments() {
    const [payments,setPayments]=useState([]);
    const [alert, setAlert] = useState(null);
    const [form,setForm]=useState({amount:"",userId:"",subscriptionId:""});
    const [users, setUsers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]); // all subscriptions
    const [userSubscriptions, setUserSubscriptions] = useState([]); // subscriptions for selected user

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

    useEffect(() => {
        getAllUsers().then(r => setUsers(Array.isArray(r.data) ? r.data : [])).catch(console.error);
        getAllSubscriptions().then(r => setSubscriptions(Array.isArray(r.data) ? r.data : [])).catch(console.error);
    }, []);

    const handleSubmit=()=>{
        const paymentDate = new Date().toISOString().slice(0,10);
        const payload = {
            amount: parseFloat(form.amount) || 0,
            paymentDate,
            subscription: { id: parseInt(form.subscriptionId) }
        };
        // Duplicate check: same subscription + paymentDate
        const exists = payments.some(p => p.subscription && p.subscription.id === payload.subscription.id && p.paymentDate === payload.paymentDate);
        if (exists) {
            setAlert({ type: 'danger', message: 'A payment for this subscription on this date already exists.' });
            setTimeout(() => setAlert(null), 4000);
            return;
        }
        API.post(`/payments`, payload).then(() => {
            setForm({ amount: "", userId: "", subscriptionId: "" });
            fetchPayments();
        }).catch(err=>console.error(err));
       
    };

    const handleUserChange = (userId) => {
        setForm(prev => ({ ...prev, userId, subscriptionId: '' }));
        if (!userId) {
            setUserSubscriptions([]);
            return;
        }
        // fetch subscriptions for this user
        getSubscriptionsByUserId(userId).then(r => {
            const data = Array.isArray(r.data) ? r.data : [];
            setUserSubscriptions(data);
            // auto-select first subscription if present
            if (data.length > 0) setForm(prev => ({ ...prev, subscriptionId: data[0].id, amount: data[0].amount }));
        }).catch(err => {
            console.error(err);
            setUserSubscriptions([]);
        });
    }

    // whenever subscriptionId changes, set amount from subscription (if available)
    useEffect(() => {
        if (!form.subscriptionId) return;
        const sid = parseInt(form.subscriptionId);
        const sub = subscriptions.find(s => s.id === sid) || userSubscriptions.find(s => s.id === sid);
        if (sub && typeof sub.amount !== 'undefined') {
            setForm(prev => ({ ...prev, amount: sub.amount }));
        }
    }, [form.subscriptionId, subscriptions, userSubscriptions]);
        return (
            <div className="p-4">
                    <Toast alert={alert} onClose={() => setAlert(null)} />
                <h1 className="mb-3">Payments</h1>
                <div className="card card-body mb-4">
                    <div className="row g-2">
                        
                        <div className="col-md-3">
                            <select className="form-select" value={form.userId} onChange={e => handleUserChange(e.target.value)}>
                                <option value="">Select User (auto-fill subscriptions)</option>
                                {(users || []).map(u => (<option key={u.id} value={u.id}>{u.name} ({u.email})</option>))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" value={form.subscriptionId} onChange={e=>setForm({...form,subscriptionId:e.target.value})}>
                                <option value="">Select Subscription</option>
                                {(userSubscriptions.length ? userSubscriptions : subscriptions).map(s => (
                                    <option key={s.id} value={s.id}>{s.name} - {s.billingCycle} - ${typeof s.amount==='number'?s.amount.toFixed(2):s.amount}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input className="form-control" placeholder="Amount" value={form.amount} disabled />
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
                                    <th>User</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(payments) ? payments : []).map(payment => {
                                    // try to resolve subscription and user from local subscriptions cache
                                    const sub = subscriptions.find(s => s.id === (payment.subscription && payment.subscription.id)) || null;
                                    const userName = sub ? (sub.user?.name || sub.userName) : '';
                                    const subLabel = sub ? `${sub.name} (${sub.id})` : (payment.subscription ? `#${payment.subscription.id}` : '-');
                                    return (
                                        <tr key={payment.id}>
                                            <td>${typeof payment.amount === 'number' ? payment.amount.toFixed(2) : (payment.amount || '0.00')}</td>
                                            <td>{subLabel}</td>
                                            <td>{userName}</td>
                                            <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
}
export default Payments;