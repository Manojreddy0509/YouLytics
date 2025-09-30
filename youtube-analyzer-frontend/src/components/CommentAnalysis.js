import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSmile, FaMeh, FaFrown, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SentimentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  border-left: 8px solid ${props => {
    if (props.sentiment === 'Positive') return '#4caf50';
    if (props.sentiment === 'Neutral') return '#ff9800';
    return '#f44336';
  }};
  margin: 20px 0;
  padding: 20px 30px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const SentimentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SentimentTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Percentage = styled.span`
  font-size: 0.95rem;
  color: #555;
  margin-left: 10px;
`;

const CommentsContainer = styled(motion.div)`
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #ccc;
`;

const CommentItem = styled(motion.div)`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const CommentText = styled.div`
  font-size: 1rem;
  line-height: 1.5;
`;

const CommentMeta = styled.small`
  display: block;
  font-size: 12px;
  color: #777;
  margin-top: 5px;
`;

const NoCommentsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
`;

const SummaryStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  min-width: 150px;
  margin: 10px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #666;
`;

function CommentAnalysis({ data }) {
  const [expandedSentiment, setExpandedSentiment] = useState(null);
  
  const toggleExpand = (sentiment) => {
    if (expandedSentiment === sentiment) {
      setExpandedSentiment(null);
    } else {
      setExpandedSentiment(sentiment);
    }
  };
  
  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'Positive') return <FaSmile color="#4caf50" />;
    if (sentiment === 'Neutral') return <FaMeh color="#ff9800" />;
    return <FaFrown color="#f44336" />;
  };
  
  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Positive') return '#4caf50';
    if (sentiment === 'Neutral') return '#ff9800';
    return '#f44336';
  };
  
  return (
    <Container>
      <SummaryStats>
        {Object.entries(data.summary).map(([sentiment, stats]) => (
          <StatItem key={sentiment}>
            <StatValue color={getSentimentColor(sentiment)}>{stats.percent}%</StatValue>
            <StatLabel>{sentiment} Comments ({stats.count})</StatLabel>
          </StatItem>
        ))}
      </SummaryStats>
      
      {Object.entries(data.comments).map(([sentiment, comments]) => (
        <SentimentCard 
          key={sentiment}
          sentiment={sentiment}
          onClick={() => toggleExpand(sentiment)}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <SentimentHeader>
            <SentimentTitle>
              {getSentimentIcon(sentiment)} {sentiment} Comments — {comments.length} 
              <Percentage>({data.summary[sentiment].percent}%)</Percentage>
            </SentimentTitle>
            {expandedSentiment === sentiment ? <FaChevronUp /> : <FaChevronDown />}
          </SentimentHeader>
          
          <AnimatePresence>
            {expandedSentiment === sentiment && (
              <CommentsContainer
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <CommentItem 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CommentText>{comment.comment}</CommentText>
                      <CommentMeta>Confidence: {comment.confidence}%</CommentMeta>
                    </CommentItem>
                  ))
                ) : (
                  <NoCommentsMessage>No {sentiment.toLowerCase()} comments found</NoCommentsMessage>
                )}
              </CommentsContainer>
            )}
          </AnimatePresence>
        </SentimentCard>
      ))}
    </Container>
  );
}

export default CommentAnalysis;