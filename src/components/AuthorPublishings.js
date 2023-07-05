import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, PointElement, LineElement, LinearScale, BarElement } from 'chart.js';
import AuthorService from "../services/author.service";

// Register the required elements and scales
ChartJS.register(CategoryScale, PointElement, LineElement, LinearScale, BarElement);

const AuthorPublishings = () => {
  const [authors, setAuthors] = useState([]);
  const [bookCounts, setBookCounts] = useState([]);

  useEffect(() => {
    fetchAuthorBookCounts();
  }, []);

  const fetchAuthorBookCounts = async () => {
    try {
      const response = await AuthorService.getBooksCounts();
      console.log('Fetched author book counts:', response.data);
      const authorBookCounts = response.data;
      const authorNames = Object.keys(authorBookCounts);
      const counts = Object.values(authorBookCounts);
      setAuthors(authorNames);
      setBookCounts(counts);
    } catch (error) {
      console.error('Error fetching author book counts:', error);
    }
  };

  const data = {
    labels: authors,
    datasets: [
      {
        label: 'Number of Books',
        data: bookCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'x', // Display bars vertically
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AuthorPublishings;
