import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Feed from "../components/Feed";
import LoadingScreen from "../components/LoadingScreen";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offSet, setOffSet] = useState(() => {
    const storedOffSet = sessionStorage.getItem("offset");
    return storedOffSet ? parseInt(storedOffSet, 10) : 0;
  });
  const [loading, setLoading] = useState(true);

  function handleNextPage() {
    const newOffSet = offSet + 50;
    setOffSet(newOffSet);
    sessionStorage.setItem("offset", newOffSet.toString());
  }

  function handlePreviousPage() {
    // const newOffSet = offSet <= 50 ? 0 : offSet - 50;
    const newOffSet = Math.max(0, offSet - 50); 
    setOffSet(newOffSet);
    sessionStorage.setItem("offset", newOffSet.toString());
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchPokemon() {
      setLoading(true);
      
      try {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offSet}`;
        
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        
        if(isMounted){
          setPokemons(data.results);
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } 
      catch (error) {
        console.error("Failed to fetch pokemons:", error);
        if (isMounted) {
          setLoading(false);
        }
      }

    }
    fetchPokemon();

    // cleanup
    return () => {
      isMounted = false;
    };
  }, [offSet]);
    
  return (
    <div className="Home maxWidth">
      {loading && <LoadingScreen />}
      {!loading && (
        <>
          <Header />
          <Feed pokemons={pokemons} />
          <div className="pagination">
            <button onClick={handlePreviousPage} className="btn">
              Previous
            </button>
            <button onClick={handleNextPage} className="btn">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;