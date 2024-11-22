# השתמש בתמונה קלה של Node.js
FROM node:18-alpine

# הגדר תיקיית עבודה בתוך הקונטיינר
WORKDIR /app

# העתק רק את package.json ו-lock file כדי לשמור על cache בשלב ההתקנה
COPY package*.json ./

# התקן את התלויות
RUN npm install

# העתק את שאר הקבצים לפרויקט
COPY . .

# פתח את הפורט של שרת הפיתוח
EXPOSE 3000

# הרץ את שרת הפיתוח
CMD ["npm", "run", "dev"]
