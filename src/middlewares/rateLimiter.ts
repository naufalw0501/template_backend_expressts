import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: {
    status: 429,
    message: 'Too Many Login, Please Try Again 15 Minutes Again !'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginLimiter;