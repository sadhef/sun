const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDatabase = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const batchRoutes = require('./routes/batchRoutes');
const clientRoutes = require('./routes/clientRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const roomRoutes = require('./routes/roomRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const rateCardRoutes = require('./routes/rateCardRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();

connectDatabase();

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api', limiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/batches', batchRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/rate-cards', rateCardRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/reports', reportRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
