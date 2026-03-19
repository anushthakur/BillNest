import { useEffect, useState } from "react";
import API, { getAllUsers, getAllSubscriptions, getAllPayments } from "../services/api";
import Card from "../components/Card";

function DashBoard() {
    const [data, setData] = useState(null);
    const [users, setUsers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [payments, setPayments] = useState([]);
    const [activeView, setActiveView] = useState([]);

    useEffect(() => {
        API.get("/dashboard")
            .then((res) => setData(res.data))
            .catch((err) => console.error(err));

        // debug: fetch active subscriptions lightweight view and log details
        API.get("/dashboard/active")
            .then(res => {
                console.log("Active subscriptions (dashboard/active):", res.data);
                if (Array.isArray(res.data)) setActiveView(res.data);
            })
            .catch(err => console.error("Error loading active subscriptions:", err));

        getAllUsers().then(r => setUsers(Array.isArray(r.data) ? r.data : [])).catch(console.error);
        getAllSubscriptions()
            .then(r => {
                const subs = Array.isArray(r.data) ? r.data : [];
                setSubscriptions(subs);
                console.log("All subscriptions fetched:", subs);
            })
            .catch(console.error);
        getAllPayments().then(r => setPayments(Array.isArray(r.data) ? r.data : [])).catch(console.error);
    }, []);

    // debug: log upcoming renewals returned by the dashboard payload
    useEffect(() => {
        if (data) console.log("Dashboard upcomingRenewals:", data.upcomingRenewals);
    }, [data]);

    // also log derived summaries so we can see why values may be blank
    useEffect(() => {
        console.log("users (raw):", users);
        console.log("subscriptions (raw):", subscriptions);
        console.log("payments (raw):", payments);
        console.log("activeView (from /dashboard/active):", activeView);
    }, [users, subscriptions, payments, activeView]);

    if (!data) return <div className="p-4">Loading...</div>;

    // compute per-user aggregates
    const usersSummary = users.map(u => {
        const subs = subscriptions.filter(s => (s.user && s.user.id === u.id) || s.userId === u.id);
        const subsInfo = subs.map(s => ({ id: s.id, name: s.name, billingCycle: s.billingCycle, amount: s.amount, renewalDate: s.renewalDate, userName: s.user?.name || s.userName }));
        const userPayments = payments.filter(p => p.subscription && subs.some(s => s.id === p.subscription.id));
        const totalPaid = userPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const nextRenewal = subs
            .map(s => s.renewalDate)
            .filter(d => d)
            .map(d => new Date(d))
            .sort((a,b) => a - b)[0];
        return { user: u, subscriptions: subsInfo, totalPaid, nextRenewal };
    });

    const safeToFixed = (n) => (typeof n === 'number' ? n.toFixed(2) : (n ? Number(n).toFixed(2) : '0.00'));

    return (
        <div className="p-4">
            <h1 className="mb-4">Dashboard</h1>

            <div className="row g-3 mb-4">
                <div className="col-sm-6 col-md-3">
                    <div className="card card-highlight p-3">
                        <h6 className="text-muted">Active Subscriptions</h6>
                        <h3>{data.activeSubscriptions ?? 0}</h3>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-highlight p-3">
                        <h6 className="text-muted">Monthly Cost</h6>
                        <h3>${safeToFixed(data.totalMonthlyCost)}</h3>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-highlight p-3">
                        <h6 className="text-muted">Yearly Cost</h6>
                        <h3>${safeToFixed(data.totalYearlyCost)}</h3>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-highlight p-3">
                        <h6 className="text-muted">Total Paid</h6>
                        <h3>${safeToFixed(data.totalPaidAmount)}</h3>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card card-highlight p-3">
                        <h5>Active Subscriptions (details)</h5>
                        <ul className="list-group list-group-flush">
                            {(activeView || []).map((s, idx) => (
                                <li key={s.id || idx} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{s.name}</strong>
                                
                                        <div className="text-muted small">Billing: {s.billingCycle || '-'}</div>
                                    </div>
                                    <div className="text-end">
                                        <div>${typeof s.amount === 'number' ? s.amount.toFixed(2) : (s.amount || '-')}</div>
                                        <div className="text-muted small">Renewal: {s.renewalDate ? new Date(s.renewalDate).toLocaleDateString() : 'Undated'}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card card-highlight p-3">
                        <h5>Upcoming Renewals</h5>
                        <ul className="list-group list-group-flush">
                            {(data.upcomingRenewals || []).map((sub, idx) => (
                                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{sub.name}</strong>
                                        <div className="text-muted small">{sub.user ? (sub.user.name || sub.userName) : (sub.userName || '')}</div>
                                    </div>
                                    <div>
                                        <span className="me-3">{sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'Undated'}</span>
                                        <span className={`badge ${sub.active ? 'badge-status-active' : 'badge-status-inactive'} text-white`}>{sub.active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card card-highlight p-3">
                        <h5>Users Summary</h5>
                        <table className="table table-hover mt-2">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Subscriptions</th>
                                    <th>Total Paid</th>
                                    <th>Next Renewal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersSummary.map((u) => (
                                    <tr key={u.user.id}>
                                        <td>{u.user.name}</td>
                                        <td>
                                            {u.subscriptions.map(s => (
                                                <div key={s.id}><strong>{s.name}</strong> <span className="text-muted">({s.billingCycle})</span> - ${typeof s.amount === 'number' ? s.amount.toFixed(2) : (s.amount || '0.00')}</div>
                                            ))}
                                        </td>
                                        <td>${u.totalPaid.toFixed(2)}</td>
                                        <td>{u.nextRenewal ? u.nextRenewal.toLocaleDateString() : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;