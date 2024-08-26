export const getPricePlan = async (pricePlan, db) => {
    const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [pricePlan]);
    return plan;
};



export const createPricePlan = async (pricePlan, db) => {
    const { name, sms_cost, call_cost } = pricePlan;
    await db.run('INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES (?, ?, ?)', [name, sms_cost, call_cost]);
};


export const getPricePlanByName = async (pricePlanName, db) => {
    return await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [pricePlanName]);
};


export const updatePricePlan = async (pricePlan, db) => {
    const { name, sms_cost, call_cost } = pricePlan;
    await db.run('UPDATE price_plan SET sms_price = ?, call_price = ? WHERE plan_name = ?', [sms_cost, call_cost, name]);
};


export const deletePricePlan = async (id, db) => {
    const result = await db.run('DELETE FROM price_plan WHERE id = ?', [id]);
    return result;
};



