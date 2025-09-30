import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight, FaTag } from 'react-icons/fa';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SummaryCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const SummaryHeading = styled.h3`
  font-size: 1.8rem;
  color: #1a237e;
  margin-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #37474f;
  position: relative;
  padding: 0 20px;
`;

const QuoteIconLeft = styled(FaQuoteLeft)`
  color: #e0e0e0;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1rem;
`;

const QuoteIconRight = styled(FaQuoteRight)`
  color: #e0e0e0;
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 1rem;
`;

const KeywordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
`;

const Keyword = styled.span`
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function VideoSummary({ data }) {
  const { summary_sections } = data;
  
  return (
    <Container>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        {summary_sections.map((section, index) => (
          <SummaryCard
            key={index}
            variants={item}
          >
            <SummaryHeading>{section.heading}</SummaryHeading>
            <SummaryText>
              <QuoteIconLeft />
              {section.summary}
              <QuoteIconRight />
            </SummaryText>
            
            {section.keywords && section.keywords.length > 0 && (
              <KeywordContainer>
                {section.keywords.map((keyword, idx) => (
                  <Keyword key={idx}>
                    <FaTag size={12} /> {keyword}
                  </Keyword>
                ))}
              </KeywordContainer>
            )}
          </SummaryCard>
        ))}
      </motion.div>
    </Container>
  );
}

export default VideoSummary;