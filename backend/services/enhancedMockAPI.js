/**
 * Enhanced Mock API Service
 * Mô phỏng dữ liệu chứng khoán realistic với biến động giá theo thời gian
 * Dùng cho development/demo khi chưa có API key thật
 */

// Database cổ phiếu Việt Nam với dữ liệu thực tế
const STOCK_DATABASE = {
  'VCB': {
    ticker: 'VCB',
    name: 'Ngân hàng TMCP Ngoại thương Việt Nam',
    exchange: 'HOSE',
    industry: 'Ngân hàng',
    basePrice: 92500,
    volatility: 0.02 // 2% biến động
  },
  'VNM': {
    ticker: 'VNM',
    name: 'Công ty CP Sữa Việt Nam',
    exchange: 'HOSE',
    industry: 'Thực phẩm',
    basePrice: 78000,
    volatility: 0.015
  },
  'FPT': {
    ticker: 'FPT',
    name: 'Công ty CP FPT',
    exchange: 'HOSE',
    industry: 'Công nghệ',
    basePrice: 125000,
    volatility: 0.025
  },
  'VIC': {
    ticker: 'VIC',
    name: 'Tập đoàn Vingroup',
    exchange: 'HOSE',
    industry: 'Bất động sản',
    basePrice: 45500,
    volatility: 0.02
  },
  'HPG': {
    ticker: 'HPG',
    name: 'Công ty CP Tập đoàn Hòa Phát',
    exchange: 'HOSE',
    industry: 'Thép',
    basePrice: 28700,
    volatility: 0.03
  },
  'VHM': {
    ticker: 'VHM',
    name: 'Công ty CP Vinhomes',
    exchange: 'HOSE',
    industry: 'Bất động sản',
    basePrice: 52300,
    volatility: 0.025
  },
  'MSN': {
    ticker: 'MSN',
    name: 'Công ty CP Tập đoàn Masan',
    exchange: 'HOSE',
    industry: 'Hàng tiêu dùng',
    basePrice: 68500,
    volatility: 0.022
  },
  'TCB': {
    ticker: 'TCB',
    name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    exchange: 'HOSE',
    industry: 'Ngân hàng',
    basePrice: 48900,
    volatility: 0.018
  },
  'MWG': {
    ticker: 'MWG',
    name: 'Công ty CP Đầu tư Thế Giới Di Động',
    exchange: 'HOSE',
    industry: 'Bán lẻ',
    basePrice: 54200,
    volatility: 0.025
  },
  'GAS': {
    ticker: 'GAS',
    name: 'Tổng Công ty Khí Việt Nam',
    exchange: 'HOSE',
    industry: 'Dầu khí',
    basePrice: 89400,
    volatility: 0.02
  }
};

/**
 * Tính giá cổ phiếu hiện tại dựa trên thời gian
 * Sử dụng sine wave để mô phỏng biến động thị trường
 */
function calculateCurrentPrice(stock) {
  const now = Date.now();

  // Market hours check (9:00 - 15:00 weekdays)
  const currentTime = new Date();
  const hour = currentTime.getHours();
  const dayOfWeek = currentTime.getDay();
  const isMarketOpen = (dayOfWeek >= 1 && dayOfWeek <= 5) && (hour >= 9 && hour < 15);

  // Base price with daily trend
  const daysSinceEpoch = Math.floor(now / (1000 * 60 * 60 * 24));
  const dailyTrend = Math.sin(daysSinceEpoch / 7) * stock.volatility * stock.basePrice;

  // Intraday volatility (higher during market hours)
  const intradayFactor = isMarketOpen ? 1.5 : 0.5;
  const minutesSinceEpoch = Math.floor(now / (1000 * 60));
  const intradayVolatility = Math.sin(minutesSinceEpoch / 30) * stock.volatility * stock.basePrice * intradayFactor;

  // Random noise
  const randomNoise = (Math.random() - 0.5) * stock.volatility * stock.basePrice * 0.3;

  const currentPrice = stock.basePrice + dailyTrend + intradayVolatility + randomNoise;

  return Math.round(currentPrice / 100) * 100; // Round to nearest 100
}

/**
 * Tính các giá trị OHLC cho ngày hôm nay
 */
function calculateOHLC(currentPrice, volatility) {
  const range = currentPrice * volatility;

  return {
    open: Math.round((currentPrice + (Math.random() - 0.5) * range) / 100) * 100,
    high: Math.round((currentPrice + Math.random() * range) / 100) * 100,
    low: Math.round((currentPrice - Math.random() * range) / 100) * 100,
    close: currentPrice
  };
}

/**
 * Lấy thông tin giá cổ phiếu real-time (simulated)
 */
export async function getStockPrice(ticker) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  const stock = STOCK_DATABASE[ticker.toUpperCase()];

  if (!stock) {
    throw new Error(`Không tìm thấy mã cổ phiếu ${ticker}`);
  }

  const currentPrice = calculateCurrentPrice(stock);
  const ohlc = calculateOHLC(currentPrice, stock.volatility);

  // Calculate change from open price
  const change = currentPrice - ohlc.open;
  const changePercent = (change / ohlc.open) * 100;

  // Random volume (higher during market hours)
  const now = new Date();
  const hour = now.getHours();
  const isMarketOpen = (hour >= 9 && hour < 15);
  const baseVolume = 2000000 + Math.random() * 3000000;
  const volume = isMarketOpen ? baseVolume * 1.5 : baseVolume * 0.3;

  return {
    ticker: stock.ticker,
    name: stock.name,
    exchange: stock.exchange,
    industry: stock.industry,
    price: currentPrice,
    change: Math.round(change),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.round(volume),
    high: ohlc.high,
    low: ohlc.low,
    open: ohlc.open,
    ceiling: Math.round(ohlc.open * 1.07 / 100) * 100, // +7% limit
    floor: Math.round(ohlc.open * 0.93 / 100) * 100,   // -7% limit
    timestamp: new Date().toISOString(),
    marketStatus: isMarketOpen ? 'OPEN' : 'CLOSED'
  };
}

/**
 * Lấy lịch sử giá cổ phiếu
 */
export async function getStockHistory(ticker, days = 30) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  const stock = STOCK_DATABASE[ticker.toUpperCase()];

  if (!stock) {
    throw new Error(`Không tìm thấy mã cổ phiếu ${ticker}`);
  }

  const dates = [];
  const prices = [];
  const volumes = [];

  const now = Date.now();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    dates.push(date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    }));

    // Calculate price for that day
    const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    const trend = Math.sin(daysSinceEpoch / 7) * stock.volatility * stock.basePrice;
    const noise = (Math.random() - 0.5) * stock.volatility * stock.basePrice * 0.5;

    const price = stock.basePrice + trend + noise;
    prices.push(Math.round(price / 100) * 100);

    // Random volume
    const volume = 1500000 + Math.random() * 2500000;
    volumes.push(Math.round(volume));
  }

  return {
    dates,
    prices,
    volumes
  };
}

/**
 * Lấy danh sách cổ phiếu phổ biến
 */
export async function getPopularStocks() {
  const popularTickers = Object.keys(STOCK_DATABASE);

  const promises = popularTickers.map(ticker => getStockPrice(ticker));
  const results = await Promise.all(promises);

  return results;
}
