import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosFetch } from '../../utils';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms';
import { Loader } from '../../components';
import './MyGigs.scss';
import { motion, AnimatePresence } from 'framer-motion';

const MyGigs = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ['my-gigs'],
    queryFn: async () => {
      if (!user?._id) {
        throw new Error('User not authenticated');
      }
      try {
        const { data } = await axiosFetch(`/gigs?userID=${user._id}`);
        return data;
      } catch (error) {
        console.error('Error fetching gigs:', error);
        throw error;
      }
    },
    enabled: !!user?._id, // Only run query when user ID exists
    retry: 1, // Limit retry attempts
    onError: (error) => {
      console.error('Query error:', error);
      if (error.message === 'User not authenticated') {
        navigate('/login');
      }
    }
  });

  const mutation = useMutation({
    mutationFn: (_id) =>
      axiosFetch.delete(`/gigs/${_id}`)
    ,
    onSuccess: () =>
      queryClient.invalidateQueries(['my-gigs'])
  });

  const handleGigDelete = (gig) => {
    mutation.mutate(gig._id);
    toast.success(gig.title + ' deleted successfully!');
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const headerVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const gridVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className='myGigs'
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="container">
          <motion.header 
            className="header"
            variants={headerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Manage Your Gigs
            </motion.h1>
            <motion.div 
              className="actions"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/organize')}
              >
                <motion.span
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  +
                </motion.span>
                Create New Gig
              </motion.button>
            </motion.div>
          </motion.header>

          {isLoading ? (
            <motion.div 
              className='loader'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader size={35} />
            </motion.div>
          ) : error ? (
            <motion.div 
              className="error-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <h2>Something went wrong</h2>
              <p>{error.message}</p>
              <button onClick={() => queryClient.invalidateQueries(['my-gigs'])}>
                Try Again
              </button>
            </motion.div>
          ) : !data?.length ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <h2>No gigs found</h2>
              <Link to='/organize' className='link'>
                <button className='' style={{ color: 'black' }}>Create Your First Gig</button>
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="gigs-grid"
              variants={gridVariants}
              initial="initial"
              animate="animate"
            >
              {data.map((gig) => (
                <motion.div
                  key={gig._id}
                  className="gig-card"
                  variants={cardVariants}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  layoutId={`gig-${gig._id}`}
                >
                  <motion.div 
                    className="image-container"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={gig.cover} alt={gig.title} />
                    <span className="status">
                      {gig.sales} Orders
                    </span>
                  </motion.div>
                  <motion.div 
                    className="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3>{gig.title}</h3>
                    <div className="stats">
                      <div className="stat">
                        <div className="value">
                          {gig.price.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </div>
                        <div className="label">Base Price</div>
                      </div>
                      <div className="stat">
                        <div className="value">{gig.sales}</div>
                        <div className="label">Sales</div>
                      </div>
                    </div>
                    <div className="actions">
                      <motion.button
                        className="edit"
                        whileHover={{ scale: 1.05, backgroundColor: "#4f46e5", color: "white" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => navigate(`/gig/${gig._id}`)}
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        className="delete"
                        whileHover={{ scale: 1.05, backgroundColor: "#ef4444", color: "white" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGigDelete(gig);
                        }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MyGigs;