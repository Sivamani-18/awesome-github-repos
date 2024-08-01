'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';

type Repository = {
  id: number;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
};

const Home = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('React UI Component');
  const [language, setLanguage] = useState('TypeScript');
  const [error, setError] = useState<string | null>(null);
  const [languages] = useState([
    'JavaScript',
    'Python',
    'Java',
    'Go',
    'Ruby',
    'TypeScript',
    'C++',
  ]);

  const fetchRepositories = async (
    page: number,
    query: string,
    language: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/repositories', {
        params: { page, query, language },
      });
      if (page === 0) {
        setRepositories(data);
      } else {
        setRepositories((prevRepos) => [...prevRepos, ...data]);
      }
    } catch (err) {
      setError('Failed to fetch repositories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRepositories(page, query, language);
    }, 300); // debounce time
    return () => clearTimeout(timeoutId);
  }, [page, query, language]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setPage(0);
  };

  const handleFilter = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
    setPage(0);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant='h3' align='center' gutterBottom>
        Awesome GitHub Repos
      </Typography>
      <TextField
        label='Search'
        variant='outlined'
        fullWidth
        margin='normal'
        onChange={handleSearch}
        value={query}
      />
      <Select
        displayEmpty
        fullWidth
        value={language}
        onChange={handleFilter}
        variant='outlined'
        style={{ marginBottom: '20px' }}
      >
        <MenuItem value=''>
          <em>Select Language</em>
        </MenuItem>
        {languages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {lang}
          </MenuItem>
        ))}
      </Select>
      {error && (
        <Typography color='error' align='center' gutterBottom>
          {error}
        </Typography>
      )}
      <Grid container spacing={2}>
        {repositories.map((repo) => (
          <Grid item xs={12} sm={6} md={4} key={repo.id}>
            <Card
              style={{
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent style={{ flexGrow: 1 }}>
                <Typography variant='h6'>
                  {truncateDescription(repo.full_name || '', 35)}
                </Typography>
                <Typography>
                  {truncateDescription(repo.description || '', 75)}
                </Typography>
                <Typography>
                  Stars: {repo.stargazers_count} | Forks: {repo.forks_count}
                </Typography>
              </CardContent>
              <Button
                variant='contained'
                color='primary'
                href={repo.html_url}
                target='_blank'
                rel='noopener noreferrer'
                style={{ margin: '10px' }}
              >
                View Repository
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
      {loading ? (
        <CircularProgress style={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <Button
          variant='contained'
          color='primary'
          onClick={loadMore}
          style={{
            marginTop: '20px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Load More
        </Button>
      )}
    </Container>
  );
};

export default Home;
