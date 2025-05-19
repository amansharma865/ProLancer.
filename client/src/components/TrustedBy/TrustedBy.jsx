import { motion } from 'framer-motion';
import './TrustedBy.scss';

const TrustedBy = () => {
  const images = [
    {
      name: "meta",
      url: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/meta.12b5e5c.png"
    },
    {
      name: "google",
      url: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/google.61e78c8.png"
    },
    {
      name: "netflix",
      url: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/netflix.96c5e3f.png"
    },
    {
      name: "p&g",
      url: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/pandg.0f4cfc2.png"
    },
    {
      name: "paypal",
      url: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/paypal.305e264.png"
    }
  ];

  return (
    <motion.div 
      className='trustedBy'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Trusted by:
        </motion.span>
        {images.map((img, index) => (
          <motion.img
            key={img.name}
            src={img.url}
            alt={img.name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 * (index + 1) }}
            whileHover={{ scale: 1.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TrustedBy;