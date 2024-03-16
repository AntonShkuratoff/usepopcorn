import { useEffect, useState } from "react";
import LoadingCircle from "./LoadingCircle";
import StarRating from "./StarRating";

const KEY = "f84fc31d";

export default function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      try {
        async function getMovieDetails() {
          setIsLoading(true);
          const responce = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );

          if (!responce.ok)
            throw new Error("Something went wrong with fetching movie data.");

          const payload = await responce.json();

          console.log(payload);

          if (payload.Response === "False") throw new Error("Movie not found");
          setMovie(payload);
        }
        getMovieDetails();
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} />
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}