import{useEffect,useState} from "react";
import API from "../services/api";

function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", renewalDate: "" , userId: "", billingCycle: "MONTHLY" });

    const fetchSubscriptions = () => {
        API.get("/subscriptions")
            .then(res => {
                console.log("fetched subscriptions:", res.data);
                // make sure we always store an array
                const data = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.content) ? res.data.content : []);
                setSubscriptions(data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleSubmit = () => {
        // Build payload matching backend Subscription entity
        const body = {
            name: form.name,
            amount: parseFloat(form.price) || 0,
            billingCycle: form.billingCycle || "MONTHLY",
            renewalDate: form.renewalDate ? form.renewalDate : null,
            user: form.userId ? { id: parseInt(form.userId) } : null
        };
        API.post(`/subscriptions`, body).then(() => {
            setForm({ name: "", price: "", renewalDate: "", userId: "", billingCycle: "MONTHLY" });
            fetchSubscriptions();
        }).catch(err => console.error(err));
    }

    return (
        <div className="p-4">
            <h1 className="mb-3">Subscriptions</h1>
            <div className="card card-body mb-4">
                <div className="row g-2">
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                        <input className="form-control" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                        <select className="form-select" value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value })}>
                            <option value="MONTHLY">Monthly</option>
                            <option value="YEARLY">Yearly</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input className="form-control" placeholder="Renewal Date (YYYY-MM-DD)" value={form.renewalDate} onChange={e => setForm({ ...form, renewalDate: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                        <input className="form-control" placeholder="User ID" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} />
                    </div>
                    <div className="col-md-1 d-flex">
                        <button className="btn btn-primary" onClick={handleSubmit}>Add</button>
                    </div>
                </div>
            </div>

            <div className="card card-highlight">
                <div className="card-body">
                    <h5 className="card-title">All Subscriptions</h5>
                    <table className="table table-hover mt-3">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Billing Cycle</th>
                                <th>Renewal Date</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(Array.isArray(subscriptions) ? subscriptions : []).map(sub => (
                                <tr key={sub.id}>
                                    <td>{sub.name}</td>
                                    <td>${sub.amount}</td>
                                    <td>{sub.billingCycle}</td>
                                    <td>{sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'Undated'}</td>
                                    <td>{sub.user ? sub.user.name || sub.user.id : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default Subscriptions;