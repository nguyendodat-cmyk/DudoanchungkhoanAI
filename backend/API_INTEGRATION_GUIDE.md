# 📡 Hướng dẫn Tích hợp API Real-time

## ⚠️ Vấn đề hiện tại với TCBS API

### Tình trạng
API TCBS Public (`apipubaws.tcbs.com.vn`) đang chặn request từ backend server với lỗi **403 Forbidden**, mặc dù đã thêm đầy đủ headers giống browser.

### Nguyên nhân
- **Anti-bot Protection**: TCBS sử dụng hệ thống chống bot (có thể là Cloudflare hoặc tương tự)
- **IP Filtering**: Server có thể bị blacklist hoặc cần whitelist IP
- **Rate Limiting**: Giới hạn số lượng request từ cùng một nguồn
- **Cookie/Session**: API yêu cầu session cookie hợp lệ từ browser

### Kết quả hiện tại
```
Error: Request failed with status code 403
```

---

## 💡 Các Giải pháp Khả thi

### Giải pháp 1: Dùng Mock Data (ĐANG SỬ DỤNG) ✅

**Mô tả:** Sử dụng dữ liệu giả lập trong `src/stockAPI.js`

**Ưu điểm:**
- ✅ Hoạt động ngay lập tức
- ✅ Không bị giới hạn API
- ✅ Tốt cho development & demo
- ✅ Không phụ thuộc vào service bên ngoài

**Nhược điểm:**
- ❌ Không có dữ liệu real-time
- ❌ Giá cổ phiếu không thực

**Cách sử dụng:**
```javascript
// src/stockAPI.js
const USE_REAL_API = false; // ← Để false
```

---

### Giải pháp 2: Puppeteer/Playwright Scraping ⚙️

**Mô tả:** Sử dụng headless browser để scrape dữ liệu

**Ưu điểm:**
- ✅ Bypass được anti-bot
- ✅ Giống như browser thật
- ✅ Có thể lấy được dữ liệu real-time

**Nhược điểm:**
- ⚠️ Tốn tài nguyên (RAM, CPU)
- ⚠️ Chậm hơn REST API
- ⚠️ Có thể bị ban nếu abuse
- ⚠️ Code phức tạp hơn

**Implementation:**
```javascript
// backend/services/puppeteerScraper.js
import puppeteer from 'puppeteer';

export async function scrapeStockPrice(ticker) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://tcbs.com.vn/stock/${ticker}`);

  const data = await page.evaluate(() => {
    // Extract data from DOM
    return {
      price: document.querySelector('.price').textContent,
      // ...
    };
  });

  await browser.close();
  return data;
}
```

**Cài đặt:**
```bash
cd backend
npm install puppeteer
```

---

### Giải pháp 3: SSI iBoard API 🔄

**Mô tả:** Chuyển sang sử dụng API của SSI iBoard

**API Endpoint:**
```
https://iboard.ssi.com.vn/dcboard/api/1.0/symbols/{ticker}
```

**Ưu điểm:**
- ✅ API công khai
- ✅ Ít bị chặn hơn TCBS
- ✅ Dữ liệu tốt

**Nhược điểm:**
- ⚠️ Có thể vẫn bị CORS
- ⚠️ Cấu trúc response khác, cần update code

**Cách thử:**
```bash
# Test SSI API
curl "https://iboard.ssi.com.vn/dcboard/api/1.0/symbols/VCB"
```

---

### Giải pháp 4: VNDirect API 💰

**Mô tả:** Sử dụng API chính thức của VNDirect

**Thông tin:**
- 🔐 Cần đăng ký tài khoản
- 🔑 Cần API key
- 💵 Có gói miễn phí giới hạn

**Link:** https://developers.vndirect.com.vn/

---

### Giải pháp 5: Vietstock API 💰

**Mô tả:** API trả phí, chất lượng cao

**Thông tin:**
- 💰 Trả phí theo tháng
- ✅ Dữ liệu chính thống
- ✅ Hỗ trợ kỹ thuật tốt
- ✅ Nhiều endpoint

**Link:** https://finance.vietstock.vn/

---

### Giải pháp 6: Proxy Rotation 🔄

**Mô tả:** Sử dụng nhiều proxy để rotate IP

**Ưu điểm:**
- ✅ Bypass IP ban
- ✅ Tăng rate limit

**Nhược điểm:**
- 💰 Phải trả phí cho proxy service
- ⚠️ Phức tạp
- ⚠️ Vẫn có thể bị ban

---

## 🎯 Khuyến nghị

### Cho Development/Demo:
→ **Dùng Mock Data** (Giải pháp 1)
- Đơn giản, nhanh
- Không cần lo về API limit
- Tốt cho presentation

### Cho Production nhỏ (< 1000 users):
→ **SSI iBoard API** (Giải pháp 3) hoặc **Puppeteer** (Giải pháp 2)
- Miễn phí
- Đủ tốt cho MVP
- Có thể upgrade sau

### Cho Production lớn (> 1000 users):
→ **VNDirect API** (Giải pháp 4) hoặc **Vietstock API** (Giải pháp 5)
- Ổn định
- Hỗ trợ kỹ thuật
- Đáng tin cậy

---

## 🔧 Hướng dẫn Chuyển đổi

### Từ Mock → SSI API

1. Cập nhật `backend/services/ssiAPI.js`:
```javascript
export async function getStockPrice(ticker) {
  const url = `https://iboard.ssi.com.vn/dcboard/api/1.0/symbols/${ticker}`;
  const response = await axios.get(url);
  return transformSSIData(response.data);
}
```

2. Update `server.js` import SSI thay vì TCBS

3. Test: `curl http://localhost:3000/api/stock/VCB`

### Từ Mock → Puppeteer

1. Cài Puppeteer:
```bash
cd backend
npm install puppeteer
```

2. Tạo `backend/services/puppeteerScraper.js`

3. Update `server.js` để dùng scraper

### Bật Real API trong Frontend

```javascript
// src/stockAPI.js
const USE_REAL_API = true; // ← Đổi thành true
const BACKEND_URL = 'http://localhost:3000';
```

---

## 📊 So sánh Các Giải pháp

| Giải pháp | Miễn phí | Độ khó | Real-time | Ổn định | Khuyến nghị |
|-----------|----------|--------|-----------|---------|-------------|
| Mock Data | ✅ | ⭐ | ❌ | ⭐⭐⭐⭐⭐ | Dev/Demo |
| Puppeteer | ✅ | ⭐⭐⭐⭐ | ✅ | ⭐⭐⭐ | MVP |
| SSI API | ✅ | ⭐⭐ | ✅ | ⭐⭐⭐⭐ | MVP |
| VNDirect | ❌ | ⭐⭐ | ✅ | ⭐⭐⭐⭐⭐ | Production |
| Vietstock | ❌ | ⭐⭐ | ✅ | ⭐⭐⭐⭐⭐ | Production |

---

## 🚀 Kế hoạch Triển khai

### Phase 1: MVP (Hiện tại)
- [x] Backend infrastructure
- [x] Mock data working
- [ ] Test với SSI API
- [ ] Hoặc implement Puppeteer

### Phase 2: Beta
- [ ] Chuyển sang real API
- [ ] Monitor usage & errors
- [ ] Optimize caching

### Phase 3: Production
- [ ] Đăng ký API chính thức (VNDirect/Vietstock)
- [ ] Setup monitoring & alerting
- [ ] Scale infrastructure

---

## 🤝 Đóng góp

Nếu bạn tìm được cách bypass TCBS API 403 hoặc có API tốt hơn, vui lòng contribute!

## 📞 Liên hệ

Mọi thắc mắc về tích hợp API, hãy tạo issue trên GitHub.
