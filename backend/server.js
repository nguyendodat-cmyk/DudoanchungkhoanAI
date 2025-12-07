/**
 * Backend Proxy Server cho DudoanchungkhoanAI
 * Giải quyết vấn đề CORS khi gọi API TCBS từ browser
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getStockPrice, getStockHistory, getPopularStocks } from './services/tcbsAPI.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'DudoanchungkhoanAI Backend API',
    version: '1.0.0',
    endpoints: {
      stock_price: '/api/stock/:ticker',
      stock_history: '/api/stock/:ticker/history?days=30',
      popular_stocks: '/api/stocks/popular'
    }
  });
});

// API Routes

/**
 * GET /api/stock/:ticker
 * Lấy thông tin giá cổ phiếu real-time
 * Example: /api/stock/VCB
 */
app.get('/api/stock/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;

    if (!ticker) {
      return res.status(400).json({
        success: false,
        error: 'Mã cổ phiếu không được để trống'
      });
    }

    const stockData = await getStockPrice(ticker);

    res.json({
      success: true,
      data: stockData
    });
  } catch (error) {
    console.error('Error in /api/stock/:ticker:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Không thể lấy dữ liệu cổ phiếu'
    });
  }
});

/**
 * GET /api/stock/:ticker/history
 * Lấy lịch sử giá cổ phiếu
 * Query params: days (default: 30)
 * Example: /api/stock/VCB/history?days=90
 */
app.get('/api/stock/:ticker/history', async (req, res) => {
  try {
    const { ticker } = req.params;
    const days = parseInt(req.query.days) || 30;

    if (!ticker) {
      return res.status(400).json({
        success: false,
        error: 'Mã cổ phiếu không được để trống'
      });
    }

    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        error: 'Số ngày phải từ 1 đến 365'
      });
    }

    const historyData = await getStockHistory(ticker, days);

    res.json({
      success: true,
      data: historyData
    });
  } catch (error) {
    console.error('Error in /api/stock/:ticker/history:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Không thể lấy lịch sử giá'
    });
  }
});

/**
 * GET /api/stocks/popular
 * Lấy danh sách cổ phiếu phổ biến
 */
app.get('/api/stocks/popular', async (req, res) => {
  try {
    const stocks = await getPopularStocks();

    res.json({
      success: true,
      data: stocks
    });
  } catch (error) {
    console.error('Error in /api/stocks/popular:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Không thể lấy danh sách cổ phiếu'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint không tồn tại'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Lỗi server không xác định'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   - GET /api/stock/:ticker`);
  console.log(`   - GET /api/stock/:ticker/history?days=30`);
  console.log(`   - GET /api/stocks/popular`);
  console.log('='.repeat(50));
});
