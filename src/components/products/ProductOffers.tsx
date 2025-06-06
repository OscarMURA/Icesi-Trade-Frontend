import { useEffect, useState } from 'react';
import { Sale } from '../../types/saleTypes';
import axios from '../../api/axiosConfig';
import { getToken } from '../../api/userServices';
import './ProductOffers.css';

interface ProductOffersProps {
  productId: number;
  onClose: () => void;
}

export default function ProductOffers({ productId, onClose }: ProductOffersProps) {
  const [offers, setOffers] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, [productId]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`/api/sales/product/${productId}/offers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setOffers(response.data);
    } catch (error) {
      console.error('Error al cargar ofertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId: number) => {
    try {
      await axios.put(`/api/sales/${offerId}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      alert('Oferta aceptada exitosamente');
      fetchOffers();
    } catch (error) {
      console.error('Error al aceptar oferta:', error);
      alert('Error al aceptar la oferta');
    }
  };

  const handleRejectOffer = async (offerId: number) => {
    try {
      await axios.put(`/api/sales/${offerId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      alert('Oferta rechazada');
      fetchOffers();
    } catch (error) {
      console.error('Error al rechazar oferta:', error);
      alert('Error al rechazar la oferta');
    }
  };

  if (loading) {
    return <div>Cargando ofertas...</div>;
  }

  return (
    <div className="offers-modal">
      <div className="offers-content">
        <button onClick={onClose} className="close-x" title="Cerrar">&#10005;</button>
        <h2>Ofertas recibidas</h2>
        
        
        {offers.length === 0 ? (
          <p>No hay ofertas pendientes</p>
        ) : (
          <div className="offers-list">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-item">
                <p>Comprador ID: {offer.buyer}</p>
                <p>Precio ofrecido: ${offer.price}</p>
                <p>Fecha: {new Date(offer.createdAt || '').toLocaleDateString()}</p>
                <div className="offer-actions">
                  <button 
                    onClick={() => handleAcceptOffer(offer.id)}
                    className="accept-button"
                  >
                    Aceptar
                  </button>
                  <button 
                    onClick={() => handleRejectOffer(offer.id)}
                    className="reject-button"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="back-button">Volver</button>
      </div>
    </div>
  );
} 