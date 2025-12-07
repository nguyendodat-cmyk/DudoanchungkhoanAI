export function createStockChart() {
  return `
    <section class="stock-chart" id="chart-section" style="display: none;">
      <div class="container">
        <div class="chart-header">
          <h3 id="chart-title">Biểu đồ giá</h3>
          <button id="close-chart" class="btn-close-chart">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="chart-container">
          <canvas id="stock-chart-canvas"></canvas>
        </div>
        
        <div class="chart-controls">
          <button class="period-btn active" data-period="7">7 ngày</button>
          <button class="period-btn" data-period="30">30 ngày</button>
          <button class="period-btn" data-period="90">90 ngày</button>
          <button class="period-btn" data-period="365">1 năm</button>
        </div>
      </div>
    </section>
  `
}
