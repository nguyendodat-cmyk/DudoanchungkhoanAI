export function createStockWatchlist() {
  return `
    <section class="stock-watchlist">
      <div class="container">
        <div id="watchlist-container">
          <div class="watchlist-header">
            <div class="col-ticker">Mã CP</div>
            <div class="col-price">Giá</div>
            <div class="col-change">Thay đổi</div>
            <div class="col-volume">Khối lượng</div>
            <div class="col-action">Biểu đồ</div>
          </div>
          
          <div id="watchlist-body">
            <div class="empty-state">
              <i class="fas fa-chart-line"></i>
              <p>Chưa có cổ phiếu nào trong watchlist</p>
              <p class="hint">Thêm mã cổ phiếu ở trên để bắt đầu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}
