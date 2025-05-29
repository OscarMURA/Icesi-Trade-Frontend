type Props = {
  fullScreen?: boolean;
};

export default function LoadingSpinner({ fullScreen = false }: Props) {
  const style = fullScreen
    ? 'flex items-center justify-center w-screen h-screen'
    : 'flex items-center justify-center p-6';

  return (
    <div className={style}>
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
