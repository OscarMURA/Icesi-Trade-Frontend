export type Notification = {
  id?: number;
  typeId: number;
  read: boolean;
  userId: number;
  message: string;
  createdAt: string;
};