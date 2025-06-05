import { useEffect, useState } from "react";
import { Product } from "../../types/productTypes";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCurrentUserSeller, setIsCurrentUserSeller] = useState(false);

  useEffect(() => {
    const fetchSeller = async () => {
      if (user && product.sellerId) {
        try {
          const BASE_BACKEND = import.meta.env.VITE_BASE_URL;
          const response = await axios.get(`${BASE_BACKEND}/api/users/${product.sellerId}`);
          const seller = response.data;
          if (seller.email === user.email) {
            setIsCurrentUserSeller(true);
          } else {
            setIsCurrentUserSeller(false);
          }
        } catch {
          setIsCurrentUserSeller(false);
        }
      }
    };
    fetchSeller();
  }, [user, product.sellerId]);

  const handleChatClick = () => {
    if (isCurrentUserSeller) return;
    navigate(`/g1/losbandalos/Icesi-Trade/chat?userId=${product.sellerId}`);
  };

  return (
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>{`$${product.price}`}</h3>
      <div style={{ display: isCurrentUserSeller ? "none" : "block" }}>
        {user && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleChatClick}
            sx={{ mt: 1 }}
          >
            Chatear con el vendedor
          </Button>
        )}
      </div>
    </div>
  );
}