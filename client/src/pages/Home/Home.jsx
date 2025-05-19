import { useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Featured, Slide, TrustedBy } from '../../components';
import { CategoryCard, ProjectCard } from '../../components';
import { cards, projects } from '../../data';
import { testimonials } from '../../data/testimonials';
import './Home.scss';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);
  const backgroundShift = useTransform(scrollYProgress, [0, 1], [0, 50]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const stats = [
    { number: "5M+", label: "Active Freelancers" },
    { number: "12M+", label: "Completed Projects" },
    { number: "95%", label: "Client Satisfaction" },
    { number: "150+", label: "Countries Served" }
  ];

  const businessFeatures = [
    {
      icon: "./media/check.png",
      title: "Enterprise-Grade Security",
      description: "Advanced protection for your business with encrypted communications and secure payments."
    },
    {
      icon: "./media/check.png",
      title: "Dedicated Support",
      description: "24/7 priority support from our experienced team to help you succeed."
    },
    {
      icon: "./media/check.png",
      title: "Talent Matching",
      description: "AI-powered matching system to connect you with the perfect professionals."
    }
  ];

  const whyChooseUsFeatures = [
    {
      icon: "/assets/icons/shield.svg", // Updated path
      title: "100% Secure Platform",
      description: "Built with bank-level security protocols and continuous monitoring to protect your data and transactions."
    },
    {
      icon: "/assets/icons/globe.svg", // Updated path
      title: "Worldwide Reach",
      description: "Connect with talented professionals from across the globe, breaking geographical boundaries."
    },
    {
      icon: "/assets/icons/rocket.svg", // Updated path
      title: "Fast Turnaround",
      description: "Get your projects completed quickly with our efficient matching system and dedicated professionals."
    },
    {
      icon: "/assets/icons/medal.svg", // Updated path
      title: "Quality Assurance",
      description: "Every freelancer is thoroughly vetted and their work is consistently monitored for quality."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const businessVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const businessItemVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      <div className='home'>
        <motion.div 
          className="hero-section"
          style={{ 
            scale: heroScale,
            opacity: backgroundOpacity 
          }}
          initial={{ opacity: 0, backgroundColor: "#2e1065" }}
          animate={{ opacity: 1, backgroundColor: "#1e1041" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}  // Changed from y: 20 to y: -20
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.3, 
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <Featured />
          </motion.div>
          <motion.div 
            className="hero-background"
            style={{ y: parallaxY }}
            initial={{ y: -50 }}  // Added initial y position from top
            animate={{ y: 0 }}
            transition={{ duration: 1.2 }}
          />
        </motion.div>

        <motion.div 
          className="stats-bar"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-item"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <TrustedBy />

        <motion.div 
          className="features"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="container">
            <motion.div 
              className="item"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Transform Your Ideas Into Reality
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="subtitle"
              >
                Unleash the power of global talent to bring your vision to life
              </motion.p>
              <div className="benefits">
                {[
                  { title: "Expert Freelancers", desc: "Access top talent from around the world" },
                  { title: "Fast Delivery", desc: "Get your projects completed on time, every time" },
                  { title: "Secure Platform", desc: "Work with confidence using our protected payment system" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="benefit-item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * (index + 1) }}
                  >
                    <img src="./media/check.png" alt="check" />
                    <div className="benefit-content">
                      <h6>{item.title}</h6>
                      <p>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="video-wrapper"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <video 
                  className="feature-video"
                  poster='https://images.unsplash.com/photo-1505243542579-da5adfe8338f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHBlb3BsZSUyMHdvcmtpbmclMjB0b2dldGhlcnxlbnwwfDB8MHx8fDA%3D' 
                  src="./media/video3.mp4" 
                  controls
                  preload="metadata"
                  playsInline
                ></video>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="categories-section"
        >
          <Slide slidesToShow={5}>
            {cards.map((card) => (
              <CategoryCard key={card.id} data={card} />
            ))}
          </Slide>
        </motion.div>

        <motion.div 
          className="features dark"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="business-container"
            variants={businessVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="business-header"
              variants={businessItemVariants}
            >
              <h2>FIVERR BUSINESS</h2>
              <h1>A business solution designed for teams</h1>
            </motion.div>

            <div className="business-features">
              {businessFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-item"
                  variants={businessItemVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <motion.div 
                    className="icon"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    <img src={feature.icon} alt={feature.title} />
                  </motion.div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="testimonials-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="container"
            whileHover={{ scale: 1.01 }}
          >
            <motion.div 
              className="section-header"
              style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                TESTIMONIALS
              </motion.h2>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                What Our Clients Say
              </motion.h1>
            </motion.div>

            <motion.div 
              className="testimonials-grid"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              initial="hidden"
              whileInView="visible"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="testimonial-card"
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <p className="quote">{testimonial.quote}</p>
                  <div className="author">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="why-choose-us"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2>WHY CHOOSE US</h2>
              <h1>Empowering Your Success</h1>
            </motion.div>

            <motion.div 
              className="features-grid"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { 
                    staggerChildren: 0.2,
                    delayChildren: 0.3
                  }
                }
              }}
              initial="hidden"
              whileInView="visible"
            >
              {whyChooseUsFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.div 
                    className="icon"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img src={feature.icon} alt={feature.title} />
                  </motion.div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="projects-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-header">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              FEATURED PROJECTS
            </motion.h2>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore Our Success Stories
            </motion.h1>
          </div>

          <Slide 
            slidesToShow={4}
            autoplay={true}
            autoplaySpeed={3000}
            className="enhanced-carousel"
          >
            {projects.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ 
                  y: -15,
                  scale: 1.05,
                  transition: {
                    type: "spring",
                    stiffness: 300
                  }
                }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard data={card} />
              </motion.div>
            ))}
          </Slide>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Home;