import assert from "assert";
import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import { totalPhoneBill } from "../totalphonebill.js";
import { getPricePlan } from "../services/db.service.js";

let db;

before(async function() {
    db = await sqlite.open({
        filename: './data_plan_test.db', 
        driver: sqlite3.Database
    });
    await db.migrate();
});

after(async function() {
    await db.close();
});

describe('totalPhoneBill function', function() {
    it("should calculate the total bill for calls and SMSs", async function() {
        const plan = await getPricePlan('sms 101', db);
        const total = totalPhoneBill('call, sms, call, sms, sms', plan);
        assert.strictEqual(total, (2 * plan.call_price + 3 * plan.sms_price).toFixed(2));
    });

    it("should calculate the total bill for calls only", async function() {
        const plan = await getPricePlan('call 101', db);
        const total = totalPhoneBill('call, call', plan);
        assert.strictEqual(total, (2 * plan.call_price).toFixed(2));
    });

    it("should calculate the total bill for calls only", async function() {
        const plan = await getPricePlan('call 201', db);
        const total = totalPhoneBill('call, call, call', plan);
        assert.strictEqual(total, (3 * plan.call_price).toFixed(2));
    });

    it("should calculate the total bill for only SMSs", async function() {
        const plan = await getPricePlan('sms 101', db);
        const total = totalPhoneBill('sms, sms', plan);
        assert.strictEqual(total, (2 * plan.sms_price).toFixed(2));
    });
});

