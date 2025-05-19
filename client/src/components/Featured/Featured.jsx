import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Featured.scss';

const Featured = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = () => {
    if(search) {
      navigate(`/gigs?search=${search}`);
    }
  }

  const popularTags = ["Website Design", "WordPress", "Logo Design", "AI Services"];

  return (
    <div className='featured'>
      <div className="container">
        <div className="left">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover the perfect <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >freelance</motion.span> talent
          </motion.h1>
          
          <motion.div 
            className="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }} // Faster duration
            style={{ 
              position: 'relative',
              zIndex: 10 // Increased z-index
            }}
            whileHover={{ 
              scale: 1.01,
              transition: { duration: 0.15 } // Faster hover
            }}
          >
            <motion.div 
              className="searchInput"
              style={{ position: 'relative' }}
              whileHover={{ scale: 1 }} // Removed scale effect on input container
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }} // Faster duration
            >
              <motion.img 
                src="./media/search.png" 
                alt="search"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <input 
                type="search" 
                placeholder='What service are you looking for today?' 
                onChange={(({ target: { value } }) => setSearch(value))} 
              />
            </motion.div>
            <motion.button 
              onClick={handleSearch}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Search
            </motion.button>
          </motion.div>

          <motion.div 
            className="popular"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Trending:
            </motion.span>
            <AnimatePresence>
              {popularTags.map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div 
          className="right"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img 
            src="./media/hero.jpg" 
            alt="hero"
            className="main-image"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.3 }}
          />
          <motion.img 
            src="./media/overlay.jpg" 
            alt="overlay"
            className="overlay-image"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Featured;