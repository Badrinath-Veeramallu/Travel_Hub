import React, { createContext, useState, useContext, useCallback } from 'react';

const CurrencyContext = createContext();

// Static exchange rates relative to INR
const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095
};

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const CURRENCY_LABELS = {
  INR: '₹ INR - Indian Rupee',
  USD: '$ USD - US Dollar',
  EUR: '€ EUR - Euro',
  GBP: '£ GBP - British Pound'
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('currency') || 'INR';
    } catch {
      return 'INR';
    }
  });

  const changeCurrency = useCallback((newCurrency) => {
    if (EXCHANGE_RATES[newCurrency]) {
      setCurrency(newCurrency);
      try {
        localStorage.setItem('currency', newCurrency);
      } catch {
        // ignore
      }
    }
  }, []);

  const formatPrice = useCallback((inrAmount, options = {}) => {
    if (inrAmount === null || inrAmount === undefined || isNaN(inrAmount)) return '—';
    const { showSymbol = true, decimals = 0 } = options;
    const rate = EXCHANGE_RATES[currency] || 1;
    const converted = inrAmount * rate;
    const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] : '';
    const formatted = converted.toLocaleString('en-IN', {
      minimumFractionDigits: currency === 'INR' ? 0 : decimals,
      maximumFractionDigits: currency === 'INR' ? 0 : 2
    });
    return `${symbol}${formatted}`;
  }, [currency]);

  const convertPrice = useCallback((inrAmount) => {
    if (!inrAmount) return 0;
    const rate = EXCHANGE_RATES[currency] || 1;
    return Math.round(inrAmount * rate * 100) / 100;
  }, [currency]);

  const value = {
    currency,
    changeCurrency,
    formatPrice,
    convertPrice,
    symbol: CURRENCY_SYMBOLS[currency],
    exchangeRates: EXCHANGE_RATES,
    currencyLabels: CURRENCY_LABELS,
    availableCurrencies: Object.keys(EXCHANGE_RATES)
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
