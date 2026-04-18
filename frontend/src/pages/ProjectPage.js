import React, { useState, useEffect, useRef, useCallback } from 'react';
import { } from 'react-router-dom';

const ProjectPage = () => {
  

  // --- THEME STATE ---
  const [isDark] = useState(localStorage.getItem('theme') === 'dark');

  // --- GAME STATE ---
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [currentItem, setCurrentItem] = useState('📚');
  const gameCanvasRef = useRef(null);

  // --- THEME EFFECT ---
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  // --- GAME LOGIC ---
  const moveTarget = useCallback(() => {
    if (gameCanvasRef.current) {
      const items = ['📚', '💡', '🌱', '🎓', '✨'];
      // Subtracting 60 to keep the emoji inside the borders comfortably
      const canvasWidth = gameCanvasRef.current.clientWidth - 60;
      const canvasHeight = gameCanvasRef.current.clientHeight - 60;
      
      const newX = Math.max(10, Math.random() * canvasWidth);
      const newY = Math.max(10, Math.random() * canvasHeight);
      
      setTargetPos({ x: newX, y: newY });
      setCurrentItem(items[Math.floor(Math.random() * items.length)]);
    }
  }, []);

  useEffect(() => {
    const gameInterval = setInterval(moveTarget, 1500);
    return () => clearInterval(gameInterval);
  }, [moveTarget]); 

  const handleTargetClick = () => {
    setScore(prev => prev + 1);
    moveTarget();
  };

  return (
    <div className="project-page-wrapper">
      {/* Introduction */}
      <section>
        <h2>Life Beyond Dreams and Degrees</h2>
        <p>
          While my journey toward becoming a professor is important to me, life is not only
          about goals and responsibilities. It is also about the small things that make the
          journey meaningful, fun, and balanced.
        </p>
      </section>

      {/* Interest 1: Perfume Collecting */}
      <section>
        <div className="content-flex">
          <div>
            <h2>Collecting Perfumes</h2>
            <p>
              One of my personal interests is collecting perfumes. Each scent tells a story,
              captures a memory, or reflects a certain mood. For me, perfumes are not just
              fragrances—they are a form of self-expression.
            </p>
            <p>
              Just like my journey, no two scents are the same. Some are bold, some are soft,
              and some grow on you over time.
            </p>
          </div>
          <img 
            src="/images/perfumes.jpg" 
            alt="Perfume Collection" 
          />
        </div>
      </section>

      {/* Interest 2: Motorcycle Riding - Reversed layout for visual flow */}
      <section>
        <div className="content-flex" style={{ flexDirection: 'row-reverse' }}>
          <div>
            <h2>Riding a Motorcycle</h2>
            <p>
              Riding a motorcycle gives me a sense of freedom and control. It reminds me that
              even when life feels overwhelming, I still have the power to move forward,
              one road at a time.
            </p>
            <p>
              Every ride feels like a pause from the noise of the world—a moment to breathe,
              reflect, and enjoy the present.
            </p>
          </div>
          <img 
            src="/images/motor.jpg" 
            alt="Motorcycle Riding" 
          />
        </div>
      </section>

      {/* Mini-Game Section - Uses your global CSS #game-canvas ID */}
      <section>
        <h2>Help Me Collect My Tools</h2>
        <p>As a professor, I need to gather these values. Click them before they disappear!</p>
        <div 
          id="game-canvas" 
          ref={gameCanvasRef}
        >
          <div 
            id="target" 
            onClick={handleTargetClick}
            style={{
              left: `${targetPos.x}px`,
              top: `${targetPos.y}px`
            }}
          >
            {currentItem}
          </div>
          <div id="score-board">
            Score: {score}
          </div>
        </div>
      </section>

      {/* Reflection Footer Section */}
      <section style={{ textAlign: 'center', marginTop: '80px' }}>
        <h2>Why These Things Matter</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto' }}>
          These passions remind me that while dreams may change, staying true to yourself
          is what makes the journey worthwhile. They teach me patience and balance—qualities 
          essential for a future educator.
        </p>
      </section>
    </div>
  );
};

export default ProjectPage;