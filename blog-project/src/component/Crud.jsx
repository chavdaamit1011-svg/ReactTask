import { api } from './api'
import React, { useEffect, useState } from 'react'

export default function Crud() {

  const [data, setData] = useState({
    Title: "",
    AuthorName: "",
    Publishdate: "",
    Description: ""
  })

  const [displaydata, setDisplaydata] = useState([])
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 1;

  const handleinput = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const submit_data = async (e) => {
    e.preventDefault()

    if (editId) {

      await api.put(`/blog/${editId}`, data)
      alert("Blog Updated Successfully")
      setEditId(null)
    } else {

      await api.post("/blog", data)
      alert("Blog Added Successfully")
    }

    showdata()

    setData({
      Title: "",
      AuthorName: "",
      Publishdate: "",
      Description: ""
    })
  }

  const showdata = async () => {
    const res = await api.get("/blog")
    setDisplaydata(res.data)
  }

  useEffect(() => {
    showdata()
  }, [])

  const Delete_data = async (id) => {
    await api.delete(`/blog/${id}`)
    showdata()
  }

  const edit_data = (item) => {
    setData({
      Title: item.Title,
      AuthorName: item.AuthorName,
      Publishdate: item.Publishdate,
      Description: item.Description,
    });
    setEditId(item.id);
  }

  const filteredData = displaydata.filter((item) =>
    item.Title.toLowerCase().includes(search.toLowerCase())
  );


  const sortAsc = () => {
    const sorted = [...displaydata].sort((a, b) => {
      if (a.Title.toLowerCase() < b.Title.toLowerCase()) return -1;
      if (a.Title.toLowerCase() > b.Title.toLowerCase()) return 1;
      return 0;
    });
    setDisplaydata(sorted);
  };

  const sortDesc = () => {
    const sorted = [...displaydata].sort((a, b) => {
      if (a.Title.toLowerCase() < b.Title.toLowerCase()) return 1;
      if (a.Title.toLowerCase() > b.Title.toLowerCase()) return -1;
      return 0;
    });
    setDisplaydata(sorted);
  };


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by Title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <br /><br />

      <button onClick={sortAsc}>Sort A-Z</button>
      <button onClick={sortDesc}>Sort Z-A</button>

      <hr />

      <input
        type="text"
        placeholder="Title"
        onChange={handleinput}
        name="Title"
        value={data.Title}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Author Name"
        onChange={handleinput}
        name="AuthorName"
        value={data.AuthorName}
      />
      <br /><br />

      <input
        type="date"
        onChange={handleinput}
        name="Publishdate"
        value={data.Publishdate}
      />
      <br /><br />

      <textarea
        placeholder="Description"
        onChange={handleinput}
        name="Description"
        value={data.Description}
      />
      <br /><br />

      <button onClick={submit_data}>{editId ? "Update Blog" : "Add Blog"}</button>

      <hr />

      {currentPosts.map((item) => (
        <div key={item.id}>
          <h1>{item.Title}</h1>
          <h2>{item.AuthorName}</h2>
          <h3>{item.Publishdate}</h3>
          <p>{item.Description}</p>

          <button onClick={() => Delete_data(item.id)}>Delete</button>
          <button onClick={() => edit_data(item)}>Edit</button>
        </div>
      ))}

      <hr />


      <div>
        {Array.from({ length: Math.ceil(filteredData.length / postsPerPage) }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}