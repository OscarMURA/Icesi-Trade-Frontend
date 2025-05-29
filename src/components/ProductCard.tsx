import { Link } from 'react-router-dom';

type Props = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
};

export default function ProductCard({ id, title, price, imageUrl }: Props) {
  return (
    <Link to={`/products/${id}`} className="block border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-blue-600 font-bold">${price}</p>
      </div>
    </Link>
  );
}