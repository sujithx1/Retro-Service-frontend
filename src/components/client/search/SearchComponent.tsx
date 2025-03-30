import { useState } from "react";
import axios from "axios";
import { JobsStateTypes } from "../../../types/admin/admintypes";

const SearchComponent = () => {
  const [searchItem, setSearchItem] = useState("");
  const [results, setResults] = useState<JobsStateTypes[]>([]);

  // Debounce function to limit API calls
  const debounce = (func: (...args: string[]) => void, delay: number) => {
    let timer: ReturnType<typeof setTimeout>; // This will work for both Node.js and browser environments
    return (...args: string[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = debounce(async (query: string) => {
    try {
      const response = await axios.get(`/api/user/services/search`, {
        params: { query },
      });

      // Ensure that response.data is an array
      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setResults([]); // Reset results if data is not an array

      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, 500); // Adjust debounce delay as needed

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchItem(value);
    handleSearch(value);
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        value={searchItem}
        placeholder="Search services..."
        onChange={onInputChange}
        className="border rounded-md p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Results */}
      <div className="mt-4">
        {Array.isArray(results) && results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="p-2 border-b">
              {result.name}
            </div>
          ))
        ) : (
          <div>No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
