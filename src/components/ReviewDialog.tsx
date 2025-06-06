import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Rating,
    Stack,
  } from '@mui/material';
import { useState } from 'react';
import { Review } from '../types/reviewTypes';
import { createReview } from '../api/salesApi';
import { getIdFromToken } from '../api/userServices';
  
interface ReviewDialogProps {
    open: boolean;
    onClose: () => void;
    productId: number;
    revieweeId: number;
    onReviewSubmitted?: () => void;
}        
  
export default function ReviewDialog({
    open,
    onClose,
    productId,
    revieweeId,
    onReviewSubmitted,
  }: ReviewDialogProps) {
    const [rating, setRating] = useState<number | null>(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
  
    const handleSubmit = async () => {
      if (!rating) return;
  
      const review: Review = {
        rating,
        comment,
        productId,
        reviewerId: getIdFromToken(),
        revieweeId,
      };
  
      try {
        setSubmitting(true);
        await createReview(review);
        if (onReviewSubmitted) onReviewSubmitted();
        onClose();
      } catch (err) {
        console.error('Error al enviar reseña', err);
      } finally {
        setSubmitting(false);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Calificar transacción</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Rating
              name="rating"
              value={rating}
              onChange={(_, value) => setRating(value)}
            />
            <TextField
              label="Comentario"
              multiline
              fullWidth
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={submitting || !rating} variant="contained">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    );
}