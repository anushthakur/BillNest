import{useEffect,useState} from "react";
import API, { getAllUsers } from "../services/api";
import Toast from "../components/Toast";

function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [alert, setAlert] = useState(null);
    const [form, setForm] = useState({ name: "", price: "", renewalDate: "" , userId: "", billingCycle: "MONTHLY" });
    const [editId, setEditId] = useState(null);
    const [users, setUsers] = useState([]);

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

    useEffect(() => {
        getAllUsers().then(r => setUsers(Array.isArray(r.data) ? r.data : [])).catch(console.error);
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
        // Duplicate check: same name + user + billingCycle
        const exists = subscriptions.some(s => s.name && body.name && s.name.trim().toLowerCase() === body.name.trim().toLowerCase()
            && ((s.user && s.user.id) === (body.user && body.user.id))
            && s.billingCycle === body.billingCycle);
        if (exists) {
            setAlert({ type: 'danger', message: 'A subscription with the same name/user and billing cycle already exists.' });
            setTimeout(() => setAlert(null), 4000);
            return;
        }
        const action = editId ? API.put(`/subscriptions/${editId}`, body) : API.post(`/subscriptions`, body);
        action.then(res => {
            setForm({ name: "", price: "", renewalDate: "", userId: "", billingCycle: "MONTHLY" });
            setEditId(null);
            fetchSubscriptions();
        }).catch(err => console.error(err));
    }

    const handleEdit = (sub) => {
        setForm({ name: sub.name || "", price: sub.amount || "", renewalDate: sub.renewalDate || "", userId: sub.user ? sub.user.id : (sub.userId || ""), billingCycle: sub.billingCycle || "MONTHLY" });
        setEditId(sub.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this subscription? This will remove linked payments.')) return;
        try {
            await API.delete(`/subscriptions/${id}`);
            setSubscriptions(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
            setAlert({ type: 'danger', message: 'Failed to delete subscription' });
            setTimeout(() => setAlert(null), 3000);
        }
    }

    return (
        <div className="p-4">
            <Toast alert={alert} onClose={() => setAlert(null)} />
            <h1 className="mb-3">Subscriptions</h1>
            <div className="card card-body mb-4">
                <div className="row g-2">
                    <div className="col-md-3">
                        <select className="form-select" value={form.userId} onChange={e => { const id = e.target.value; setForm({ ...form, userId: id, name: users.find(u=>String(u.id)===String(id))?.name || '' }) }}>
                            <option value="">Select User</option>
                            {users.map(u => (<option key={u.id} value={u.id}>{u.name} ({u.email})</option>))}
                        </select>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(Array.isArray(subscriptions) ? subscriptions : []).map(sub => (
                                <tr key={sub.id}>
                                    <td>{sub.name}</td>
                                    <td>${typeof sub.amount === 'number' ? sub.amount.toFixed(2) : (sub.amount || '0.00')}</td>
                                    <td>{sub.billingCycle}</td>
                                    <td>{sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'Undated'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(sub)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sub.id)}>Delete</button>
                                    </td>
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