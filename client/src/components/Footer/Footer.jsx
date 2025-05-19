import { motion } from 'framer-motion';
import './Footer.scss';

const Footer = () => {
  const footerData = {
    categories: [
      "Graphics & Design",
      "Digital Marketing",
      "Writing & Translation",
      "Video & Animation",
      "Music & Audio",
      "Programming & Tech"
    ],
    about: [
      "About Us",
      "Partnerships",
      "Privacy Policy",
      "Terms of Service",
      "Intellectual Property"
    ],
    support: [
      "Help & Support",
      "Trust & Safety",
      "Selling on ProLancer",
      "Buying on ProLancer",
      "Contact Us"
    ],
    community: [
      "Community Hub",
      "Blog",
      "Forum",
      "Events",
      "Podcast"
    ]
  };

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Categories</h2>
            <motion.ul variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="visible">
              {footerData.categories.map((item, index) => (
                <motion.li 
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <div className="item">
            <h2>About</h2>
            <ul>
              {footerData.about.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="item">
            <h2>Support</h2>
            <ul>
              {footerData.support.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="item">
            <h2>Community</h2>
            <ul>
              {footerData.community.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <motion.div 
          className="bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="left">
            <h2>ProLancer</h2>
            <span>© ProLancer International Ltd. 2023</span>
          </div>
          <div className="right">
            <div className="social">
              <motion.img whileHover={{ scale: 1.2 }} src="/assets/icons/twitter.svg" alt="twitter" />
              <motion.img whileHover={{ scale: 1.2 }} src="/assets/icons/facebook.svg" alt="facebook" />
              <motion.img whileHover={{ scale: 1.2 }} src="/assets/icons/linkedin.svg" alt="linkedin" />
              <motion.img whileHover={{ scale: 1.2 }} src="/assets/icons/instagram.svg" alt="instagram" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
