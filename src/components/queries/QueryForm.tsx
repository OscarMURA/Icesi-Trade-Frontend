import { useState } from 'react';

interface QueryFormProps {
  onSearch: (query: string) => void;
}

export default function QueryForm({ onSearch }: QueryFormProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Búsqueda de Productos</h2>
        
        <div className="mb-4">
          <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
            Buscar productos
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ingresa palabras clave..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Buscar
        </button>
      </form>
    </div>
  );
} 