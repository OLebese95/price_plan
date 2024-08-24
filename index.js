import express from 'express';
import cors from 'cors';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import { totalPhoneBill } from './totalphonebill.js';

const app = express();
const PORT = process.env.PORT || 4011;
app.listen(PORT, () => console.log(`Server started ${PORT}`))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));


const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

await db.migrate();


app.get('/api/price_plans', async (req, res) => {
    const plans = await db.all('SELECT * FROM price_plan');
    res.json(plans);
});


app.post('/api/phonebill', async (req, res) => {
    const { price_plan, actions } = req.body;

    const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [price_plan]);

    if (!plan) {
        return res.status(404).json({ error: 'Price plan not found' });
    }

    const total = totalPhoneBill(actions, plan);
    res.json({ total: `R${total}` }); 
});


app.post('/api/price_plan/create', async (req, res) => {
    const { name, sms_cost, call_cost } = req.body;

    await db.run('INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES (?, ?, ?)', [name, sms_cost, call_cost]);
    res.json({ status: 'Success', message: `Price plan ${name} is added into database.` });
});

app.post('/api/price_plan/update', async (req, res) => {
    const { name, sms_cost, call_cost } = req.body;

    await db.run('UPDATE price_plan SET sms_price = ?, call_price = ? WHERE plan_name = ?', [sms_cost, call_cost, name]);
    res.json({ status: 'Success', message: `Price plan ${name} updated.` });
});

app.post('/api/price_plan/delete', async (req, res) => {
    const { id } = req.body;
    const result = await db.run('DELETE FROM price_plan WHERE id = ?', [id]);

    if (result.changes === 0) {
        return res.status(404).json({ status: 'Error', message: `Price plan  ${id} is not available.` });
    }

    res.json({ status: 'Success', message: `Price plan with ${id} has been successfully deleted.` });
});