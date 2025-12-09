# Express + EJS + MySQL Application

A full-stack web application built with Express.js, EJS templating, and MySQL database.

## Features

- User authentication and sessions
- Posts/Articles with categories and tags
- Comments system
- Responsive design with custom CSS
- RESTful API structure

## Database Schema

The application includes the following tables:
- **users** - User accounts and profiles
- **posts** - Blog posts/articles
- **categories** - Post categories
- **tags** - Post tags
- **post_tags** - Many-to-many relationship between posts and tags
- **comments** - User comments on posts
- **sessions** - User session management

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Update the `.env` file with your MySQL credentials:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
```

### 3. Setup Database
Run the database setup script:
```bash
node database/setup.js
```

This will:
- Create the database
- Create all necessary tables
- Seed with sample data

### 4. Run the Application
Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Manual Database Setup

If you prefer to set up the database manually:

1. Log into MySQL:
```bash
mysql -u root -p
```

2. Run the schema:
```bash
mysql -u root -p < database/schema.sql
```

3. (Optional) Seed with sample data:
```bash
mysql -u root -p < database/seed.sql
```

## Project Structure

```
├── config/
│   └── db.js              # Database connection
├── database/
│   ├── schema.sql         # Database schema
│   ├── seed.sql           # Sample data
│   └── setup.js           # Automated setup script
├── public/
│   ├── css/
│   │   └── style.css      # Styles
│   └── js/
│       └── main.js        # Client-side JavaScript
├── routes/
│   └── index.js           # Route handlers
├── views/
│   ├── partials/
│   │   ├── header.ejs     # Header partial
│   │   └── footer.ejs     # Footer partial
│   └── index.ejs          # Home page
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js              # Application entry point
```

## Next Steps

- Add authentication routes (login, register, logout)
- Create CRUD operations for posts
- Add user profile pages
- Implement search functionality
- Add pagination for posts
- Create admin dashboard

## License

ISC
