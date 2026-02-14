"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef, useState, useEffect } from 'react'

export default function Input() {
    const [data, setData] = useState({
        Name: "",
        password: "",
        email: "",
        Phone: '',
        gender: '',
        city: '',
        agree: false
    });

    const [users, setUsers] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const inputRef = useRef();

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("user")) || [];
        setUsers(storedUsers);
    }, []);

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.Name || !data.email || !data.password || !data.Phone) {
            alert("All fields are required");
            return;
        }
        if (!data.gender) {
            alert("Select Gender");
            return;
        }
        if (!data.agree) {
            alert("Accept Terms");
            return;
        }

        let updatedUsers;
        if (editIndex === null) {
            updatedUsers = [...users, data];
        } else {
            updatedUsers = [...users];
            updatedUsers[editIndex] = data;
            setEditIndex(null);
        }

        localStorage.setItem("user", JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setData({ Name: "", password: "", email: "", Phone: '', gender: "", city: '', agree: false });
        setCurrentPage(1);
    }

    const handleDelete = (index) => {
        const updated = users.filter((_, i) => i !== index);
        setUsers(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setCurrentPage(1);
    }

    const handleEdit = (user, index) => {
        setData(user);
        setEditIndex(index);
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = inputRef.current.value.trim().toLowerCase();
            const storedUsers = JSON.parse(localStorage.getItem("user")) || [];

            if (!value) {
                setUsers(storedUsers);
            } else {
                const filtered = storedUsers.filter(user =>
                    user.Name.toLowerCase().includes(value)
                );
                setUsers(filtered);
            }
            setCurrentPage(1);
        }
    }

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">User Form</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="Name" placeholder="Name" value={data.Name} onChange={handleInput} className="form-control mb-2" />
                </div>
                <div>
                    <input type="email" name="email" placeholder="Email" value={data.email} onChange={handleInput} className="form-control mb-2" />
                </div>
                <div>
                    <input type="password" name="password" placeholder="Password" value={data.password} onChange={handleInput} className="form-control mb-2" />
                </div>
                <div>
                    <input type="number" name="Phone" placeholder="Phone" value={data.Phone} onChange={handleInput} className="form-control mb-2" />
                </div>
                <div className="mb-2">
                    <label><input type="radio" name="gender" value="male" onChange={handleInput} checked={data.gender === "male"} /> Male </label>
                    <label className="ms-3"><input type="radio" name="gender" value="female" onChange={handleInput} checked={data.gender === "female"} /> Female </label>
                </div>
                <div className="mb-2">
                    <select name="city" value={data.city} onChange={handleInput} className="form-control">
                        <option value="">Select City</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Surat">Surat</option>
                        <option value="Palanpur">Palanpur</option>
                    </select>
                </div>
                <div className="mb-2">
                    <label><input type="checkbox" name="agree" checked={data.agree} onChange={handleInput} /> Accept Terms</label>
                </div>
                <button className="btn btn-primary mb-3">{editIndex === null ? "Submit" : "Update"}</button>
            </form>

            <input className="form-control mb-2" placeholder="Search by name" ref={inputRef} onKeyDown={handleSearch} />

            <table className="table table-bordered text-center">
                <thead>
                    <tr className="table-light">
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length === 0 ? (
                        <tr>
                            <td colSpan="7">No Data Found</td>
                        </tr>
                    ) : currentUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{indexOfFirstUser + index + 1}</td>
                            <td>{user.Name}</td>
                            <td>{user.email}</td>
                            <td>{user.Phone}</td>
                            <td>{user.gender}</td>
                            <td>{user.city}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(user, indexOfFirstUser + index)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(indexOfFirstUser + index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {users.length > usersPerPage && (
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        </li>
                        {[...Array(totalPages)].map((_, idx) => (
                            <li key={idx} className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    )
}
