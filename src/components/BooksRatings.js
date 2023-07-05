import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, PointElement, LineElement, LinearScale, BarElement } from 'chart.js';
import BookService from '../services/book.service';

// Register the required elements and scales
ChartJS.register(CategoryScale, PointElement, LineElement, LinearScale, BarElement);

const BooksRatings = () => {
  const [bookRating, setBookRating] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetchBookRatings();
  }, []);

  const fetchBookRatings = async () => {
    try {
      const response = await BookService.getBookRatings();
      console.log('Fetched book ratings:', response.data);

      const ratings = response.data;
      const labels = Object.keys(ratings);
      const data = Object.values(ratings);

      setBookRating({ labels, data });
    } catch (error) {
      console.error('Error fetching book ratings:', error);
    }
  };

  const data = {
    labels: bookRating.labels,
    datasets: [
      {
        label: 'Ratings',
        data: bookRating.data,
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
        minRotation: 0, // Set the minimum rotation angle for x-axis labels
        maxRotation: 90, // Set the maximum rotation angle for x-axis labels
        ticks: {
          autoSkip: false, // Disable automatic skipping of labels
          maxRotation: 90, // Set the maximum rotation angle for x-axis tick labels
          minRotation: 0, // Set the minimum rotation angle for x-axis tick labels
        },
      },
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <div style={{ width: '800px', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BooksRatings;
