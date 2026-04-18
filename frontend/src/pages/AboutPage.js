
import React, { useState, useEffect } from 'react';
import {  } from 'react-router-dom';

const AboutPage = () => {
  

  // --- THEME STATE ---
  // We initialize from localStorage so the theme persists when navigating
  const [isDark] = useState(localStorage.getItem('theme') === 'dark');

  // --- QUIZ STATE ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [resultMessage, setResultMessage] = useState({ text: '', color: '' });
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const quizData = [
    { question: "What is the name of the creator of this website?", options: ["Stephanie", "Princess", "Jenina", "Chynna"], answer: 0 },
    { question: "Stephanie was born in?", options: ["Pangasinan", "Bukidnon", "Camiguin", "La Union"], answer: 1 },
    { question: "What was her dream when she was a child?", options: ["Teacher", "Policewoman", "Doctor", "Actress"], answer: 2 },
    { question: "From Bukidnon, where did they move in?", options: ["Laguna", "Pangasinan", "Cavite", "La Union"], answer: 1 },
    { question: "What degree did she consider in High School?", options: ["BS Nursing", "BS IT", "BS Pharmacy", "BA Comm"], answer: 1 },
    { question: "What was her dream when she reached College?", options: ["Doctor", "Artist", "Lawyer", "Professor"], answer: 3 },
    { question: "When did she realize she wants to be a Professor?", options: ["College", "Elementary", "Pre-school", "High School"], answer: 0 },
    { question: "Interests outside academics?", options: ["Online Games", "Perfumes & Riding", "Reading", "Movies"], answer: 1 },
    { question: "How many perfumes does she have?", options: ["10", "3", "5", "7"], answer: 2 },
    { question: "Color of her motorcycle?", options: ["Black", "Red", "Pearl White", "Purple"], answer: 1 }
  ];

  // --- THEME EFFECT ---
  // This updates the data-theme attribute on the <html> tag for your CSS variables
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  // --- QUIZ FUNCTIONS ---
  const handleSelect = (index) => {
    if (showFeedback) return; 
    setSelectedOptionIndex(index);
  };

  const handleSubmit = () => {
    const isCorrect = selectedOptionIndex === quizData[currentQuestionIndex].answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setResultMessage({ text: 'Correct! ✨', color: 'var(--primary-color)' });
    } else {
      setResultMessage({ 
        text: `Incorrect. The answer was ${quizData[currentQuestionIndex].options[quizData[currentQuestionIndex].answer]}`, 
        color: '#d9534f' 
      });
    }
    
    setShowFeedback(true);

    // Short delay before moving to next question for user to see feedback
    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOptionIndex(null);
        setShowFeedback(false);
      } else {
        setIsQuizComplete(true);
      }
    }, 2000);
  };

  return (
    <div className="about-page-container">
      {/* Narrative Section 1 */}
      <section>
        <div className="content-flex">
          <div>
            <h2>Where My Dream Began</h2>
            <p>
              My name is Stephanie Mae Gubatan. I was born in Crossing, Libona, Bukidnon, where I spent the first six years of my life. 
              It was there—at a very young age—that my dream of becoming a doctor began.
            </p>
            <p>
              As a child, I believed that saving lives meant wearing a white coat and working in a hospital. 
              That belief stayed with me for many years as the foundation of my ambition.
            </p>
          </div>
          <img src="/images/child.jpg" alt="Stephanie as a child" />
        </div>
      </section>

      {/* Narrative Section 2 */}
      <section>
        <div className="content-flex">
          <div>
            <h2>The Rollercoaster Ride</h2>
            <p>
              When I turned seven, my family moved to Golden, Mapandan, Pangasinan. That move marked the beginning 
              of a rollercoaster ride filled with growth, challenges, and changing perspectives.
            </p>
            <p>
              During my elementary years, I was very certain about my goal. I dreamed of becoming a doctor 
              and imagined myself pursuing courses such as Nursing, Medical Technology, or Pharmacy.
            </p>
          </div>
          <img src="/images/student-life.jpg" alt="Reflecting on student life" />
        </div>
      </section>

      {/* Timeline Section */}
      <section>
        <h2>Dreams, Detours, and Discoveries</h2>
        <p>
          High school opened my eyes to a much bigger world. I discovered new interests and realized how 
          exciting the field of Information Technology could be. Still, my heart always leaned back 
          to one dream—I wanted to save lives.
        </p>

        <h3>My Journey in Stages</h3>
        <ol>
          <li>Early childhood in Bukidnon – dreaming of becoming a doctor</li>
          <li>Elementary years in Pangasinan – firm medical aspirations</li>
          <li>High school – discovering technology and wider possibilities</li>
          <li>College – facing reality, adapting, and finding new meaning</li>
          <li>Present – redefining what it means to save lives</li>
        </ol>
      </section>

      {/* Career Vision Section */}
      <section>
        <h2>Why I Choose to Become a Professor</h2>
        <p>
          As I grew older, I realized that saving lives does not only happen in hospitals. 
          It can also happen inside classrooms. Professors shape minds, guide futures, and 
          influence lives in ways that last forever.
        </p>
        <p>
          Today, my goal is clear: I want to become a professor. Through teaching, 
          mentorship, and education, I believe I can still fulfill my purpose of 
          saving lives—just in a different, meaningful way.
        </p>
      </section>

      {/* Quote Section */}
      <section>
        <blockquote>
          “Education is the most powerful weapon which you can use to change the world.”
          <br />
          <cite>— Nelson Mandela</cite>
        </blockquote>
      </section>

      {/* Interactive Quiz Section */}
      <section className="quiz-container">
        <h2>Test Your Knowledge</h2>
        <p>How well do you know my story? Take this short quiz!</p>
        
        {!isQuizComplete ? (
          <div className="quiz-card" style={{ background: 'var(--surface-color)', padding: '30px', borderRadius: '15px', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>{quizData[currentQuestionIndex].question}</h3>
            
            <div className="options-grid">
              {quizData[currentQuestionIndex].options.map((option, index) => (
                <button 
                  key={index} 
                  className={`quiz-option ${selectedOptionIndex === index ? 'active' : ''}`}
                  onClick={() => handleSelect(index)}
                  disabled={showFeedback}
                  style={{ width: '100%', marginBottom: '10px' }}
                >
                  {option}
                </button>
              ))}
            </div>

            <button 
              className="quiz-submit-btn" 
              onClick={handleSubmit}
              disabled={selectedOptionIndex === null || showFeedback}
              style={{
                marginTop: '20px',
                opacity: (selectedOptionIndex === null || showFeedback) ? 0.5 : 1
              }}
            >
              Submit Answer
            </button>

            {showFeedback && (
              <div style={{ marginTop: '20px', fontWeight: 'bold', color: resultMessage.color }}>
                {resultMessage.text}
              </div>
            )}
          </div>
        ) : (
          <div className="quiz-results" style={{ textAlign: 'center', background: 'var(--surface-color)', padding: '40px', borderRadius: '15px' }}>
            <h3>Quiz Complete!</h3>
            <p style={{ fontSize: '1.5rem' }}>You scored <strong>{score}</strong> out of {quizData.length}</p>
            <button className="quiz-submit-btn" onClick={() => window.location.reload()}>
              Restart Quiz
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AboutPage;