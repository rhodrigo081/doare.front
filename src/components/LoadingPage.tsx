import { LoaderCircle } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderCircle className="animate-spin text-primary w-12 h-12" />
    </div>
  );
};

export default LoadingPage;
