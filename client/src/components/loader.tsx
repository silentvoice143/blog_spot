import { useLoader } from "@/context/LoaderProvider";

export const Loader = () => {
  const { loading } = useLoader();
  return loading ? (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black-primary/40 z-[99999]">
      <div className="w-full h-1.5 relative bg-white/15 overflow-hidden">
        <div className="w-48 h-1.5 bg-gray-secondary1 absolute top-0 left-0 animate-loader"></div>
      </div>
    </div>
  ) : null;
};
