import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, PointElement, LineElement, LinearScale, BarElement, ArcElement } from 'chart.js';
import BookService from '../services/book.service';
import modifiedBooks from '../labels/en/Categories';

// Register the required elements and scales
ChartJS.register(CategoryScale, PointElement, LineElement, LinearScale, BarElement, ArcElement);

const BooksGenres = () => {
  const [genreData, setGenreData] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetchGenreData();
  }, []);

  const fetchGenreData = async () => {
    try {
      const response = await BookService.getBooksGenreData();
      console.log('Fetched genre data:', response.data);

      const genreCounts = response.data;
      const labels = Object.keys(genreCounts).map((category) => modifiedBooks[category] || category);
      const data = Object.values(genreCounts);

      setGenreData({ labels, data });
    } catch (error) {
      console.error('Error fetching genre data:', error);
    }
  };

  const getColorPalette = (count) => {
    // Customize the color palette as needed
    const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    if (count <= colorPalette.length) {
      return colorPalette.slice(0, count);
    } else {
      // If there are more genres than available colors, generate random colors
      const randomColors = [];
      for (let i = 0; i < count; i++) {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        randomColors.push(randomColor);
      }
      return randomColors;
    }
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'right', // Set the position to 'right'
        labels: {
          color: '#333',
        },
      },
    },
  };

  return (
    <div style={{ width: '500px', height: '300px', display: 'flex' }}>
      {genreData.labels && genreData.labels.length > 0 ? (
        <>
          <Pie
            data={{
              labels: genreData.labels,
              datasets: [
                {
                  data: genreData.data,
                  backgroundColor: getColorPalette(genreData.labels.length),
                },
              ],
            }}
            options={options}
          />
          <div style={{ marginLeft: '20px' }}>
            {genreData.labels.map((label, index) => (
              <div key={index}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    backgroundColor: getColorPalette(genreData.labels.length)[index],
                    marginRight: '5px',
                  }}
                ></span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No genre data available.</p>
      )}
    </div>
  );
};

export default BooksGenres;
