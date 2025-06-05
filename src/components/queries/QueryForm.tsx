
interface QueryFormProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function QueryForm({ onSearch, searchQuery, setSearchQuery }: QueryFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        id="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded-2xl px-6 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition text-lg placeholder-gray-400"
        placeholder="Buscar productos..."
        autoComplete="off"
      />
    </form>
  );
} 