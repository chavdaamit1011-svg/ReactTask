import { api } from './api'
import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

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
    setData({ Title: "", AuthorName: "", Publishdate: "", Description: "" })
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
    <div className="container mt-5">

      {/* Search and Sort */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search by Title"
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div>
          <button className="btn btn-primary me-2" onClick={sortAsc}>Sort A-Z</button>
          <button className="btn btn-secondary" onClick={sortDesc}>Sort Z-A</button>
        </div>
      </div>

      <hr />

      {/* Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <h4>{editId ? "Update Blog" : "Add Blog"}</h4>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Title"
            className="form-control"
            onChange={handleinput}
            name="Title"
            value={data.Title}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Author Name"
            className="form-control"
            onChange={handleinput}
            name="AuthorName"
            value={data.AuthorName}
          />
        </div>
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            onChange={handleinput}
            name="Publishdate"
            value={data.Publishdate}
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Description"
            className="form-control"
            onChange={handleinput}
            name="Description"
            value={data.Description}
          />
        </div>
        <button className="btn btn-success" onClick={submit_data}>
          {editId ? "Update Blog" : "Add Blog"}
        </button>
      </div>

      {/* Blog List */}
      <div className="row">
        {currentPosts.map((item) => (
          <div className="col-md-6 mb-4" key={item.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{item.Title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{item.AuthorName}</h6>
                <p className="card-text"><small className="text-muted">{item.Publishdate}</small></p>
                <p className="card-text">{item.Description}</p>
                <button className="btn btn-danger me-2" onClick={() => Delete_data(item.id)}>Delete</button>
                <button className="btn btn-warning" onClick={() => edit_data(item)}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        {Array.from({ length: Math.ceil(filteredData.length / postsPerPage) }, (_, i) => (
          <button
            key={i}
            className={`btn me-2 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}