const supabase = require('../config/supabase');

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) return res.status(400).json({ error: error.message });

        res.status(201).json({
            message: "Signup successful! Please check your email to verify your account.",
            user: { id: data.user.id, email: data.user.email }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during signup' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) return res.status(401).json({ error: error.message });

        res.status(200).json({
            message: "Login successful",
            user: { id: data.user.id, email: data.user.email },
            token: data.session.access_token // The Supabase JWT
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login' });
    }
};