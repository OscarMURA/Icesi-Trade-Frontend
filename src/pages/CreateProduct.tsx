import { useState, useEffect } from "react";
import { getCategories, Category } from "../api/categoryApi";
import { createProduct } from "../api/productApi"; // Asumiendo que tienes esta función
import { ProductCreateDto } from "../types/productTypes";

export default function CreateProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Omit<ProductCreateDto, 'sellerId'>>({
    title: "",
    description: "",
    status: "Disponible",
    price: 0,
    location: "",
    categoryId: 0,
  });

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => console.error("Error cargando categorías:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = await createProduct(form);
      console.log("Producto creado:", data);
      alert("Producto publicado con éxito");
      // Opcional: limpiar formulario aquí
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Error al publicar el producto");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Publicar nuevo producto</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-2"
      >
        <input name="title" placeholder="Título" onChange={handleChange} className="border p-2" />
        <textarea name="description" placeholder="Descripción" onChange={handleChange} className="border p-2" />
        <input
          name="price"
          type="number"
          placeholder="Precio"
          onChange={handleChange}
          className="border p-2"
          value={form.price}
        />
        <input name="location" placeholder="Ubicación" onChange={handleChange} className="border p-2" />
        <select
          name="categoryId"
          onChange={handleChange}
          value={form.categoryId}
          className="border p-2"
          required
        >
          <option value={0} disabled>
            Selecciona una categoría
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Publicar
        </button>
      </form>
    </div>
  );
}