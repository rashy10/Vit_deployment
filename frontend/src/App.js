import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult('');

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please choose a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:5000/classify', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(`The uploaded image is a: ${data.result}`);
    } catch (error) {
      setResult('Error uploading image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '400px', margin: 'auto' }}>
      <h2>Cat vs Dog Classifier </h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div style={{ marginTop: '1rem' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        {loading ? 'Classifying...' : 'Upload and Classify'}
      </button>

      <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{result}</p>
    </div>
  );
}

export default App;
