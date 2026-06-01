import CustomInput from "@/components/ui-v2/CustomInput";
import { SearchIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  return (
    <div className="flex flex-col flex-1 w-full min-w-0">
      <div className="h-16 shrink-0 px-4 border-b flex items-center">
        <div className="relative max-w-3xl flex-1 mx-auto">
          <CustomInput
            placeholder="Search"
            inputClassName="pl-12"
            value={query}
            onChange={(e) => {
              const value = e.target.value;

              navigate(
                value
                  ? `/search?q=${encodeURIComponent(value)}`
                  : "/search",
                { replace: true }
              );
            }}
            iconLeft={<SearchIcon size={16} />}
            bordered
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="py-6 font-medium">
            Showing results for: {query}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;