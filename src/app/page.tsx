'use client';

import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import Select, { MultiValue, ActionMeta, SingleValue } from 'react-select';

type Repository = {
  topics: string[];
  id: number;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
};

type OptionType = {
  label: string;
  value: string;
};

const Home = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('React UI Component');
  const [language, setLanguage] = useState<SingleValue<OptionType>>({
    value: 'TypeScript',
    label: 'TypeScript',
  });
  const [sortStars, setSortStars] = useState<SingleValue<OptionType>>({
    label: 'Stars: High to Low',
    value: 'desc',
  });
  const [selectedTopics, setSelectedTopics] = useState<MultiValue<OptionType>>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [languages] = useState([
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'Go', label: 'Go' },
    { value: 'Ruby', label: 'Ruby' },
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'C++', label: 'C++' },
    { value: 'Vue', label: 'Vue' },
  ]);
  const [defaultTopics] = useState([
    'react',
    'angular',
    'vue',
    'svelte',
    'javascript',
    'typescript',
    'nodejs',
    'frontend',
    'backend',
    'fullstack',
  ]);
  const [topics, setTopics] = useState<OptionType[]>(
    defaultTopics.map((topic) => ({ label: topic, value: topic }))
  );

  const fetchRepositories = async (
    page: number,
    query: string,
    language: SingleValue<OptionType>,
    sortStars: SingleValue<OptionType>,
    selectedTopics: MultiValue<OptionType>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const headers: { [key: string]: string } = {
        Accept: 'application/vnd.github.v3+json',
      };

      const githubToken = process.env.GITHUB_TOKEN;

      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      const searchQuery = query ? `+${query} in:name` : '';
      const languageQuery = language ? `+language:${language.value}` : '';
      const topicQuery = selectedTopics.length
        ? selectedTopics.map((topic) => `+topic:${topic.value}`).join('')
        : '';
      const sortQuery = `&sort=stars&order=${
        sortStars ? sortStars.value : 'desc'
      }`;
      const githubApiUrl = `https://api.github.com/search/repositories?q=stars:>1${searchQuery}${languageQuery}${topicQuery}${sortQuery}&per_page=15&page=${
        page + 1
      }`;

      const { data } = await axios.get(githubApiUrl, { headers });

      const newRepositories =
        page === 0 ? data.items : [...repositories, ...data.items];
      setRepositories(newRepositories);

      const repoTopics = newRepositories
        .flatMap((repo: any) => repo.topics)
        .filter(
          (topic: any, index: any, self: any) => self.indexOf(topic) === index
        );
      const combinedTopics = [
        ...new Set([...defaultTopics, ...repoTopics]),
      ].map((topic) => ({ label: topic, value: topic }));
      setTopics(combinedTopics);
    } catch (err) {
      setError('Failed to fetch repositories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRepositories(page, query, language, sortStars, selectedTopics);
    }, 300); // debounce time
    return () => clearTimeout(timeoutId);
  }, [page, query, language, sortStars, selectedTopics]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setPage(0);
  };

  const handleFilter = (selectedOption: SingleValue<OptionType>) => {
    setLanguage(selectedOption);
    setPage(0);
  };

  const handleSortStars = (selectedOption: SingleValue<OptionType>) => {
    setSortStars(selectedOption);
    setPage(0);
  };

  const handleTopicFilter = (selectedOptions: MultiValue<OptionType>) => {
    setSelectedTopics(selectedOptions);
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
      <Grid container spacing={2} marginTop={1} marginBottom={1}>
        <Grid item xs={12}>
          <Select
            placeholder='Select Language'
            options={languages}
            onChange={handleFilter}
            isClearable
            value={language}
            styles={{ menu: (base) => ({ ...base }) }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={1} marginBottom={4}>
        <Grid item xs={6}>
          <Select
            placeholder='Sort by Stars'
            options={[
              { value: 'asc', label: 'Stars: Low to High' },
              { value: 'desc', label: 'Stars: High to Low' },
            ]}
            onChange={handleSortStars}
            isClearable
            value={sortStars}
            styles={{ menu: (base) => ({ ...base }) }}
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            placeholder='Select Topics'
            isMulti
            options={topics}
            onChange={handleTopicFilter}
            isClearable
            value={selectedTopics}
            styles={{ menu: (base) => ({ ...base }) }}
          />
        </Grid>
      </Grid>
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
                height: '100%',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent style={{ flexGrow: 1 }}>
                <Typography variant='h6'>
                  {truncateDescription(repo.full_name || '', 30)}
                </Typography>
                <Typography>
                  {truncateDescription(repo.description || '', 75)}
                </Typography>
                <Typography>
                  Stars: {repo.stargazers_count} | Forks: {repo.forks_count}
                </Typography>
                <Stack
                  direction='row'
                  alignItems='flex-start'
                  flexWrap='wrap'
                  spacing={1}
                  gap={1}
                  style={{ marginTop: '10px' }}
                >
                  {repo.topics.slice(0, 5).map((topic, index) => (
                    <Chip
                      key={index}
                      label={topic}
                      color='primary'
                      size='small'
                      variant='outlined'
                      style={{ margin: '0' }}
                    />
                  ))}
                  {repo.topics.length > 5 && (
                    <Chip
                      label={`+${repo.topics.length - 5}`}
                      color='secondary'
                      size='small'
                      variant='outlined'
                      style={{ margin: '0' }}
                    />
                  )}
                </Stack>
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
