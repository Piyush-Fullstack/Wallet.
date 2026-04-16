import React, { useEffect, useState } from 'react';
import './App.css'
import '@qpokychuk/gilroy/normal.css';

const App = () => {
  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Education', 'Shopping', 'Salary', 'Freelance', 'Other'];
  const filterCategories = ['All', ...categories];

  const [expenseName, setexpenseName] = useState('');
  const [expenseAmount, setexpenseAmount] = useState('');
  const [expenseCategory, setexpenseCategory] = useState(categories[0]);
  const [entryType, setEntryType] = useState('expense'); // 'income' or 'expense'
  const [filterType, setFilterType] = useState('All');
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('wallet_data');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wallet_data', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;

    const newTransaction = {
      id: Date.now().toString(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      type: entryType,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };

    setTransactions([newTransaction, ...transactions]);
    setexpenseName('');
    setexpenseAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // --- Data Aggregation Logic ---
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) => {
    return filterType === 'All' ? true : t.category === filterType;
  });

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 font-gilroy p-4 md:p-8'>
      <div className='max-w-2xl mx-auto'>
        
        {/* Dashboard Header */}
        <header className='mb-8 text-center'>
          <h1 className='text-3xl font-black tracking-tight text-slate-800'>Wallet.</h1>
          <p className='text-slate-500 font-medium'>Smart Finance Manager</p>
        </header>

        {/* Summary Cards (Data Aggregation) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase">Balance</p>
            <h2 className={`text-2xl font-black ${balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              ₹{balance.toLocaleString()}
            </h2>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-xs font-bold uppercase text-green-500">Income</p>
            <h2 className="text-2xl font-black text-green-600">₹{totalIncome.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-xs font-bold uppercase text-red-500">Expense</p>
            <h2 className="text-2xl font-black text-red-600">₹{totalExpense.toLocaleString()}</h2>
          </div>
        </div>

        {/* Form Card */}
        <section className='bg-white rounded-3xl shadow-md border border-slate-200 p-6 mb-8'>
          <form onSubmit={handleSubmit}>
            {/* Income/Expense Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-2xl">
              <button 
                type="button"
                onClick={() => setEntryType('expense')}
                className={`flex-1 py-2 rounded-xl font-bold transition-all ${entryType === 'expense' ? 'bg-white shadow text-red-500' : 'text-slate-500'}`}
              >
                Expense
              </button>
              <button 
                type="button"
                onClick={() => setEntryType('income')}
                className={`flex-1 py-2 rounded-xl font-bold transition-all ${entryType === 'income' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}
              >
                Income
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className='md:col-span-2'>
                <label className='text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wide'>Name</label>
                <input 
                  onChange={(e) => setexpenseName(e.target.value)}
                  value={expenseName}
                  className='w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none'
                  type="text" 
                  placeholder={entryType === 'income' ? 'Salary, Gift...' : 'Pizza, Rent...'} />
              </div>
              
              <div>
                <label className='text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wide'>Amount</label>
                <input 
                  onChange={(e) => setexpenseAmount(e.target.value)}
                  value={expenseAmount}
                  className='w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none'
                  type="number" 
                  placeholder="0.00" />
              </div>

              <div>
                <label className='text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wide'>Category</label>
                <select
                  onChange={(e) => setexpenseCategory(e.target.value)}
                  value={expenseCategory}
                  className='w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none'
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button className={`md:col-span-2 w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98] ${entryType === 'income' ? 'bg-green-600 shadow-green-100 hover:bg-green-700' : 'bg-slate-800 shadow-slate-200 hover:bg-slate-900'}`}>
                Add {entryType === 'income' ? 'Income' : 'Expense'}
              </button>
            </div>
          </form>
        </section>

        {/* Filter Pills */}
        <div className='flex items-center gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar'>
          {filterCategories.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                filterType === type 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className='space-y-3'>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">History</h3>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium italic">No transactions to show.</p>
            </div>
          ) : (
            filteredTransactions.map((item) => (
              <div key={item.id} className='group bg-white rounded-2xl p-4 flex justify-between items-center border border-slate-100 hover:shadow-md transition-all'>
                <div className='flex items-center gap-4'>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {item.type === 'income' ? '↓' : '↑'}
                  </div>
                  <div>
                    <h3 className='font-bold text-slate-800'>{item.name}</h3>
                    <p className='text-[10px] text-slate-400 font-bold uppercase'>{item.category} • {item.date}</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <p className={`text-lg font-black ${item.type === 'income' ? 'text-green-600' : 'text-slate-800'}`}>
                    {item.type === 'income' ? '+' : '-'}₹{item.amount}
                  </p>
                  <button 
                    onClick={() => deleteTransaction(item.id)}
                    className='opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
