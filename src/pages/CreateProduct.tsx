import { useState } from "react";
//import useAuth from "../hooks/useAuth";

export default function CreateProduct() {
    // { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Disponible",
    price: "",
    location: "",
    isSold: false,
    categoryId: "",
    sellerId: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async () => {
    try {
        const response = await fetch("http://localhost:8080/g1/losbandalos/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            ...form,
            price: parseFloat(form.price),
            categoryId: parseInt(form.categoryId),
            sellerId: parseInt(form.sellerId)
        })
        });

        if (response.ok) {
        const data = await response.json();
        console.log("Producto creado:", data);
        alert("Producto publicado con éxito");
        } else {
        const errorText = await response.text();
        console.error("Error al publicar:", errorText);
        alert("Error al publicar: " + errorText);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error en la conexión con el servidor");
    }
    };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Publicar nuevo producto</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-2">
        <input name="title" placeholder="Título" onChange={handleChange} className="border p-2" />
        <textarea name="description" placeholder="Descripción" onChange={handleChange} className="border p-2" />
        <input name="price" type="number" placeholder="Precio" onChange={handleChange} className="border p-2" />
        <input name="location" placeholder="Ubicación" onChange={handleChange} className="border p-2" />
        <input name="categoryId" type="number" placeholder="ID Categoría" onChange={handleChange} className="border p-2" />
        <input name="sellerId"placeholder="ID del vendedor"onChange={handleChange}className="border p-2"/>
        <button type="submit" className="bg-blue-500 text-white p-2">Publicar</button>
      </form>
    </div>
  );
}
