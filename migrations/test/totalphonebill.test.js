import assert from "assert";
import {totalPhoneBill} from "../totalphonebill.js"; 


describe('totalPhoneBill function', function() {
    it("it should calculate the total bill for calls and SMSs", function() {
        assert.strictEqual(totalPhoneBill('call, sms, call, sms, sms'), 'R7.45');
    });

    it("it should calculate the total bill for calls and SMSs", function() {
        assert.strictEqual(totalPhoneBill('call, sms'), 'R3.40');
    });

    it("it should calculate the total bill for only SMSs", function() {
        assert.strictEqual(totalPhoneBill('sms, sms'), 'R1.30');
    });

});