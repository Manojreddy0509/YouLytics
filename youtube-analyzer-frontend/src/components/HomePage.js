import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaYoutube, FaComments, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import CommentAnalysis from './CommentAnalysis';
import VideoSummary from './VideoSummary';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled(motion.h1)`
  text-align: center;
  font-size: 3rem;
  color: #1a237e;
  margin-bottom: 10px;
  text-shadow: 1px 1px 5px #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Subtitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: #455a64;
  margin-bottom: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const Input = styled.input`
  padding: 15px 20px;
  width: 100%;
  max-width: 600px;
  border: 2px solid #9e9e9e;
  border-radius: 10px;
  font-size: 16px;
  background-color: white;
  transition: 0.3s;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
    box-shadow: 0 0 5px rgba(63, 81, 181, 0.5);
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 10px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const OptionButton = styled.button`
  background: ${props => props.active ? '#3f51b5' : 'white'};
  color: ${props => props.active ? 'white' : '#3f51b5'};
  border: 2px solid #3f51b5;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #3f51b5;
    color: white;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(to right, #2196f3, #21cbf3);
  color: white;
  padding: 15px 25px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
  width: 200px;
  
  &:hover {
    background: linear-gradient(to right, #1976d2, #00acc1);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  text-align: center;
  margin: 20px 0;
  font-weight: bold;
  padding: 10px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 8px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3f51b5;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const VideoContainer = styled.div`
  margin: 30px auto;
  max-width: 800px;
  aspect-ratio: 16/9;
`;

const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  border: none;
`;

function HomePage() {
  const [url, setUrl] = useState('');
  const [option, setOption] = useState('comments');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const endpoint = option === 'comments' 
        ? 'http://localhost:5000/api/analyze-comments'
        : 'http://localhost:5000/api/summarize-video';
      
      const response = await axios.post(endpoint, { url });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Title
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaYoutube color="#FF0000" size={40} />
        YouTube Analyzer
      </Title>
      <Subtitle>Analyze Comments & Summarize Videos</Subtitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="Paste YouTube Video URL here..." 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required 
        />
        
        <OptionsContainer>
          <OptionButton 
            type="button"
            active={option === 'comments'}
            onClick={() => setOption('comments')}
          >
            <FaComments /> Analyze Comments
          </OptionButton>
          <OptionButton 
            type="button"
            active={option === 'summarize'}
            onClick={() => setOption('summarize')}
          >
            <FaFileAlt /> Summarize Video
          </OptionButton>
        </OptionsContainer>
        
        <SubmitButton 
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Processing...' : 'Analyze 🚀'}
        </SubmitButton>
      </Form>
      
      {loading && <LoadingSpinner />}
      
      {result?.video_id && (
        <VideoContainer>
          <IFrame 
            src={`https://www.youtube.com/embed/${result.video_id}`} 
            allowFullScreen
          />
        </VideoContainer>
      )}
      
      {result && option === 'comments' && (
        <CommentAnalysis data={result} />
      )}
      
      {result && option === 'summarize' && (
        <VideoSummary data={result} />
      )}
    </Container>
  );
}

export default HomePage;