# 🚀 Backend Proxy Server - DudoanchungkhoanAI

Backend API server giải quyết vấn đề CORS và kết nối với API TCBS để lấy dữ liệu cổ phiếu Việt Nam real-time.

## 📦 Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Axios** - HTTP client
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables

## 🎯 Tính năng

✅ Lấy giá cổ phiếu real-time từ TCBS
✅ Lấy lịch sử giá cổ phiếu
✅ Danh sách cổ phiếu phổ biến
✅ Xử lý CORS
✅ Error handling
✅ Request logging

## 📁 Cấu trúc thư mục

```
backend/
├── server.js              # Express server chính
├── services/
│   └── tcbsAPI.js        # Service gọi API TCBS
├── package.json          # Dependencies
├── .env                  # Environment variables (không commit)
├── .env.example          # Template cho .env
├── .gitignore           # Ignore files
└── README.md            # File này
```

## 🛠️ Cài đặt

### 1. Di chuyển vào folder backend

```bash
cd backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment variables

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Hoặc trên Windows:

```bash
copy .env.example .env
```

Chỉnh sửa `.env` nếu cần:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Chạy server

**Development mode (tự động restart khi có thay đổi):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

## 🌐 API Endpoints

### 1. Health Check

```
GET /
```

Kiểm tra server có hoạt động không.

**Response:**
```json
{
  "status": "ok",
  "message": "DudoanchungkhoanAI Backend API",
  "version": "1.0.0"
}
```

### 2. Lấy giá cổ phiếu

```
GET /api/stock/:ticker
```

**Ví dụ:**
```
GET /api/stock/VCB
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticker": "VCB",
    "name": "Vietcombank",
    "price": 92500,
    "change": 1500,
    "changePercent": 1.65,
    "volume": 2547800,
    "high": 93000,
    "low": 91000,
    "open": 91500
  }
}
```

### 3. Lấy lịch sử giá

```
GET /api/stock/:ticker/history?days=30
```

**Parameters:**
- `days` (optional): Số ngày lịch sử (1-365), mặc định 30

**Ví dụ:**
```
GET /api/stock/VCB/history?days=90
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dates": ["01/12", "02/12", "03/12", ...],
    "prices": [92000, 92500, 93000, ...],
    "volumes": [2000000, 2500000, ...]
  }
}
```

### 4. Danh sách cổ phiếu phổ biến

```
GET /api/stocks/popular
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ticker": "VCB",
      "name": "Vietcombank",
      "price": 92500,
      ...
    },
    ...
  ]
}
```

## 🧪 Test API

### Sử dụng curl

```bash
# Test health check
curl http://localhost:3000/

# Test lấy giá cổ phiếu
curl http://localhost:3000/api/stock/VCB

# Test lịch sử giá
curl http://localhost:3000/api/stock/VCB/history?days=30

# Test danh sách phổ biến
curl http://localhost:3000/api/stocks/popular
```

### Sử dụng browser

Mở browser và truy cập:
- http://localhost:3000/
- http://localhost:3000/api/stock/VCB
- http://localhost:3000/api/stock/VCB/history?days=30

## 🐛 Xử lý lỗi

Server trả về lỗi với format:

```json
{
  "success": false,
  "error": "Mô tả lỗi"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (thiếu params hoặc params không hợp lệ)
- `404` - Not Found (endpoint không tồn tại)
- `500` - Internal Server Error (lỗi server hoặc API TCBS)

## 📊 Logs

Server tự động log các request:

```
[2025-12-07T10:30:45.123Z] GET /api/stock/VCB
[2025-12-07T10:30:47.456Z] GET /api/stock/VCB/history
```

## 🚀 Deploy lên Production

### Railway (Miễn phí)

1. Tạo tài khoản tại https://railway.app
2. Kết nối GitHub repository
3. Deploy folder `backend/`
4. Set environment variables trong Railway dashboard

### Vercel

1. Tạo tài khoản tại https://vercel.com
2. Deploy từ GitHub
3. Set Root Directory = `backend`
4. Set environment variables

### Render

1. Tạo tài khoản tại https://render.com
2. Tạo Web Service mới
3. Chọn repository và branch
4. Set Root Directory = `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`

## ⚠️ Lưu ý

- Không commit file `.env` lên Git
- API TCBS có thể thay đổi, cần cập nhật endpoints nếu cần
- Rate limiting: TCBS có thể giới hạn số request/phút
- Cần deploy backend lên cloud để frontend trên Vercel/Netlify có thể gọi được

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Issue hoặc Pull Request.

## 📝 License

MIT License
