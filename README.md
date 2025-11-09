# 🍽️ QR Dine

**QR Dine** is a modern digital restaurant management system that allows customers to scan a QR code on their table to view the menu, place orders, and track their order status — all from their mobile devices.  
It helps restaurants go paperless, reduce waiting times, and streamline their service.

---

## 🌟 Overview

This project was developed as part of our academic group work to demonstrate full-stack web development and real-time interaction between customers, staff, and admin through a clean and user-friendly interface.

---

## 👩‍💻 Team Members

| Name | Role | Responsibilities |
|------|------|------------------|
| **Maithri** | Full Stack Developer | Frontend development, UI/UX design, integration with backend |
| **Muktha** | Backend Developer | Server setup, database management, API creation, testing |
| **Shipali** | Developer / Tester | Collecting data, images, and handling admin backend support |

---

## 🚀 Features

- 📱 Scan QR code to open the digital menu  
- 🍔 Browse and place orders seamlessly  
- 🧾 Real-time order status updates  
- 🧑‍🍳 Admin panel for managing menus, tables, and orders  
- 💳 Payment system integration ready  
- ⚙️ Built using a scalable and modular architecture

---

## 🛠️ Tech Stack

**Frontend:**  
-  Next.js  
- Tailwind CSS  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB  

**Other Tools & Technologies:**  
- Cloudinary for image storage  
- JWT Authentication  
- RESTful API integration  
- Postman (for API testing)

---

## 📂 Project Structure

```
qr-dine/
 ├── qr-dine-frontend/      # Frontend ( Next.js)
 ├── qr-dine-backend/       # Backend (Node.js / Express)
 ├── package.json
 ├── .gitignore
 └── README.md
```

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

### 1️⃣ Clone the repository
```bash
git clone https://github.com/codemy3/QR-dine.git
cd QR-dine
```

### 2️⃣ Install dependencies
**Backend:**
```bash
cd qr-dine-backend
npm install
```
**Frontend:**
```bash
cd ../qr-dine-frontend
npm install
```

### 3️⃣ Configure environment variables
Create a `.env` file inside the `qr-dine-backend/` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4️⃣ Run the project
**Start backend:**
```bash
npm start
```
**Start frontend:**
```bash
npm run dev
```

### 5️⃣ Open the app
Visit:  
```
http://localhost:3000
```

---

## 🌐 How It Works

1. Customers scan the QR code at their table.  
2. The menu loads instantly on their mobile browser.  
3. They place orders directly through the web app.  
4. The backend manages the orders and updates their status.  
5. Admins can monitor all tables, orders, and menus in real time.
   <img width="1919" height="1026" alt="image" src="https://github.com/user-attachments/assets/1ab426cd-6685-426d-bc59-207c7f8d4a9e" />
   <img width="1919" height="974" alt="image" src="https://github.com/user-attachments/assets/1a0f7ccc-18bb-416f-a9c8-56b792d9ab3f" />


<img width="1914" height="1025" alt="image" src="https://github.com/user-attachments/assets/e54e9a61-59d6-4ddf-a690-45c2648f8355" />

---

## 🧩 Future Enhancements

- 💰 Online payment gateway integration  
- 📊 Analytics dashboard for admin  
- 🔔 Live order notifications  
- 🌐 Multi-language support  

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to suggest improvements or report bugs, please open an issue or submit a pull request.

---

## 📧 Contact

**Developed by:**  
👩‍💻 Maithri — [smaithri039@gmail.com](mailto:smaithri039@gmail.com)  
👩‍💻 Muktha — [https://github.com/Smuktha](https://github.com/Smuktha)  
👩‍💻 Shipali — [https://github.com/shipali-k-account](https://github.com/shipali-k-account)

GitHub: [codemy3](https://github.com/codemy3)

---

⭐ *If you found this project helpful or inspiring, please give it a star on GitHub!*  
It means a lot to us. 💫
