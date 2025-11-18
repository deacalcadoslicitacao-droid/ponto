import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editing, setEditing] = useState(null);
  const [relId, setRelId] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function createUser(e) {
    e.preventDefault();
    try {
      await api.post('/user/create', form);
      setForm({ name: '', email: '', password: '', role: 'user' });
      setMsg('Usuário criado');
      loadUsers();
    } catch (e) {
      console.error(e);
      setMsg(e.response?.data?.error || 'Erro ao criar usuário');
    }
  }