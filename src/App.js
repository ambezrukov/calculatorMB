import React, { useState } from 'react';

const ProfitCalculator = () => {
  const [amount, setAmount] = useState('');
  const [clientPartnerType, setClientPartnerType] = useState('default');
  const [defaultClientPartner, setDefaultClientPartner] = useState('');
  const [clientSharePercentage, setClientSharePercentage] = useState(10); // новое состояние
  const [customClientShares, setCustomClientShares] = useState({
    Анатолий: 0,
    Денис: 0,
    Михаил: 0,
    Юрий: 0,
    Другие: 0
  });
  const [mbProvider, setMbProvider] = useState('');
  const [mbConvincer, setMbConvincer] = useState('');

  const partners = ['Анатолий', 'Денис', 'Михаил', 'Юрий'];
  
  // Создаем массив возможных процентов от 10 до 30 с шагом 2.5
  const percentageOptions = Array.from({ length: 9 }, (_, i) => 10 + i * 2.5);

  const totalClientShares = Object.values(customClientShares).reduce((sum, share) => sum + Number(share), 0);
  const isClientSharesValid = Math.abs(totalClientShares - 100) < 0.01;

  const calculateShare = (partner) => {
    if (!amount) return 0;
    const numAmount = parseFloat(amount);
    const clientShareDecimal = clientSharePercentage / 100; // преобразуем процент в десятичную дробь

    let clientShare = 0;
    if (clientPartnerType === 'default') {
      clientShare = partner === defaultClientPartner ? numAmount * clientShareDecimal : 0;
    } else {
      clientShare = numAmount * clientShareDecimal * (customClientShares[partner] / 100);
    }
    
    const remainingAmount = numAmount * (1 - clientShareDecimal); // оставшаяся сумма после выплаты клиентской доли
    const mbProviderShare = partner === mbProvider ? remainingAmount * 0.25 : 0;
    const mbConvincerShare = partner === mbConvincer ? remainingAmount * 0.25 : 0;
    const remainingShare = partner === 'Юрий' 
      ? remainingAmount * 0.5 * 0.077 
      : remainingAmount * 0.5 * 0.923 / 3;
    
    return clientShare + mbProviderShare + mbConvincerShare + remainingShare;
  };

  const handleCustomShareChange = (partner, value) => {
    setCustomClientShares(prev => ({
      ...prev,
      [partner]: Number(value) || 0
    }));
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center mb-6">Калькулятор МБ</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xl font-semibold mb-2">Сумма поступления:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Введите сумму"
          />
        </div>
        
        <div>
          <label className="block text-xl font-semibold mb-2">Размер менеджерского процента:</label>
          <select
            value={clientSharePercentage}
            onChange={(e) => setClientSharePercentage(Number(e.target.value))}
            className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          >
            {percentageOptions.map(percent => (
              <option key={percent} value={percent}>{percent}%</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xl font-semibold mb-2">Чей клиент:</label>
          <select
            value={clientPartnerType}
            onChange={(e) => setClientPartnerType(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Один партнер</option>
            <option value="custom">Пользовательское распределение</option>
          </select>
          
          {clientPartnerType === 'default' ? (
            <select
              value={defaultClientPartner}
              onChange={(e) => setDefaultClientPartner(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите партнера</option>
              {partners.map(partner => (
                <option key={partner} value={partner}>{partner}</option>
              ))}
            </select>
          ) : (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="text-sm mb-3">
                Укажите доли в процентах (сумма должна быть 100%):
                {!isClientSharesValid && (
                  <span className="text-red-500 ml-2">
                    Сумма долей: {totalClientShares}%
                  </span>
                )}
              </div>
              {[...partners, 'Другие'].map(partner => (
                <div key={partner} className="flex items-center gap-3 mb-2">
                  <label className="w-24 text-sm">{partner}:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customClientShares[partner]}
                    onChange={(e) => handleCustomShareChange(partner, e.target.value)}
                    className="w-24 p-2 border rounded"
                  />
                  <span className="text-sm">%</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-xl font-semibold mb-2">Кто обеспечил МБ:</label>
          <select
            value={mbProvider}
            onChange={(e) => setMbProvider(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите партнера</option>
            {partners.map(partner => (
              <option key={partner} value={partner}>{partner}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xl font-semibold mb-2">Кто убедил в ценности МБ:</label>
          <select
            value={mbConvincer}
            onChange={(e) => setMbConvincer(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите партнера</option>
            {partners.map(partner => (
              <option key={partner} value={partner}>{partner}</option>
            ))}
          </select>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Результаты расчета:</h3>
          <div className="grid grid-cols-2 gap-4">
            {partners.map(partner => (
              <div key={partner} className="p-4 border rounded-lg bg-gray-50">
                <div className="font-medium text-lg">{partner}</div>
                <div className="text-xl font-semibold text-blue-600">
                  {calculateShare(partner).toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
            ))}
          </div>
          {clientPartnerType === 'custom' && customClientShares.Другие > 0 && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="font-medium text-lg">Другие</div>
              <div className="text-xl font-semibold text-blue-600">
                {(parseFloat(amount) * (clientSharePercentage / 100) * (customClientShares.Другие / 100)).toLocaleString('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitCalculator;
