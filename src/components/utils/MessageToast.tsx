type Props = {
  message: string;
  type?: 'success' | 'error' | 'info';
};

export default function MessageToast({ message, type = 'info' }: Props) {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`fixed bottom-5 right-5 text-white px-4 py-2 rounded shadow-md ${colors[type]}`}>
      {message}
    </div>
  );
}
