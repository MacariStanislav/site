'use client';

import { useState } from 'react';
import { addCar } from '../../utils/adminApi';
import Link from 'next/link';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [media, setMedia] = useState(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const adminPassword = '1234';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== adminPassword) {
      setMessage('Incorrect password');
      return;
    }

    const result = await addCar({ name, description, price, media });
    if (result.error) setMessage(result.error);
    else {
      setMessage('Car added successfully!');
      setName(''); setDescription(''); setPrice(''); setMedia(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel - Add Car</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="text" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="text" placeholder="Car Name" value={name} onChange={e => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <input type="file" accept="image/*,video/*" onChange={e => setMedia(e.target.files[0])} />
        <button type="submit">Add Car</button>
      </form>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
         <Link href={'/'}>
        <button >home</button>
      </Link>
    </div>
  );
}
