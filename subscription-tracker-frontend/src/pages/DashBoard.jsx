import { useEffect, useState } from "react";
import API, { getAllUsers, getAllSubscriptions, getAllPayments } from "../services/api";
import Card from "../components/Card";

function DashBoard() {
    const [data, setData] = useState(null);
    const [users, setUsers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        API.get("/dashboard")
            .then((res) => setData(res.data))
            .catch((err) => console.error(err));

        getAllUsers().then(r => setUsers(Array.isArray(r.data) ? r.data : [])).catch(console.error);
        getAllSubscriptions().then(r => setSubscriptions(Array.isArray(r.data) ? r.data : [])).catch(console.error);
        getAllPayments().then(r => setPayments(Array.isArray(r.data) ? r.data : [])).catch(console.error);
    }, []);

    if (!data) return <div className="p-4">Loading...</div>;

    // compute per-user aggregates
    const usersSummary = users.map(u => {
        const subs = subscriptions.filter(s => s.user && s.user.id === u.id);
        const subsInfo = subs.map(s => ({ id: s.id, name: s.name, billingCycle: s.billingCycle, amount: s.amount, renewalDate: s.renewalDate }));
        const userPayments = payments.filter(p => p.subscription && subs.some(s => s.id === p.subscription.id));
        const totalPaid = userPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const nextRenewal = subs
            .map(s => s.renewalDate)
            .filter(d => d)
            .map(d => new Date(d))
            .sort((a,b) => a - b)[0];
        return { user: u, subscriptions: subsInfo, totalPaid, nextRenewal };
    });

    return (
        <div className="p-4">
            <h1 className="mb-4">Dashboard</h1>

            <div className="row g-3 mb-4">
                <div className="col-sm-6 col-md-3">
                    <div className="card card-highlight p-3">
                        <h6 className="text-muted">Active Subscriptions</h6>
                        <h3>{data.activeSubscriptions}</h3>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-highlight p-3">
                        <h6 className="text-muted">Monthly Cost</h6>
                        <h3>${data.totalMonthlyCost.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-highlight p-3">
                        <h6 className="text-muted">Yearly Cost</h6>
                        <h3>${data.totalYearlyCost.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-highlight p-3">
                        <h6 className="text-muted">Total Paid</h6>
                        <h3>${data.totalPaidAmount.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card card-highlight p-3">
                        <h5>Upcoming Renewals</h5>
                        <ul className="list-group list-group-flush">
                            {(data.upcomingRenewals || []).map((sub, idx) => (
                                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{sub.name}</strong>
                                        <div className="text-muted small">{sub.user ? sub.user.name : ''}</div>
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
                                                <div key={s.id}><strong>{s.name}</strong> <span className="text-muted">({s.billingCycle})</span> - ${s.amount}</div>
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