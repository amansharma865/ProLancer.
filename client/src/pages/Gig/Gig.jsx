import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { axiosFetch, getCountryFlag } from '../../utils';
import { Link, useParams } from 'react-router-dom';
import { Loader, NextArrow, PrevArrow, Reviews } from '../../components';
import './Gig.scss';

import { CarouselProvider, Slider, Slide, ImageWithZoom, ButtonBack, ButtonNext, Image } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { FiClock, FiRefreshCw, FiCheck, FiFlag } from 'react-icons/fi';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const Gig = () => {
  const { _id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { isLoading, error, data } = useQuery({
    queryKey: ['gig'],
    queryFn: () =>
      axiosFetch.get(`/gigs/single/${_id}`)
        .then(({ data }) => {
          data.images.unshift(data.cover);
          return data;
        })
        .catch(({ response }) => {
          toast.error(response.data.message);
        })
  });

  const country = getCountryFlag(data?.userID.country);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      className="gig"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {isLoading ? (
        <motion.div 
          className="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader />
        </motion.div>
      ) : error ? (
        <motion.div className="error">Something went wrong!</motion.div>
      ) : (
        <div className="container">
          <motion.div 
            className="left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gig-header">
              <motion.span 
                className="category"
                whileHover={{ scale: 1.05 }}
              >
                {data.category}
              </motion.span>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {data.title}
              </motion.h1>
              
              <motion.div className="user-profile">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  className="avatar"
                  src={data?.userID?.image || '/media/noavatar.png'}
                  alt=""
                />
                <div className="user-info">
                  <h3>{data?.userID.username}</h3>
                  {!isNaN(data.totalStars / data.starNumber) && (
                    <div className="rating">
                      {Array(Math.round(data.totalStars / data.starNumber))
                        .fill()
                        .map((_, i) => (
                          <motion.img 
                            key={i} 
                            src="/media/star.png"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          />
                        ))}
                      <span>{(data.totalStars / data.starNumber).toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="gallery-section">
              <CarouselProvider
                naturalSlideWidth={16}
                naturalSlideHeight={9}
                totalSlides={data?.images.length}
                infinite
                className='slider'
              >
                <Slider>
                  {data.images.map((img, index) => (
                    <Slide key={index}>
                      <Image src={img} alt={`Slide ${index + 1}`} hasMasterSpinner={true} />
                    </Slide>
                  ))}
                </Slider>
                <ButtonBack>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </ButtonBack>
                <ButtonNext>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </ButtonNext>
              </CarouselProvider>
            </div>

            <motion.div 
              className="gig-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2>About This Gig</h2>
              <p>{data.description}</p>
            </motion.div>

            <motion.div className="seller-profile">
              <h2>About The Seller</h2>
              <div className="seller-info">
                <motion.div 
                  className="seller-avatar"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={data?.userID?.image || '/media/noavatar.png'} alt="" />
                </motion.div>
                <div className="seller-details">
                  <h3 className="name">{data?.userID.username}</h3>
                  <div className="location">
                    <FiFlag className="icon" />
                    <span>{data?.userID.country}</span>
                    {country?.normal && (
                      <motion.img 
                        src={country.normal} 
                        alt={data?.userID.country}
                        className="country-flag"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </div>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="value">{data?.userID?.completedOrders || 0}</div>
                      <div className="label">Projects</div>
                    </div>
                    <div className="stat-item">
                      <div className="value">
                        {MONTHS[new Date(data?.userID.createdAt).getMonth()] + ' ' + 
                        new Date(data?.userID.createdAt).getFullYear()}
                      </div>
                      <div className="label">Member Since</div>
                    </div>
                    <div className="stat-item">
                      <div className="value">4 Hours</div>
                      <div className="label">Avg. Response</div>
                    </div>
                    {data?.userID?.languages?.length > 0 && (
                      <div className="stat-item">
                        <div className="value">{data.userID.languages.join(', ')}</div>
                        <div className="label">Languages</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="seller-description">{data.userID.description}</div>
            </motion.div>

            <Reviews gigID={_id} />
          </motion.div>

          <motion.div 
            className="right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div className="pricing-card">
              <div className="package-header">
                <h3 className="package-title">{data?.shortTitle}</h3>
                <div className="price-tag">
                  {data?.price.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  })}
                </div>
                <div className="delivery-info">
                  <div className="info-item">
                    <FiClock className="icon" />
                    <span>{data.deliveryTime} Days Delivery</span>
                  </div>
                  <div className="info-item">
                    <FiRefreshCw className="icon" />
                    <span>{data.revisionNumber} Revisions</span>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="features-list"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {data?.features.map((feature, index) => (
                  <motion.div 
                    key={feature} 
                    className="feature-item"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <FiCheck className="icon" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              <Link to={`/pay/${_id}`}>
                <motion.button
                  className="action-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Payment
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default Gig