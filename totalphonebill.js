export function totalPhoneBill(actions, prices) {
    let total = 0;
    const actionsList = actions.split(', ');

    actionsList.forEach(action => {
        if (action === 'call') {
            total += prices.call_price;
        } else if (action === 'sms') {
            total += prices.sms_price;
        }
    });

    return total.toFixed(2);
}