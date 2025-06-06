export type Review ={
    id?: number;
    rating: number;
    comment: string;
    productId: number;
    reviewerId: number;
    revieweeId: number;
    createdAt?: string;
  }