import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Rating, Spinner } from 'flowbite-react';

const Index = props => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByRating, setSortByRating] = useState(false);
  const [sortByReleaseDate, setSortByReleaseDate] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  
  const fetchGenres = () => {
    return fetch('/api/genres')
      .then(response => response.json())
      .then(data => {
        setGenres(data.genres);
      });
  }
  
  const fetchMovies = () => {
    setLoading(true);
  
    let url = '/api/movies';
    const params = new URLSearchParams();
  
    if (sortByRating) {
      params.append('sort_by_rating', 'true');
    }
    if (sortByReleaseDate) {
      params.append('sort_by_release_date', 'true');
    }
    if (selectedGenres.length > 0) {
      selectedGenres.forEach(genreId => params.append('genre_id', genreId));
    }
  
    if (params.toString()) {
      url += '?' + params.toString();
    }
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        setMovies(data.movies);
        setLoading(false);
      });
  }
  
  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, [sortByRating, sortByReleaseDate, selectedGenres]);
  
  return (
    <Layout>
      <Heading />
  
      <div className="flex justify-center mb-4">
        <div className="flex items-center mr-4">
          <input
            type="radio"
            id="sort_by_rating"
            name="sort_by"
            checked={sortByRating}
            onChange={() => {
              setSortByRating(true);
              setSortByReleaseDate(false);
            }}
          />
          <label htmlFor="sort_by_rating" className="ml-2">Sort by rating</label>
        </div>
  
        <div className="flex items-center mr-4">
          <input
            type="radio"
            id="sort_by_release_date"
            name="sort_by"
            checked={sortByReleaseDate}
            onChange={() => {
              setSortByReleaseDate(true);
              setSortByRating(false);
            }}
          />
          <label htmlFor="sort_by_release_date" className="ml-2">Sort by release date</label>
        </div>
  
        <div>
          <select
            multiple
            value={selectedGenres}
            onChange={event => setSelectedGenres(Array.from(event.target.selectedOptions, option => option.value))}
          >
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.value}</option>
            ))}
          </select>
        </div>
      </div>
  
      <MovieList loading={loading}>
        {movies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
    return (
        <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
          <div className="grow">
            <img
              className="object-cover w-full h-60 md:h-80"
              src={props.image}
              alt={props.title}
              loading="lazy"
            />
          </div>

          <div className="grow flex flex-col h-full p-3">
            <div className="grow mb-3 last:mb-0">
              {props.year || props.rating
                ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
                    <span>{props.year}</span>

                    {props.rating
                      ? <Rating>
                          <Rating.Star />

                          <span className="ml-0.5">
                            {props.rating}
                          </span>
                        </Rating>
                      : null
                    }
                  </div>
                : null
              }

              <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
                {props.title}
              </h3>

              <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
                {props.plot.substr(0, 80)}...
              </p>
            </div>

            {props.wikipedia_url
              ? <Button
                  color="light"
                  size="xs"
                  className="w-full"
                  onClick={() => window.open(props.wikipedia_url, '_blank')}
                >
                  More
                </Button>
              : null
            }
          </div>
        </div>
    );
};

export default Index;
