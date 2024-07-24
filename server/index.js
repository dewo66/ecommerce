// index.js
const express = require('express');
const cors = require('cors');

const pool = require('./db');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// GET GET GET GET
app.get('/api/campaign-slider', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM campaign_slider');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/examination', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM examination');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/footer-links', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM footer_links');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/product_comments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM product_comments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bank_accounts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bank_accounts');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/contact_messages', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching contact messages:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/about_us', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM about_us WHERE id = 1');
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (err) {
    console.error('Error fetching about us content:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// POST POST POST POST POST 
app.post('/api/users', async (req, res) => {
  const { username, email, password, tel, adresBilgileri = "", siparisBilgileri = "", odemeBilgileri = "", satinAlmaGecmisi = [],isAdmin = 0 } = req.body;

  try {
    const insertUserQuery = `
      INSERT INTO users (username, email, password, tel, adresBilgileri, siparisBilgileri, odemeBilgileri, satinAlmaGecmisi, isAdmin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const satinAlmaGecmisiStr = JSON.stringify(satinAlmaGecmisi);
    const [result] = await pool.query(insertUserQuery, [
      username,
      email,
      password,
      tel,
      adresBilgileri,
      siparisBilgileri,
      odemeBilgileri,
      satinAlmaGecmisiStr,
      isAdmin
    ]);
    res.status(201).json({ success: true, message: 'Kullanıcı başarıyla eklendi.', userId: result.insertId });
  } catch (error) {
    console.error('Kullanıcı eklenirken hata oluştu:', error.message);
    res.status(500).json({ success: false, message: 'Kullanıcı eklenirken hata oluştu.', error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, description, price, imageUrl, stock, category } = req.body;
  console.log('Received product data:', req.body);

  if (!name || !description || !price || !imageUrl || !stock || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, imageUrl, stock, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, imageUrl, stock, category]
    );
    res.status(201).json({ id: result.insertId, name, description, price, imageUrl, stock, category });
  } catch (err) {
    console.error('Error inserting product:', err.message); // Enhanced logging
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  const { title, subcategories } = req.body;

  if (!title || !subcategories) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO categories (title, subcategories) VALUES (?, ?)',
      [title, JSON.stringify(subcategories)]
    );
    res.status(201).json({ id: result.insertId, title, subcategories });
  } catch (err) {
    console.error('Error inserting category:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/examination', async (req, res) => {
  const { imageUrl, link } = req.body;

  if (!imageUrl || !link) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO examination (imageUrl, link) VALUES (?, ?)',
      [imageUrl, link]
    );
    res.status(201).json({ id: result.insertId, imageUrl, link });
  } catch (err) {
    console.error('Error inserting examination:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/campaign-slider', async (req, res) => {
  const { imageUrl, link } = req.body;

  if (!imageUrl || !link) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO campaign_slider (imageUrl, link) VALUES (?, ?)',
      [imageUrl, link]
    );
    res.status(201).json({ id: result.insertId, imageUrl, link });
  } catch (err) {
    console.error('Error inserting campaign slider:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/contact_messages', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(201).json({ id: result.insertId, name, email, message });
  } catch (err) {
    console.error('Error inserting contact message:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bank_accounts', async (req, res) => {
  const { bank_name, account_number, iban, swift_code } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO bank_accounts (bank_name, account_number, iban, swift_code) VALUES (?, ?, ?, ?)',
      [bank_name, account_number, iban, swift_code]
    );
    res.status(201).json({ id: result.insertId, bank_name, account_number, iban, swift_code });
  } catch (err) {
    console.error('Error inserting bank account:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// PUT PUT PUT
app.put('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, imageUrl, stock, category } = req.body;

  if (!name || !description || !price || !imageUrl || !stock || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      'UPDATE products SET name=?, description=?, price=?, imageUrl=?, stock=?, category=? WHERE id=?',
      [name, description, price, imageUrl, stock, category, productId]
    );
    res.status(200).json({ id: productId, name, description, price, imageUrl, stock, category });
  } catch (err) {
    console.error(`Error updating product ${productId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  const categoryId = req.params.id;
  const { title, subcategories } = req.body;

  if (!title || !subcategories) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      'UPDATE categories SET title=?, subcategories=? WHERE id=?',
      [title, JSON.stringify(subcategories), categoryId]
    );
    res.status(200).json({ id: categoryId, title, subcategories });
  } catch (err) {
    console.error(`Error updating category ${categoryId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/examination/:id', async (req, res) => {
  const examinationId = req.params.id;
  const { imageUrl, link } = req.body;

  if (!imageUrl || !link) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      'UPDATE examination SET imageUrl=?, link=? WHERE id=?',
      [imageUrl, link, examinationId]
    );
    res.status(200).json({ id: examinationId, imageUrl, link });
  } catch (err) {
    console.error(`Error updating examination ${examinationId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/campaign-slider/:id', async (req, res) => {
  const sliderId = req.params.id;
  const { imageUrl, link } = req.body;

  if (!imageUrl || !link) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      'UPDATE campaign_slider SET imageUrl=?, link=? WHERE id=?',
      [imageUrl, link, sliderId]
    );
    res.status(200).json({ id: sliderId, imageUrl, link });
  } catch (err) {
    console.error(`Error updating campaign slider ${sliderId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, password, tel, adresBilgileri, siparisBilgileri, odemeBilgileri, satinAlmaGecmisi, isAdmin } = req.body;

  try {
    await pool.query(
      `UPDATE users SET username=?, email=?, password=?, tel=?, adresBilgileri=?, siparisBilgileri=?, odemeBilgileri=?, satinAlmaGecmisi=?, isAdmin=? WHERE id=?`,
      [username, email, password, tel, adresBilgileri, siparisBilgileri, odemeBilgileri, JSON.stringify(satinAlmaGecmisi), isAdmin, userId]
    );
    res.status(200).json({ message: `User with ID ${userId} updated successfully` });
  } catch (err) {
    console.error(`Error updating user ${userId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/about_us', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE about_us SET content = ? WHERE id = 1',
      [content]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.status(200).json({ message: 'Content updated successfully' });
  } catch (err) {
    console.error('Error updating about us content:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/bank_accounts/:id', async (req, res) => {
  const { id } = req.params;
  const { bank_name, account_number, iban, swift_code } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE bank_accounts SET bank_name = ?, account_number = ?, iban = ?, swift_code = ? WHERE id = ?',
      [bank_name, account_number, iban, swift_code, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bank account not found' });
    }
    res.status(200).json({ id, bank_name, account_number, iban, swift_code });
  } catch (err) {
    console.error('Error updating bank account:', err.message);
    res.status(500).json({ error: err.message });
  }
});




// (DELETE)
app.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await pool.query('DELETE FROM products WHERE id=?', [productId]);
    res.status(200).json({ message: `Product with ID ${productId} deleted successfully` });
  } catch (err) {
    console.error(`Error deleting product ${productId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  const categoryId = req.params.id;
  try {
    await pool.query('DELETE FROM categories WHERE id=?', [categoryId]);
    res.status(200).json({ message: `Category with ID ${categoryId} deleted successfully` });
  } catch (err) {
    console.error(`Error deleting category ${categoryId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/examination/:id', async (req, res) => {
  const examinationId = req.params.id;
  try {
    await pool.query('DELETE FROM examination WHERE id=?', [examinationId]);
    res.status(200).json({ message: `Examination with ID ${examinationId} deleted successfully` });
  } catch (err) {
    console.error(`Error deleting examination ${examinationId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/campaign-slider/:id', async (req, res) => {
  const sliderId = req.params.id;
  try {
    await pool.query('DELETE FROM campaign_slider WHERE id=?', [sliderId]);
    res.status(200).json({ message: `Campaign slider with ID ${sliderId} deleted successfully` });
  } catch (err) {
    console.error(`Error deleting campaign slider ${sliderId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await pool.query('DELETE FROM users WHERE id=?', [userId]);
    res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
  } catch (err) {
    console.error(`Error deleting user ${userId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contact_messages/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact message:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/bank_accounts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM bank_accounts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bank account not found' });
    }
    res.status(200).json({ message: 'Bank account deleted successfully' });
  } catch (err) {
    console.error('Error deleting bank account:', err.message);
    res.status(500).json({ error: err.message });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

