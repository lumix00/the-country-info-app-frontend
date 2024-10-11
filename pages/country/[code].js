import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../index.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CountryInfo() {
  const router = useRouter();
  const { code } = router.query;

  const [countryInfo, setCountryInfo] = useState(null);
  const [populationData, setPopulationData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  useEffect(() => {
    if (code) {
      setLoading(true);
      setError(null);
      axios
        .get(`${API_URL}/country-info/${code}`)
        .then((response) => {
          setCountryInfo(response.data);
          const populationCounts = response.data.population[0].populationCounts;
          setPopulationData(populationCounts);
          setLoading(false); 
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to fetch country information. Please try again.");
          setLoading(false); 
        });
    }
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader mx-auto mb-4"></div> 
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-xl text-red-500">{error}</h1>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
            Back to Home Page
          </button>
        </Link>
      </div>
    );
  }

  const borderCountries = countryInfo.country.borders || [];
  const populationYears = populationData.map((p) => p.year);
  const populationValues = populationData.map((p) => p.value);

  const chartData = {
    labels: populationYears,
    datasets: [
      {
        label: "Population Over Time",
        data: populationValues,
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  return (
    <div className={"text-center"}>
      <h1 className={"text-5xl font-bold mb-6"}>
        {countryInfo.country.commonName}
      </h1>
      <img
        className={"mx-auto mb-4"}
        src={countryInfo.flagUrl}
        alt={`Flag of ${countryInfo.country.commonName}`}
        width={100}
      />
      <h2 className={"text-4xl font-bold mb-4"}>Border Countries</h2>
      <br />
      <ul className={"flex justify-center flex-wrap"}>
        {borderCountries.map((border) => (
          <li key={border.countryCode} className={"mx-2 mb-1"}>
            <Link href={`/country/${border.countryCode}`}>
              <div
                className={
                  "border border-gray-300 rounded-md p-2 hover:bg-gray-200 transition duration-200"
                }
              >
                {border.commonName}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <br />
      <h2 className={"text-2xl font-semibold mb-4"}>Population</h2>
      <div className={"max-w-3xl mx-auto"}>
        <Line data={chartData} />
      </div>
      <div className="mt-6">
        <Link href="/">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Home Page
          </button>
        </Link>
      </div>
    </div>
  );
}