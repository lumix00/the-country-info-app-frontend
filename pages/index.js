import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './index.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);

  useEffect(() => {
    
    const calculateItemsPerPage = () => {
      const itemHeight = 120; 
      const headerHeight = 100; 
      const availableHeight = window.innerHeight - headerHeight; 
      const numberOfItems = Math.floor(availableHeight / itemHeight);
      setItemsPerPage(numberOfItems);
    };

    
    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);

    return () => {
      window.removeEventListener('resize', calculateItemsPerPage);
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/AvailableCountries`)
      .then((response) => {
        setCountries(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

 
  const indexOfLastCountry = currentPage * itemsPerPage;
  const indexOfFirstCountry = indexOfLastCountry - itemsPerPage;
  const currentCountries = countries.slice(indexOfFirstCountry, indexOfLastCountry);


  const nextPage = () => {
    if (indexOfLastCountry < countries.length) {
      setCurrentPage(currentPage + 1);
    }
  };

 
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={'text-center'}>
      <br />
      <h1 className={'text-5xl font-bold mb-6'}>Available Countries</h1>
      <ul className={'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'}>
        {currentCountries.map((country) => (
          <li key={country.countryCode} className={'text-lg'}>
            <Link href={`/country/${country.countryCode}`}>
              <div className={'border border-gray-300 rounded-md p-4 h-full w-full flex items-center justify-center hover:bg-gray-200 transition duration-200'}>
                {country.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        {currentPage > 1 && ( 
          <button
            onClick={prevPage}
            className={'mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200'}
          >
            Previous Page
          </button>
        )}
        {indexOfLastCountry < countries.length && ( 
          <button
            onClick={nextPage}
            className={'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200'}
          >
            Next Page
          </button>
        )}
      </div>
    </div>
  );
}