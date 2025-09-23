import React, { useEffect, useState } from "react";
import API from "../utils/api.js";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  const fetchProps = async () => {
    try {
      const res = await API.get("/properties");
      setProperties(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProps(); }, []);

  const handleFiles = (e) => setImages(Array.from(e.target.files));

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", name);
    form.append("location", location);
    form.append("price", price);
    images.forEach((f) => form.append("images", f));
    try {
      await API.post("/properties/add", form);
      setName(""); setLocation(""); setPrice(""); setImages([]);
      fetchProps();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete property?")) return;
    try {
      await API.delete(`/properties/${id}`);
      fetchProps();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h3>Properties</h3>

      <form onSubmit={handleAdd} className="card p-3 mb-4">
        <input className="form-control mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="form-control mb-2" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
        <input className="form-control mb-2" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <input className="form-control mb-3" type="file" multiple onChange={handleFiles} />
        <button className="btn btn-success">Add Property</button>
      </form>

      <div className="row g-3">
        {properties.map(p => (
          <div className="col-sm-4" key={p._id}>
            <div className="card p-2">
              <h5>{p.name}</h5>
              <div className="text-muted">{p.location}</div>
              <div className="mt-2">₹ {p.price}</div>
              <div className="mt-2 d-flex gap-2">
                <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(p._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
