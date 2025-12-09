const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.register = async (req, res) => {
    const { username, email, full_name, password } = req.body;

    try {
        // Check if user exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.render('register', {
                title: 'Register',
                error: 'User with that email or username already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.query(
            'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, full_name]
        );

        res.render('login', {
            title: 'Login',
            success: 'Registration successful! Please login.'
        });

    } catch (error) {
        console.error(error);
        res.render('register', {
            title: 'Register',
            error: 'An error occurred during registration'
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }

        // Set session
        req.session.user = {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email
        };

        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.render('login', {
            title: 'Login',
            error: 'An error occurred during login'
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
