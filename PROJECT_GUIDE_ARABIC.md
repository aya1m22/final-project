# دليل مشروع FashionAI - شرح شامل من الصفر

## 📋 نظرة عامة على المشروع

FashionAI هو منصة تجارة إلكترونية متطورة لبيع الملابس والإكسسوارات، مع دمج ذكاء اصطناعي لتحسين تجربة المستخدم. المشروع مبني باستخدام أحدث التقنيات ويحتوي على واجهة أمامية حديثة وخلفية قوية ونظام إدارة متقدم.

### 🎯 الهدف من المشروع
- بناء منصة تجارة إلكترونية احترافية تشبه Shein
- دمج الذكاء الاصطناعي لتوصيات المنتجات الشخصية
- تقديم تجربة مستخدم سلسة وحديثة
- نظام إدارة شامل للمنتجات والطلبات

---

## 🛠️ التقنيات المستخدمة (Technology Stack)

### الواجهة الأمامية (Frontend)
- **React 18** - مكتبة JavaScript لبناء واجهات المستخدم
- **TypeScript** - JavaScript مع نظام أنواع للكود الأكثر أماناً
- **Vite** - أداة بناء سريعة وحديثة
- **React Router** - للتنقل بين الصفحات
- **Tailwind CSS** - إطار عمل CSS للتصميم السريع
- **Framer Motion** - للرسوم المتحركة السلسة
- **React Hook Form + Zod** - للتحقق من صحة النماذج
- **Sonner** - للإشعارات التوست
- **React Query** - لإدارة البيانات والكاش

### الخلفية (Backend)
- **Node.js + Express** - خادم الويب
- **TypeScript** - للكود الآمن والمنظم
- **JWT** - للمصادقة والترخيص
- **bcrypt** - لتشفير كلمات المرور
- **Nodemailer** - لإرسال البريد الإلكتروني
- **Prisma** - ORM للتعامل مع قاعدة البيانات
- **SQLite** - قاعدة بيانات محلية للتطوير

### قاعدة البيانات (Database)
- **SQLite** - قاعدة بيانات محلية سريعة
- **Prisma** - أداة لتصميم وإدارة قاعدة البيانات

### الاختبارات (Testing)
- **Jest** - إطار عمل الاختبارات
- **Supertest** - لاختبار APIs
- **React Testing Library** - لاختبار المكونات

### أدوات التطوير (Dev Tools)
- **ESLint + Prettier** - لتنسيق الكود وفحصه
- **Husky** - للـ Git hooks
- **TypeScript Compiler** - للتحقق من الأنواع

---

## 📁 هيكل المشروع (Project Structure)

```
Graduation web project/
├── frontend/                 # الواجهة الأمامية
│   ├── src/
│   │   ├── components/       # المكونات المعاد استخدامها
│   │   ├── pages/           # صفحات التطبيق
│   │   ├── context/         # React Context للحالة العامة
│   │   └── styles.css       # ملفات التصميم
│   ├── package.json
│   └── index.html
├── backend/                  # الخلفية
│   ├── src/
│   │   ├── routes/          # مسارات API
│   │   ├── middleware/      # الوسائط المتوسطة
│   │   └── __tests__/       # ملفات الاختبار
│   ├── package.json
│   └── jest.config.cjs
├── database/                 # قاعدة البيانات
│   ├── prisma/
│   │   ├── schema.prisma    # مخطط قاعدة البيانات
│   │   └── seed.ts          # بيانات أولية
│   └── package.json
├── ai-service/              # خدمة الذكاء الاصطناعي (قيد التطوير)
├── docs/                    # التوثيق
└── scripts/                 # سكريبتات مساعدة
```

---

## 🚀 كيفية تشغيل المشروع

### 1. تثبيت المتطلبات الأساسية
```bash
# تأكد من وجود Node.js (الإصدار 18+)
node --version
npm --version
```

### 2. تشغيل الخلفية (Backend)
```bash
cd backend
npm install
npm run dev
```
الخادم سيعمل على: http://localhost:4000

### 3. تشغيل الواجهة الأمامية (Frontend)
```bash
cd frontend
npm install
npm run dev
```
التطبيق سيعمل على: http://localhost:5173

### 4. إعداد قاعدة البيانات
```bash
cd database
npm install
npm run prisma:push
npm run seed
```

### 5. تشغيل الاختبارات
```bash
cd backend
npm test
```

---

## 🔐 نظام المصادقة (Authentication System)

### التسجيل (Registration)
- **المسار**: `POST /api/auth/register`
- **البيانات المطلوبة**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "customer" // اختياري
  }
  ```

### تسجيل الدخول (Login)
- **المسار**: `POST /api/auth/login`
- **البيانات المطلوبة**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### التحقق من البريد الإلكتروني
- **المسار**: `GET /api/auth/verify?token=...`
- يتم إرسال رابط التحقق عبر البريد الإلكتروني

### تجديد الرمز المميز (Refresh Token)
- **المسار**: `POST /api/auth/refresh`
- للحصول على رمز وصول جديد

---

## 📦 API المنتجات (Products API)

### الحصول على قائمة المنتجات
- **المسار**: `GET /api/products`
- **المعلمات**:
  - `page`: رقم الصفحة
  - `limit`: عدد العناصر لكل صفحة
  - `q`: نص البحث
  - `category`: فلترة حسب الفئة

### الحصول على منتج واحد
- **المسار**: `GET /api/products/:id`
- **المعلمات**: معرف المنتج

### الحصول على قائمة الفئات
- **المسار**: `GET /api/products/categories/list`

---

## 👨‍💼 API الإدارة (Admin API)

### إحصائيات لوحة التحكم
- **المسار**: `GET /api/admin/stats`
- **الصلاحيات**: المدراء فقط

### إدارة المنتجات
- **إضافة منتج**: `POST /api/admin/products`
- **عرض المنتجات**: `GET /api/admin/products`
- **تحديث منتج**: `PUT /api/admin/products/:id`
- **حذف منتج**: `DELETE /api/admin/products/:id`

### إدارة المستخدمين
- **عرض المستخدمين**: `GET /api/admin/users`
- **تحديث دور المستخدم**: `PUT /api/admin/users/:id/role`

---

## 🗄️ مخطط قاعدة البيانات (Database Schema)

### جدول المستخدمين (Users)
```sql
CREATE TABLE User (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  email     TEXT UNIQUE NOT NULL,
  password  TEXT NOT NULL,
  role      TEXT DEFAULT 'customer',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### جدول المنتجات (Products)
```sql
CREATE TABLE Product (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  description TEXT,
  price       REAL NOT NULL,
  category    TEXT NOT NULL,
  images      TEXT, -- JSON string array
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 الاختبارات (Testing)

### اختبارات المنتجات
- اختبار قائمة المنتجات مع التصفح
- اختبار الحصول على منتج واحد
- اختبار التعامل مع المنتجات غير الموجودة
- اختبار قائمة الفئات

### اختبارات الإدارة
- اختبار الوصول للإحصائيات (للمدراء فقط)
- اختبار CRUD للمنتجات
- اختبار إدارة المستخدمين
- اختبار الصلاحيات والمصادقة

---

## 🎨 التصميم والواجهة (Design & UI)

### نظام الألوان
- **الأساسي**: #000000 (أسود)
- **الثانوي**: #FF0050 (وردي أحمر)
- **الخلفية**: #F5F5F5 (رمادي فاتح)

### الخطوط
- **العناوين**: Poppins
- **النصوص**: Inter

### المكونات الرئيسية
- **Navbar**: شريط التنقل العلوي
- **ProductCard**: بطاقة المنتج
- **CartDrawer**: درج سلة التسوق
- **Footer**: التذييل
- **CategoryPill**: حبوب الفئات

---

## 🔄 سير العمل التطويري (Development Workflow)

### 1. إنشاء فرع جديد
```bash
git checkout -b feature/new-feature
```

### 2. كتابة الكود
- اتبع معايير TypeScript
- استخدم ESLint و Prettier
- اكتب اختبارات للكود الجديد

### 3. الاختبار
```bash
npm test
npm run lint
```

### 4. رفع التغييرات
```bash
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

## 📈 خطة التطوير المستقبلية (Future Development)

### المرحلة التالية (Day 7-8)
- لوحة تحكم الإدارة الكاملة
- صفحة ملف المستخدم
- رفع الصور إلى Cloudinary

### المرحلة الذكاء الاصطناعي (Day 9-10)
- خدمة AI لتحليل الجسم
- توصيات المنتجات الشخصية
- البحث الذكي باللغة الطبيعية

### المرحلة النهائية (Day 11-12)
- اختبارات شاملة
- تحسين الأداء
- الأمان والنشر

---

## 🐛 حل المشاكل الشائعة (Troubleshooting)

### مشكلة في قاعدة البيانات
```bash
cd database
npm run prisma:push
npm run seed
```

### مشكلة في الاختبارات
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm test
```

### مشكلة في الواجهة الأمامية
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 المصادر والمراجع (Resources)

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📞 التواصل والمساعدة

لأي أسئلة أو مشاكل في المشروع، يرجى مراجعة:
1. ملفات التوثيق في مجلد `docs/`
2. ملف `README.md` الرئيسي
3. الاختبارات في مجلد `__tests__/`

---

*تم إنشاء هذا الدليل في 6 مايو 2026 كجزء من مشروع التخرج*</content>
<parameter name="filePath">c:\Users\Aya\OneDrive\Desktop\Graduation web project\PROJECT_GUIDE.md