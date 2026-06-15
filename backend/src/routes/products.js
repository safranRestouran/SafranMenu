import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, images, sort_order } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Nomi va narxi majburiy' });
    }

    let nextOrder = sort_order;
    if (nextOrder === undefined || nextOrder === null) {
      const { data: maxData } = await supabase
        .from('products')
        .select('sort_order')
        .eq('category', category)
        .order('sort_order', { ascending: false })
        .limit(1);
      nextOrder = (maxData?.[0]?.sort_order ?? 0) + 1;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price: Number(price), category, images: images || [], sort_order: nextOrder }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, images, sort_order } = req.body;
    const updates = {
      name, description, price: Number(price), category, images,
      updated_at: new Date().toISOString(),
    };
    if (sort_order !== undefined && sort_order !== null) {
      updates.sort_order = Number(sort_order);
    }
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/reorder', async (req, res) => {
  try {
    const { id1, id2 } = req.body;
    if (!id1 || !id2) {
      return res.status(400).json({ error: 'id1 va id2 majburiy' });
    }

    const { data: p1 } = await supabase.from('products').select('id, sort_order').eq('id', id1).single();
    const { data: p2 } = await supabase.from('products').select('id, sort_order').eq('id', id2).single();
    if (!p1 || !p2) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' });
    }

    await supabase.from('products').update({ sort_order: p2.sort_order, updated_at: new Date().toISOString() }).eq('id', p1.id);
    await supabase.from('products').update({ sort_order: p1.sort_order, updated_at: new Date().toISOString() }).eq('id', p2.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
