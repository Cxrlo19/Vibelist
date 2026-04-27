import { Router, Request, Response } from 'express';
import getSupabase from '../services/supabase';

const router = Router();

// Sign up
router.post('/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    const { data, error } = await getSupabase().auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ user: data.user });
});

// Sign in
router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    const { data, error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ user: data.user, session: data.session });
});

export default router;