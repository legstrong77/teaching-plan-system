import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    childType: '',
    venue: '',
    message: '',
    file: null
  });
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/form-data`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('無法獲取歷史記錄');
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('獲取歷史記錄失敗:', err);
      setError('無法連接到服務器，請確保服務器正在運行');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const validateForm = () => {
    const errors = [];
    if (formData.name.length < 2) {
      errors.push('姓名至少需要2個字符');
    }
    if (!formData.childType) {
      errors.push('請選擇孩子年齡組別');
    }
    if (!formData.email.includes('@')) {
      errors.push('請輸入有效的電子郵件地址');
    }
    if (!formData.venue) {
      errors.push('請輸入教案場地');
    }
    if (formData.message && formData.message.length < 10) {
      errors.push('備註如果填寫，至少需要10個字符');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      setLoading(false);
      return;
    }

    try {
      console.log('正在提交表單數據:', formData);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/form-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          childType: formData.childType,
          venue: formData.venue,
          message: formData.message
        }),
      });

      console.log('服務器響應狀態:', response.status);

      const data = await response.json();
      console.log('服務器返回數據:', data);

      if (!response.ok) {
        throw new Error(data.message || '提交失敗');
      }

      setAnalysis(data.analysis);
      await fetchHistory();
      
      // 清空表單
      setFormData({
        name: '',
        email: '',
        childType: '',
        venue: '',
        message: '',
        file: null
      });

      // 顯示成功消息
      alert('表單提交成功！');
    } catch (err) {
      console.error('提交錯誤:', err);
      setError(err.message || '提交失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>教案分析系統</h1>
        <p className="header-subtitle">為您的孩子打造最適合的學習體驗</p>
      </header>
      <div className="tab-container">
        <button 
          className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          <span className="tab-icon">📝</span>
          提交表單
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="tab-icon">📚</span>
          歷史記錄
        </button>
      </div>
      <main>
        {activeTab === 'form' ? (
          <>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-header">
                <h2>教案需求表單</h2>
                <p>請填寫以下訊息，我們將為您提供專業的教案內容</p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    <span className="input-icon">👤</span>
                    姓名：
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength="2"
                    placeholder="請輸入您的姓名"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="childType">
                    <span className="input-icon">👶</span>
                    孩子年齡：
                  </label>
                  <select
                    id="childType"
                    name="childType"
                    value={formData.childType}
                    onChange={handleChange}
                    required
                    className="select-input"
                  >
                    <option value="">請選擇...</option>
                    <option value="小蟻">小蟻 (6~8歲)</option>
                    <option value="小蜂">小蜂 (9~11歲)</option>
                    <option value="小鹿">小鹿 (12~14歲)</option>
                    <option value="小鷹">小鷹 (15~17歲)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <span className="input-icon">📧</span>
                    電子郵件：
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="venue">
                    <span className="input-icon">🏫</span>
                    教案場地：
                  </label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    placeholder="請輸入教案場地"
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="message">
                  <span className="input-icon">📝</span>
                  關於教案的其他備註：
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="請填寫其他需要注意的事項..."
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="file">
                  <span className="input-icon">📎</span>
                  附件：
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleChange}
                  className="file-input"
                />
              </div>
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    提交中...
                  </>
                ) : (
                  <>
                    <span className="submit-icon">✨</span>
                    提交
                  </>
                )}
              </button>
            </form>

            {error && <div className="error">{error}</div>}
            
            {analysis && (
              <div className="analysis-container">
                <h2>
                  <span className="analysis-icon">📊</span>
                  分析結果
                </h2>
                <p>{analysis}</p>
              </div>
            )}
          </>
        ) : (
          <div className="history-container">
            <h2>
              <span className="history-icon">📚</span>
              歷史記錄
            </h2>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>提交時間</th>
                    <th>姓名</th>
                    <th>電子郵件</th>
                    <th>孩子年齡</th>
                    <th>教案場地</th>
                    <th>訊息</th>
                    <th>分析結果</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.childType}</td>
                      <td>{item.venue}</td>
                      <td>{item.message}</td>
                      <td>{item.analysis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <footer className="footer">
        <a href="https://www.youtube.com/@Legstrong%E5%8D%97%E4%BA%8C%E6%B3%A5%E9%B0%8D" target="_blank" rel="noopener noreferrer">
          <span className="youtube-icon">▶</span>
          南二泥鰍
        </a>
      </footer>
    </div>
  );
}

export default App;
