import { useState, useEffect } from "react";
import { getCategories} from "../api/categoryApi";
import { Category } from "../types/categoryTypes";
import { createProduct } from "../api/productApi"; 
import { ProductCreateDto } from "../types/productTypes";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';

export default function CreateProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Omit<ProductCreateDto, 'sellerId'>>({
    title: "",
    description: "",
    status: "Nuevo",
    price: 0,
    location: "",
    categoryId: 0, // categoryId es un número
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError("Error cargando categorías"));
  }, []);

  // Función para manejar el cambio de los valores del formulario
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await createProduct(form);
      console.log("Producto creado:", data);
      alert("Producto publicado con éxito");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error al publicar el producto");
      console.error("Error al publicar:", error);
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
        className="flex flex-col gap-4"
      >
        <TextField
          label="Título"
          name="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          fullWidth
          variant="outlined"
          required
        />
        <TextField
          label="Descripción"
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          required
        />
        <TextField
          label="Precio"
          name="price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          fullWidth
          variant="outlined"
          required
        />
        <TextField
          label="Ubicación"
          name="location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          fullWidth
          variant="outlined"
          required
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Estado</InputLabel>
          <Select
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            required
            label="Estado"
          >
            <MenuItem value="Nuevo">Nuevo</MenuItem>
            <MenuItem value="Usado">Usado</MenuItem>
            <MenuItem value="Seminuevo">Seminuevo</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Selecciona una categoría</InputLabel>
          <Select
            name="categoryId"
            value={form.categoryId} // El valor de categoryId sigue siendo un número
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} // Solo actualizamos el categoryId
            required
          >
            <MenuItem value={0} disabled>Selecciona una categoría</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem> // Valor numérico para categoryId
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="secondary" /> : "Publicar"}
        </Button>

        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
}
