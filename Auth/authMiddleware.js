const supabase = require('../config/supabase'); 
// (One dot takes you to 'middleware', two dots '..' takes you to 'src', where 'config' lives)

const protect = async (req, res, next) => {
    try {
        // Fix: Use 'headers' (plural)
        const authHeader = req.headers.authorization;

        // Fix: Use '.startsWith' instead of '.isEquals'
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const token = authHeader.split(" ")[1];

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { protect };