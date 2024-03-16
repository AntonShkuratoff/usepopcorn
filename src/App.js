import { useEffect, useState } from "react";
import LoadingCircle from "./LoadingCircle";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./NavBar";
import Logo from "./Logo";
import NumResults from "./NumResults";
import Search from "./Search";
import Main from "./Main";
import Box from "./Box";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import WatchedSummary from "./WatchedSummary";
import WatchedMovieList from "./WatchedMovieList";

const KEY = "f84fc31d";

export default function App() {
  const [query, setQuery] = useState("john");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);

          const responce = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!responce.ok)
            throw new Error("Something went wrong with fetching movies.");

          const payload = await responce.json();

          if (payload.Response === "False") throw new Error("Movie not found");

          setMovies(payload.Search);
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <LoadingCircle />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
