/**
 * TCBS API Service
 * Kết nối với API TCBS để lấy dữ liệu cổ phiếu Việt Nam
 * API Documentation: https://apipubaws.tcbs.com.vn
 */

import axios from 'axios';

const TCBS_BASE_URL = 'https://apipubaws.tcbs.com.vn';

/**
 * Lấy thông tin giá cổ phiếu real-time
 * @param {string} ticker - Mã cổ phiếu (VD: VCB, VNM, FPT)
 * @returns {Promise<Object>} Thông tin cổ phiếu
 */
export async function getStockPrice(ticker) {
  try {
    const url = `${TCBS_BASE_URL}/stock-insight/v1/stock/sec-price-info`;

    const response = await axios.get(url, {
      params: {
        secCd: ticker.toUpperCase()
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://tcbs.com.vn/',
        'Origin': 'https://tcbs.com.vn',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      },
      timeout: 10000 // 10 seconds timeout
    });

    const data = response.data;

    // Transform data to match our frontend format
    return {
      ticker: ticker.toUpperCase(),
      name: data.name || ticker,
      price: data.lastPrice || 0,
      change: data.priceChange || 0,
      changePercent: data.percentPriceChange || 0,
      volume: data.totalVolume || 0,
      high: data.highPrice || 0,
      low: data.lowPrice || 0,
      open: data.openPrice || 0,
      ceiling: data.ceilingPrice || 0,
      floor: data.floorPrice || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching stock price for ${ticker}:`, error.message);
    throw new Error(`Không thể lấy dữ liệu cho mã ${ticker}`);
  }
}

/**
 * Lấy lịch sử giá cổ phiếu
 * @param {string} ticker - Mã cổ phiếu
 * @param {number} days - Số ngày lịch sử (mặc định 30)
 * @returns {Promise<Object>} Lịch sử giá {dates: [], prices: [], volumes: []}
 */
export async function getStockHistory(ticker, days = 30) {
  try {
    // Calculate timestamps
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const toTimestamp = Math.floor(toDate.getTime() / 1000);
    const fromTimestamp = Math.floor(fromDate.getTime() / 1000);

    const url = `${TCBS_BASE_URL}/stock-insight/v1/stock/bars-long-term`;

    const response = await axios.get(url, {
      params: {
        ticker: ticker.toUpperCase(),
        type: 'stock',
        resolution: 'D', // Daily data
        from: fromTimestamp,
        to: toTimestamp
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://tcbs.com.vn/',
        'Origin': 'https://tcbs.com.vn',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      },
      timeout: 10000
    });

    const data = response.data;

    // Transform data
    const dates = [];
    const prices = [];
    const volumes = [];

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach(item => {
        // Format date
        const date = new Date(item.tradingDate);
        dates.push(date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit'
        }));

        prices.push(item.close || 0);
        volumes.push(item.volume || 0);
      });
    }

    return {
      dates,
      prices,
      volumes
    };
  } catch (error) {
    console.error(`Error fetching stock history for ${ticker}:`, error.message);
    throw new Error(`Không thể lấy lịch sử giá cho mã ${ticker}`);
  }
}

/**
 * Lấy danh sách cổ phiếu phổ biến
 * @returns {Promise<Array>} Danh sách cổ phiếu
 */
export async function getPopularStocks() {
  const popularTickers = ['VCB', 'VNM', 'FPT', 'VIC', 'HPG', 'VHM', 'MSN', 'TCB', 'MWG', 'GAS'];

  try {
    const promises = popularTickers.map(ticker => getStockPrice(ticker));
    const results = await Promise.allSettled(promises);

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
  } catch (error) {
    console.error('Error fetching popular stocks:', error.message);
    return [];
  }
}
