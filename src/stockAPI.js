// STOCK API - Hỗ trợ cả Mock Data và Real API
// Toggle giữa Mock và Real API bằng cách thay đổi USE_REAL_API

// ⚙️ CẤU HÌNH: Đổi thành true để dùng API thật từ backend
const USE_REAL_API = false; // false = Mock Data, true = Real API
const BACKEND_URL = 'http://localhost:3000'; // URL của backend server

// ==================== REAL API FUNCTIONS ====================

async function fetchStockPriceReal(ticker) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stock/${ticker.toUpperCase()}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Không thể lấy dữ liệu cổ phiếu');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching real stock price:', error);
    throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
  }
}

async function fetchStockHistoryReal(ticker, days = 30) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stock/${ticker.toUpperCase()}/history?days=${days}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Không thể lấy lịch sử giá');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching real stock history:', error);
    throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
  }
}

// ==================== MOCK DATA FUNCTIONS ====================

async function fetchStockPriceMock(ticker) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Database của cổ phiếu giả
  const mockStocks = {
    'VCB': {
      ticker: 'VCB',
      name: 'Vietcombank',
      price: 92500,
      change: 1500,
      changePercent: 1.65,
      volume: 2547800,
      high: 93000,
      low: 91000,
      open: 91500
    },
    'VNM': {
      ticker: 'VNM',
      name: 'Vinamilk',
      price: 78000,
      change: -250,
      changePercent: -0.32,
      volume: 1823400,
      high: 78500,
      low: 77500,
      open: 78200
    },
    'FPT': {
      ticker: 'FPT',
      name: 'FPT Corporation',
      price: 125000,
      change: 2600,
      changePercent: 2.12,
      volume: 3245600,
      high: 126000,
      low: 123000,
      open: 123500
    },
    'VIC': {
      ticker: 'VIC',
      name: 'Vingroup',
      price: 45500,
      change: -300,
      changePercent: -0.65,
      volume: 4123700,
      high: 46000,
      low: 45200,
      open: 45800
    },
    'HPG': {
      ticker: 'HPG',
      name: 'Hòa Phát Group',
      price: 28700,
      change: 400,
      changePercent: 1.41,
      volume: 8534200,
      high: 29000,
      low: 28400,
      open: 28500
    },
    'VHM': {
      ticker: 'VHM',
      name: 'Vinhomes',
      price: 52300,
      change: 800,
      changePercent: 1.55,
      volume: 3654900,
      high: 53000,
      low: 51800,
      open: 52000
    },
    'MSN': {
      ticker: 'MSN',
      name: 'Masan Group',
      price: 68500,
      change: -1200,
      changePercent: -1.72,
      volume: 2187300,
      high: 69800,
      low: 68000,
      open: 69500
    },
    'TCB': {
      ticker: 'TCB',
      name: 'Techcombank',
      price: 48900,
      change: 900,
      changePercent: 1.87,
      volume: 4567800,
      high: 49200,
      low: 48200,
      open: 48400
    },
    'MWG': {
      ticker: 'MWG',
      name: 'Mobile World',
      price: 54200,
      change: -600,
      changePercent: -1.09,
      volume: 2876500,
      high: 55000,
      low: 53800,
      open: 54700
    },
    'GAS': {
      ticker: 'GAS',
      name: 'PV Gas',
      price: 89400,
      change: 1100,
      changePercent: 1.25,
      volume: 1234500,
      high: 90000,
      low: 88500,
      open: 88800
    }
  };
  
  const stock = mockStocks[ticker.toUpperCase()];
  
  if (!stock) {
    throw new Error('Không tìm thấy mã cổ phiếu');
  }
  
  // Random small change to make it look real-time
  const randomChange = (Math.random() - 0.5) * 200;
  stock.price = Math.round(stock.price + randomChange);
  
  return stock;
}

async function fetchStockHistoryMock(ticker, days = 30) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockDates = [];
  const mockPrices = [];
  
  // Base prices for different stocks
  const basePrices = {
    'VCB': 90000,
    'VNM': 78000,
    'FPT': 120000,
    'VIC': 45000,
    'HPG': 28000,
    'VHM': 52000,
    'MSN': 68000,
    'TCB': 48000,
    'MWG': 54000,
    'GAS': 88000
  };
  
  const basePrice = basePrices[ticker.toUpperCase()] || 50000;
  
  // Generate price history with trend
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    mockDates.push(date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit' 
    }));
    
    // Create realistic price movement
    const trend = (days - i) * 50; // Slight upward trend
    const randomChange = (Math.random() - 0.5) * 3000;
    const dailyChange = Math.sin(i / 3) * 1500; // Wave pattern
    
    const price = basePrice + trend + randomChange + dailyChange;
    mockPrices.push(Math.round(price));
  }
  
  return {
    dates: mockDates,
    prices: mockPrices,
    volumes: Array(days).fill(2000000)
  };
}

// ==================== EXPORTED FUNCTIONS ====================
// Tự động chuyển đổi giữa Mock và Real API dựa vào USE_REAL_API

export async function fetchStockPrice(ticker) {
  if (USE_REAL_API) {
    console.log('📡 Fetching REAL data from backend for:', ticker);
    return fetchStockPriceReal(ticker);
  } else {
    console.log('🎭 Using MOCK data for:', ticker);
    return fetchStockPriceMock(ticker);
  }
}

export async function fetchStockHistory(ticker, days = 30) {
  if (USE_REAL_API) {
    console.log('📡 Fetching REAL history from backend for:', ticker);
    return fetchStockHistoryReal(ticker, days);
  } else {
    console.log('🎭 Using MOCK history for:', ticker);
    return fetchStockHistoryMock(ticker, days);
  }
}

// ==================== UTILITY FUNCTIONS ====================

export function formatNumber(num) {
  if (!num) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString('vi-VN');
}

export function formatPrice(price) {
  if (!price) return '0';
  return new Intl.NumberFormat('vi-VN').format(Math.round(price));
}
