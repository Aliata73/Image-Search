import { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const IMG_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [ errMsg, setErrMsg] = useState('')
  
  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value){
        setErrMsg("")
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMG_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrMsg("Oops! something went wrong. Please try again later ...")
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleReset = () => {
    fetchImages()
    setPage(1)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(searchInput.current.value);
    handleReset()
  };

  const selectionInput = (selection) => {
    searchInput.current.value = selection;
    handleReset()
  };
  return (
    <div className="container">
      <h1 className="title font-bold text-3xl">Image Search</h1>
      {errMsg && <p className="error-msg">{errMsg}</p>}
      <div className="search-section">
        <form
          onSubmit={onSubmit}
          className="bg-white shadow-md rounded-md rounded mb-2"
        >
          <input
            type="search"
            className="search-input rounded shadow appearance-none border 
            focus:shadow-outline text-gray-700"
            placeholder="Type something to search ..."
            ref={searchInput}
          />
        </form>
      </div>
      <div className="filters ">
        <div onClick={() => selectionInput("anonymous")}>Anonymous</div>
        <div onClick={() => selectionInput("python")}>Python</div>
        <div onClick={() => selectionInput("code")}>Code</div>
        <div onClick={() => selectionInput("linux")}>Linux</div>
      </div>
      <div className="images">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="image"
          />
        ))}
      </div>
      <div className="flex justify-center items-center mt-8 mb-4 p-4">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="flex items-center p-2 shadow-md mr-2 bg-black text-white rounded-lg"
          >
            Previous
          </button>
        )}
        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="flex items-center p-2 shadow-md bg-black text-white rounded-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
