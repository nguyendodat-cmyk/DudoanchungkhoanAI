import './style.css'
import { createHeader } from './components/header.js'
import { createHero } from './components/hero.js'
import { createFeatures } from './components/features.js'
import { createModels } from './components/models.js'
import { createResults } from './components/results.js'
import { createFooter } from './components/footer.js'

// Import stock components
import { createStockSearch } from './components/stockSearch.js'
import { createStockWatchlist } from './components/stockWatchlist.js'
import { createStockChart } from './components/stockChart.js'

// Import API functions
import { fetchStockPrice, fetchStockHistory, formatNumber, formatPrice } from './stockAPI.js'

// Import Chart.js
import Chart from 'chart.js/auto'

document.querySelector('#app').innerHTML = `
  ${createHeader()}
  ${createHero()}
  ${createStockSearch()}
  ${createStockWatchlist()}
  ${createStockChart()}
  ${createFeatures()}
  ${createModels()}
  ${createResults()}
  ${createFooter()}
`

// Stock watchlist state
let watchlist = [];
let currentChart = null;

// Add stock to watchlist
async function addStock(ticker) {
  ticker = ticker.toUpperCase();
  
  // Check if already in watchlist
  if (watchlist.find(s => s.ticker === ticker)) {
    alert(`${ticker} đã có trong watchlist!`);
    return;
  }
  
  // Show loading
  const addBtn = document.getElementById('add-stock-btn');
  const originalText = addBtn.innerHTML;
  addBtn.innerHTML = '<span class="loading"></span>';
  addBtn.disabled = true;
  
  try {
    const stockData = await fetchStockPrice(ticker);
    watchlist.push(stockData);
    renderWatchlist();
    
    // Clear input
    document.getElementById('stock-ticker-input').value = '';
    
  } catch (error) {
    alert(`Không tìm thấy mã ${ticker}. Vui lòng kiểm tra lại!`);
  } finally {
    addBtn.innerHTML = originalText;
    addBtn.disabled = false;
  }
}

// Render watchlist
function renderWatchlist() {
  const container = document.getElementById('watchlist-body');
  
  if (watchlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-chart-line"></i>
        <p>Chưa có cổ phiếu nào trong watchlist</p>
        <p class="hint">Thêm mã cổ phiếu ở trên để bắt đầu</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = watchlist.map(stock => {
    const changeClass = stock.change >= 0 ? 'positive' : 'negative';
    const changeIcon = stock.change >= 0 ? '▲' : '▼';
    
    return `
      <div class="stock-row">
        <div class="stock-ticker">${stock.ticker}</div>
        <div class="stock-price">${formatPrice(stock.price)}</div>
        <div class="stock-change ${changeClass}">
          ${changeIcon} ${stock.changePercent.toFixed(2)}%
        </div>
        <div class="stock-volume">${formatNumber(stock.volume)}</div>
        <div>
          <button class="btn-chart" onclick="window.showChart('${stock.ticker}')">
            <i class="fas fa-chart-line"></i> Xem
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Show chart
window.showChart = async function(ticker) {
  const chartSection = document.getElementById('chart-section');
  chartSection.style.display = 'block';
  chartSection.scrollIntoView({ behavior: 'smooth' });
  
  document.getElementById('chart-title').textContent = `Biểu đồ ${ticker} - 30 ngày`;
  
  try {
    const history = await fetchStockHistory(ticker, 30);
    renderChart(history);
  } catch (error) {
    alert('Không thể tải dữ liệu biểu đồ!');
  }
}

// Render chart
function renderChart(history) {
  const canvas = document.getElementById('stock-chart-canvas');
  const ctx = canvas.getContext('2d');
  
  // Destroy old chart if exists
  if (currentChart) {
    currentChart.destroy();
  }
  
  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: history.dates,
      datasets: [{
        label: 'Giá đóng cửa',
        data: history.prices,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return 'Giá: ' + formatPrice(context.parsed.y) + ' VNĐ';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return formatPrice(value);
            }
          }
        }
      }
    }
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
})

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header')
  if (window.scrollY > 100) {
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
})

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in')
    }
  })
}, observerOptions)

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el)
})

// Stock event listeners
window.addEventListener('DOMContentLoaded', () => {
  // Add stock button
  const addBtn = document.getElementById('add-stock-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const input = document.getElementById('stock-ticker-input');
      const ticker = input.value.trim();
      if (ticker) {
        addStock(ticker);
      }
    });
  }
  
  // Enter key to add stock
  const input = document.getElementById('stock-ticker-input');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const ticker = e.target.value.trim();
        if (ticker) {
          addStock(ticker);
        }
      }
    });
  }
  
  // Popular stock tags
  document.querySelectorAll('.stock-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      const ticker = e.target.dataset.ticker;
      addStock(ticker);
    });
  });
  
  // Close chart
  const closeChartBtn = document.getElementById('close-chart');
  if (closeChartBtn) {
    closeChartBtn.addEventListener('click', () => {
      document.getElementById('chart-section').style.display = 'none';
    });
  }
  
  // Period buttons
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      // Remove active class
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // Get period
      const period = parseInt(e.target.dataset.period);
      
      // Get current ticker from title
      const title = document.getElementById('chart-title').textContent;
      const match = title.match(/Biểu đồ (\w+)/);
      if (match) {
        const ticker = match[1];
        
        // Reload chart
        const history = await fetchStockHistory(ticker, period);
        renderChart(history);
      }
    });
  });
});
