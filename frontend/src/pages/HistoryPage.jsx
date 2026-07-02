import React from 'react';
import { useHistory } from '../hooks/useHistory';

const HistoryPage = () => {
  const { history } = useHistory();
  return (
    <div>
      <h1>History ({history.length} items)</h1>
    </div>
  );
};

export default HistoryPage;