import React from 'react';
import { useHistory } from '../hooks/useHistory';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const HistoryPage = () => {
  const { history } = useHistory();
  useDocumentMeta({
    title: 'Photo History',
    description: 'View your previously processed passport photos.',
  });

  return (
    <div>
      <h1>History ({history.length} items)</h1>
    </div>
  );
};

export default HistoryPage;