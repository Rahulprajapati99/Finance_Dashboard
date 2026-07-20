/**
 * Deterministic test data, injected into localStorage (`finance_db`)
 * before the app boots. DataContext merges this over its defaults on init,
 * so every test starts from a known state instead of whatever the browser
 * profile happens to contain.
 */
export const seedTransactions = [
    {
        id: 'seed-tx-0001-salary',
        recipientName: 'Acme Corp Payroll',
        category: 'Salary',
        type: 'income',
        amount: 5200,
        status: 'completed',
        date: '2026-07-02T09:00:00.000Z',
        notes: 'July salary',
    },
    {
        id: 'seed-tx-0002-uber',
        recipientName: 'Uber',
        category: 'Transport',
        type: 'expense',
        amount: 24,
        status: 'completed',
        date: '2026-07-05T18:30:00.000Z',
        notes: '',
    },
    {
        id: 'seed-tx-0003-loblaws',
        recipientName: 'Loblaws',
        category: 'Food & Grocery',
        type: 'expense',
        amount: 132,
        status: 'completed',
        date: '2026-07-08T14:10:00.000Z',
        notes: 'weekly groceries',
    },
    {
        id: 'seed-tx-0004-freelance',
        recipientName: 'Northwind Consulting',
        category: 'Others',
        type: 'income',
        amount: 800,
        status: 'completed',
        date: '2026-07-10T11:00:00.000Z',
        notes: 'invoice #42',
    },
];

export const seedDb = {
    transactions: seedTransactions,
    goals: [
        {
            id: 'seed-goal-0001',
            name: 'Emergency Fund',
            targetAmount: 10000,
            currentAmount: 2500,
            targetDate: '2026-12-31',
        },
    ],
};
