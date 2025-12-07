# 🧪 Hướng dẫn Test Full Stack

## 📊 Trạng thái Hiện tại

✅ **Backend:** Enhanced Mock API đang chạy tại http://localhost:3000
✅ **Frontend:** Real API mode đã bật (gọi backend)
✅ **API Integration:** Frontend ↔ Backend đã kết nối

---

## 🚀 Cách Test Dự án

### 1. Chạy Backend Server

Mở terminal thứ nhất:

```bash
cd backend
npm start
```

Bạn sẽ thấy:
```
==================================================
🚀 Backend Server đang chạy tại http://localhost:3000
📊 API Mode: 🎭 Enhanced Mock (Simulated)
📈 API Endpoints:
   - GET /api/stock/:ticker
   - GET /api/stock/:ticker/history?days=30
   - GET /api/stocks/popular
==================================================
ℹ️  Dùng dữ liệu mô phỏng với biến động giá realistic
ℹ️  Để dùng API thật, đổi USE_MOCK_API = false trong server.js
==================================================
```

### 2. Chạy Frontend Server

Mở terminal thứ hai (giữ backend đang chạy):

```bash
# Quay lại root directory
cd ..

# Chạy frontend
npm run dev
```

Bạn sẽ thấy:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 3. Mở Browser

Truy cập: **http://localhost:5173/**

---

## 🧪 Test Scenarios

### Test 1: Thêm cổ phiếu vào Watchlist

1. Gõ mã cổ phiếu: `VCB`
2. Click **"Thêm"**
3. **Kỳ vọng:**
   - Backend log hiển thị: `[timestamp] GET /api/stock/VCB`
   - Watchlist hiển thị: VCB, Ngân hàng TMCP Ngoại thương Việt Nam
   - Giá cả, % thay đổi, khối lượng hiển thị chính xác

### Test 2: Xem biểu đồ giá

1. Click nút **"Xem"** ở cổ phiếu VCB
2. **Kỳ vọng:**
   - Backend log: `[timestamp] GET /api/stock/VCB/history?days=30`
   - Biểu đồ xuất hiện với dữ liệu 30 ngày
   - Hover vào điểm trên biểu đồ → tooltip hiển thị giá

### Test 3: Thay đổi khung thời gian

1. Click các nút: `7 ngày`, `30 ngày`, `90 ngày`, `1 năm`
2. **Kỳ vọng:**
   - Backend log hiển thị request với days khác nhau
   - Biểu đồ cập nhật theo khung thời gian

### Test 4: Thêm nhiều cổ phiếu

Test với các mã:
- `VNM` (Vinamilk)
- `FPT` (FPT Corporation)
- `VIC` (Vingroup)
- `HPG` (Hòa Phát)

**Kỳ vọng:**
- Tất cả đều thêm thành công
- Mỗi cổ phiếu có giá khác nhau
- % thay đổi có thể dương hoặc âm (màu xanh/đỏ)

### Test 5: Click Popular Tags

Click vào tags: `VCB`, `VNM`, `FPT`, etc.

**Kỳ vọng:**
- Tự động thêm vào watchlist
- Không thêm trùng lặp (hiện alert nếu đã có)

---

## 🔍 Kiểm tra Console Logs

### Frontend Console (Browser DevTools)

Mở Chrome DevTools (F12) → Console tab

Bạn sẽ thấy:
```
📡 Fetching REAL data from backend for: VCB
📡 Fetching REAL history from backend for: VCB
```

### Backend Console (Terminal)

Trong terminal chạy backend, bạn sẽ thấy:
```
[2025-12-07T10:30:45.123Z] GET /api/stock/VCB
[2025-12-07T10:30:47.456Z] GET /api/stock/VCB/history
```

---

## 🎭 So sánh Mock vs Real API

### Frontend Mock Data (USE_REAL_API = false)

```javascript
// src/stockAPI.js
const USE_REAL_API = false;
```

- ✅ Không cần backend
- ✅ Giá cố định + random nhỏ
- ❌ Không realistic
- ❌ Không có market status

### Backend Enhanced Mock API (USE_REAL_API = true + backend USE_MOCK_API = true)

```javascript
// src/stockAPI.js
const USE_REAL_API = true;

// backend/server.js
const USE_MOCK_API = true;
```

- ✅ Giá biến động theo thời gian
- ✅ Market status (OPEN/CLOSED)
- ✅ OHLC prices (Open, High, Low, Close)
- ✅ Ceiling/Floor prices
- ✅ Skip weekends trong historical data
- ✅ Realistic volume

### TCBS Real API (USE_REAL_API = true + backend USE_MOCK_API = false)

```javascript
// backend/server.js
const USE_MOCK_API = false;
```

- ⚠️ Hiện tại bị chặn 403
- ✅ Dữ liệu thật 100% khi hoạt động
- ✅ Real-time prices từ sàn chứng khoán

---

## 📊 Tính năng Enhanced Mock API

### 1. Biến động giá theo thời gian

Giá thay đổi mỗi khi refresh hoặc thêm lại cổ phiếu:

- Sử dụng sine wave để mô phỏng trend
- Random noise để mô phỏng volatility
- Mỗi cổ phiếu có volatility khác nhau

### 2. Market Hours

- **9:00 - 15:00 (Mon-Fri):** Market OPEN
  - Volume cao hơn
  - Biến động mạnh hơn
- **Ngoài giờ:** Market CLOSED
  - Volume thấp
  - Biến động ít hơn

### 3. Historical Data

- Skip weekends (Saturday & Sunday)
- Chỉ hiển thị ngày giao dịch
- Volume ngẫu nhiên realistic

### 4. OHLC Prices

Mỗi lần gọi API trả về:
- **Open:** Giá mở cửa
- **High:** Giá cao nhất
- **Low:** Giá thấp nhất
- **Close:** Giá đóng cửa (= current price)

### 5. Ceiling/Floor

- **Ceiling:** Giá trần = Open × 1.07 (+7%)
- **Floor:** Giá sàn = Open × 0.93 (-7%)

---

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to backend"

**Nguyên nhân:** Backend chưa chạy

**Giải pháp:**
```bash
cd backend
npm start
```

### Lỗi: "CORS policy blocked"

**Nguyên nhân:** Backend không cho phép frontend origin

**Giải pháp:**
Kiểm tra `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Backend log không hiển thị request

**Nguyên nhân:** Frontend đang dùng Mock Data

**Giải pháp:**
Kiểm tra `src/stockAPI.js`:
```javascript
const USE_REAL_API = true; // Phải là true
```

### Giá không đổi khi refresh

**Đây là tính năng!** Enhanced Mock API tạo giá dựa trên timestamp, nên giá chỉ đổi sau một khoảng thời gian hoặc khi market status thay đổi.

---

## 📈 Các Test Cases Quan trọng

### ✅ Test Case 1: API Response Time

**Mục tiêu:** Kiểm tra thời gian phản hồi API

**Cách test:**
1. Mở DevTools → Network tab
2. Thêm cổ phiếu VCB
3. Kiểm tra request timing

**Kỳ vọng:**
- Time: 300-800ms (simulated delay)
- Status: 200 OK
- Response: JSON với đầy đủ thông tin

### ✅ Test Case 2: Error Handling

**Mục tiêu:** Kiểm tra xử lý lỗi khi nhập sai mã

**Cách test:**
1. Nhập mã không tồn tại: `ABCXYZ`
2. Click Thêm

**Kỳ vọng:**
- Alert hiển thị: "Không tìm thấy mã ABCXYZ"
- Backend log: Error fetching stock
- Watchlist không thay đổi

### ✅ Test Case 3: Duplicate Prevention

**Mục tiêu:** Kiểm tra không thêm trùng

**Cách test:**
1. Thêm VCB lần 1 → Success
2. Thêm VCB lần 2

**Kỳ vọng:**
- Alert: "VCB đã có trong watchlist!"
- Không gọi backend lần 2
- Watchlist không bị duplicate

---

## 🎯 Kết quả Mong đợi

Sau khi test xong, bạn có thể:

✅ Thêm cổ phiếu vào watchlist bằng backend API
✅ Xem biểu đồ giá với dữ liệu từ backend
✅ Thay đổi khung thời gian (7/30/90/365 ngày)
✅ Thấy giá cả biến động realistic theo thời gian
✅ Phân biệt OPEN/CLOSED market status
✅ Xem OHLC prices, ceiling/floor

---

## 🔄 Chuyển đổi giữa các API Modes

### Dùng Frontend Mock (Không cần backend)

```javascript
// src/stockAPI.js
const USE_REAL_API = false;
```

→ Giá cố định, không cần chạy backend

### Dùng Backend Enhanced Mock (Realistic)

```javascript
// src/stockAPI.js
const USE_REAL_API = true;

// backend/server.js
const USE_MOCK_API = true;
```

→ Cần chạy cả backend và frontend

### Dùng TCBS Real API (Khi khả dụng)

```javascript
// backend/server.js
const USE_MOCK_API = false;
```

→ Dữ liệu thật từ TCBS (hiện bị chặn 403)

---

## 📝 Checklist Test

- [ ] Backend server chạy thành công
- [ ] Frontend server chạy thành công
- [ ] Thêm cổ phiếu VCB → Success
- [ ] Backend log hiển thị request
- [ ] Xem biểu đồ → Chart hiển thị
- [ ] Thay đổi timeframe → Chart update
- [ ] Thêm nhiều cổ phiếu → All success
- [ ] Click popular tags → Auto add
- [ ] Thử mã không tồn tại → Error handled
- [ ] Thử duplicate → Alert hiển thị
- [ ] Console logs đúng (📡 Real API)
- [ ] Market status hiển thị (OPEN/CLOSED)
- [ ] OHLC prices hiển thị
- [ ] Giá biến động khi refresh sau vài phút

---

## 🚀 Next Steps

Sau khi test xong, bạn có thể:

1. **Deploy backend lên cloud** (Railway, Render, Vercel)
2. **Thêm tính năng mới:**
   - localStorage để lưu watchlist
   - Xóa cổ phiếu khỏi watchlist
   - Dark mode
   - Export CSV/PDF
   - So sánh cổ phiếu
3. **Tích hợp API thật:** Khi có API key từ VNDirect/Vietstock
4. **Thêm AI features:** Prediction, Sentiment Analysis, etc.

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Backend có đang chạy? → `http://localhost:3000/`
2. Frontend có đang chạy? → `http://localhost:5173/`
3. Console logs có lỗi không? → DevTools F12
4. USE_REAL_API có = true không? → `src/stockAPI.js`

Happy Testing! 🎉
