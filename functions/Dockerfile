FROM node:18-alpine

# הגדרת תיקיית עבודה
WORKDIR /usr/src/app

# העתקת קובץ package.json ו-package-lock.json
COPY package*.json ./

# התקנת התלויות
RUN npm install

# העתקת שאר קבצי הפרויקט
COPY . .

# פתיחת פורט (אם יש צורך)
EXPOSE 5000

# הפעלת השרת
CMD ["npm", "start"]
