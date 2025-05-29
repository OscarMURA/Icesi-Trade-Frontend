import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();

  return <h1 className="text-2xl">Detalles del producto #{id}</h1>;
}
