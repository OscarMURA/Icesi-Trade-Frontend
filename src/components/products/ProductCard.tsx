import { Product } from "../../types/productTypes";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>{`$${product.price}`}</h3>
    </div>
  );
}