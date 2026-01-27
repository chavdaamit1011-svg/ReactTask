import React, { useState, useEffect } from "react";

export default function Crud() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    number: "",
    age: ""
  });
  const [editIndex, setEditIndex] = useState(null);


  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) setUsers(JSON.parse(storedUsers));
  }, []);


  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addUser = () => {
    if (!form.name || !form.number || !form.age) return;
    setUsers([...users, form]);
    setForm({ name: "", number: "", age: "" });
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setForm(users[index]);
  };

  const updateUser = () => {
    const updatedUsers = [...users];
    updatedUsers[editIndex] = form;
    setUsers(updatedUsers);
    setEditIndex(null);
    setForm({ name: "", number: "", age: "" });
  };

  const deleteUser = (index) => {
    const newUsers = [...users];
    newUsers.splice(index, 1);
    setUsers(newUsers);
  };


  return (
    <div>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter name"
      />
      <input
        name="number"
        value={form.number}
        onChange={handleChange}
        placeholder="Enter number"
      />
      <input
        name="age"
        value={form.age}
        onChange={handleChange}
        placeholder="Enter age"
      />

      {editIndex === null ? (
        <button onClick={addUser}>Add</button>
      ) : (
        <button onClick={updateUser}>Update</button>
      )}

      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name} | {user.number} | {user.age}
            <button onClick={() => startEdit(index)}>Edit</button>
            <button onClick={() => deleteUser(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
