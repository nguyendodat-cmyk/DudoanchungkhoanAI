export function createStockSearch() {
  return `
    <section class="stock-search">
      <div class="container">
        <div class="search-header">
          <h2>📊 Watchlist Chứng Khoán Việt Nam</h2>
          <p>Theo dõi giá cổ phiếu yêu thích của bạn</p>
        </div>
        
        <div class="search-box">
          <input 
            type="text" 
            id="stock-ticker-input" 
            placeholder="Nhập mã cổ phiếu (VD: VCB, VNM, FPT...)"
            autocomplete="off"
          />
          <button id="add-stock-btn" class="btn-add">
            <i class="fas fa-plus"></i> Thêm
          </button>
        </div>
        
        <div class="popular-stocks">
          <span>Phổ biến:</span>
          <button class="stock-tag" data-ticker="VCB">VCB</button>
          <button class="stock-tag" data-ticker="VNM">VNM</button>
          <button class="stock-tag" data-ticker="FPT">FPT</button>
          <button class="stock-tag" data-ticker="VIC">VIC</button>
          <button class="stock-tag" data-ticker="HPG">HPG</button>
        </div>
      </div>
    </section>
  `
}
