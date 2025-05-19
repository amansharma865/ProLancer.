import { motion } from 'framer-motion';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { getCountryFlag } from '../../utils';
import './Review.scss';

const Review = ({ review }) => {
  const country = getCountryFlag(review?.userID?.country);

  return (
    <motion.div 
      className="review"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="review-header">
        <motion.img
          className="avatar"
          src={review.userID?.image || '/media/noavatar.png'}
          alt=""
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <div className="user-info">
          <h4>{review?.userID?.username}</h4>
          <div className="country">
            {country?.normal && (
              <motion.img
                src={country.normal}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
            <span>{review?.userID?.country}</span>
          </div>
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: index < review.star ? 1 : 0.3,
                  scale: 1 
                }}
                transition={{ delay: index * 0.1 }}
              >
                <FaStar color={index < review.star ? "#fbbf24" : "#cbd5e1"} />
              </motion.div>
            ))}
            <span>{review.star}</span>
          </div>
        </div>
      </div>
      
      <motion.p
        className="review-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {review.description}
      </motion.p>
      
      <motion.div 
        className="review-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span>Helpful?</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaThumbsUp />
          <span>Yes</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaThumbsDown />
          <span>No</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Review;