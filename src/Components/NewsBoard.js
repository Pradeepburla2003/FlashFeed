import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';

export const NewsBoard = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        if (!apiKey) {
          throw new Error('API key is missing');
        }

        let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
        if (category) {
          url += `&category=${category}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.articles) {
          throw new Error('Invalid API response');
        }
        
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-center">
        Latest <span className="badge bg-danger">News</span>
      </h2>
      {articles.length > 0 ? (
        articles.map((news, index) => (
          <NewsItem
            key={index}
            title={news.title}
            description={news.description}
            src={news.urlToImage}
            url={news.url}
          />
        ))
      ) : (
        <div>No news articles available.</div>
      )}
    </div>
  );
};

export default NewsBoard;
