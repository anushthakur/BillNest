import { useEffect, useState } from "react";
import API from "../services/api";

function Users() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "" });
    const[editId,setEditId]=useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        API.get("/users")
            .then(res => {
                console.log("fetched users:", res.data);
                const data = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.content) ? res.data.content : []);
                setUsers(data);
            })
            .catch(err => console.error(err));
    };

    const handleSubmit = ()=>{
        if(editId){
            API.put(`/users/${editId}`,form).then(fetchUsers).catch(err=>console.error(err));
        }
        else{
            API.post("/users", form).then(fetchUsers).catch(err=>console.error(err));
        }
        setForm({name:"",email:""});
        setEditId(null);
    }
    const handleEdit=(user)=>{
        setForm({name:user.name,email:user.email});
        setEditId(user.id);
    };

    const handleDelete=(id)=>{
        API.delete(`/users/${id}`).then(fetchUsers);
    };
    return (
        <div className="p-4">
            <h1 className="mb-3">Users</h1>
            <div className="card card-body mb-4">
                <div className="row g-2">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="col-md-4 d-flex">
                        <button className="btn btn-primary me-2" onClick={handleSubmit}>{editId?"Update":"Add"}</button>
                        {editId && <button className="btn btn-secondary" onClick={() => { setEditId(null); setForm({name:"",email:""}) }}>Cancel</button>}
                    </div>
                </div>
            </div>

            <div className="card card-highlight">
                <div className="card-body">
                    <h5 className="card-title">All Users</h5>
                    <table className="table table-hover mt-3">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(Array.isArray(users) ? users : []).map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>Delete</button>
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
export default Users;