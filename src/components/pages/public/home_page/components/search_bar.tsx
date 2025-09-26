import { Box } from "@mui/material";
import { SearchField } from "../../../../shared/search_field";
import useDriversStore from "../../drivers_page/store";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useDriversStore();
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/app/drivers");
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        my: 3,
      }}
    >
      <SearchField
        searchPlaceholder={"Search Driver by Plate Number..."}
        searchQuery={searchQuery}
        setSearchQuery={(e) => {
          setSearchQuery(e.toUpperCase());
        }}
        handleSearchKeyDown={handleSearchKeyDown}
        handleSearch={handleSearch}
        handleClear={() => setSearchQuery("")}
      />
    </Box>
  );
};

export default SearchBar;
