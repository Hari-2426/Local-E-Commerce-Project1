const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, location, bio FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, location, bio } = req.body;
    try {
        await db.execute(
            'UPDATE users SET name = ?, location = ?, bio = ? WHERE id = ?',
            [name, location, bio, req.user.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};
