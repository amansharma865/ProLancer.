import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CategoryCard.scss';

const Card = ({ data }) => {
  return (
    <Link to={`/gigs?category=${data.slug}`}>
      <motion.div 
        className='cardContainer'
        initial={{ y: 0 }}
        whileHover={{ 
          y: -10,
          zIndex: 2,
          transition: { 
            duration: 0.3,
            ease: "easeOut"
          }
        }}
      >
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
        <motion.img 
          src={data.img} 
          alt={data.title}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span 
          className='desc'
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {data.desc}
        </motion.span>
        <motion.span 
          className='title'
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {data.title}
        </motion.span>
      </motion.div>
    </Link>
  )
}

export default Card;