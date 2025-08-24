interface LoadingSpinnerProps {
  color?: string;
  size?: number;
}

export default function LoadingSpinner({ color = "#2563eb", size = 48 }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-blue-500"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: color,
          borderTopColor: color,
          borderBottomColor: color
        }}
      ></div>
    </div>
  );
}
