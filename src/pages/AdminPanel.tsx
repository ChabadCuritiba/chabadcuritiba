import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Heart, Calendar, Search, 
  Download, Printer, Filter, CheckCircle2, Clock, 
  AlertCircle, RefreshCw, Mail, Phone, Lock, 
  FileSpreadsheet, Sparkles, LogOut, Ticket, Plus, Trash2, 
  MapPin, X, Image as ImageIcon, Check, Eye, FileText, 
  ExternalLink, UserCheck, Shield, KeyRound, UserX, Edit3,
  Copy, Bell, BellRing, Send, Smartphone, Volume2, Radio, CheckCheck, Flame
} from 'lucide-react';
import { 
  RsvpRecord, DonationRecord, getRsvpRecords, 
  updateRsvpStatus, getDonationRecords, deleteRsvpRecord,
  deleteDonationRecord, clearAllRsvps, clearAllDonations,
  fetchRemoteRsvps, fetchRemoteDonations,
  RSVP_ADMIN_EMAIL, CHABAD_OFFICIAL_EMAIL 
} from '../utils/formSubmit';
import { 
  getCommunityEvents, saveCommunityEvent, updateCommunityEvent, deleteCommunityEvent,
  fetchRemoteEvents
} from '../utils/eventsManager';
import { 
  signInWithGoogle, signOutAdmin, getAdminRoleForEmail, 
  fetchAuthorizedAdmins, saveAuthorizedAdmin, deleteAuthorizedAdmin,
  HARDCODED_SUPER_ADMINS, AdminUser, AdminRole, auth
} from '../utils/firebaseAuth';
import {
  fetchPushSubscribers,
  fetchSentNotifications,
  broadcastPushNotification,
  generateShabbatNotificationTemplate,
  showLocalSystemNotification,
  PushSubscriber,
  SentNotification
} from '../utils/notifications';
import { onAuthStateChanged, User } from 'firebase/auth';
import { CommunityEvent, EventMealItem } from '../types';

export const AdminPanel: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'rsvps' | 'donations' | 'events' | 'admins' | 'notifications'>('rsvps');
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [adminsList, setAdminsList] = useState<AdminUser[]>([]);
  const [pushSubscribers, setPushSubscribers] = useState<PushSubscriber[]>([]);
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<RsvpRecord | null>(null);

  // Push Notification Form State
  const [notifTitle, setNotifTitle] = useState('🕯️ Shabat Shalom!');
  const [notifBody, setNotifBody] = useState('Acendimento das velas hoje em Curitiba às 17:49. Shabat Shalom a toda a comunidade!');
  const [notifUrl, setNotifUrl] = useState('/#home');
  const [isSendingPush, setIsSendingPush] = useState(false);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [pushFeedback, setPushFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');

  // Event Modal State (Create / Edit)
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    subtitle: string;
    category: 'Festa & Chag' | 'Shabat' | 'Palestra & Curso' | 'Juventude';
    date: string;
    time: string;
    location: string;
    price: number;
    memberPrice?: number;
    youthPrice?: number;
    childPrice?: number;
    hasMealOptions?: boolean;
    meals?: EventMealItem[];
    mealOptions?: string[];
    lunchCount?: number;
    dinnerCount?: number;
    lunchPrice?: number;
    lunchMemberPrice?: number;
    lunchYouthPrice?: number;
    lunchChildPrice?: number;
    dinnerPrice?: number;
    dinnerMemberPrice?: number;
    dinnerYouthPrice?: number;
    dinnerChildPrice?: number;
    description: string;
    image: string;
  }>({
    title: '',
    subtitle: '',
    category: 'Festa & Chag',
    date: '',
    time: '',
    location: 'Beit Chabad Curitiba - Rua Alferes Ângelo Sampaio, 370 (Água Verde)',
    price: 0,
    memberPrice: undefined,
    youthPrice: undefined,
    childPrice: undefined,
    hasMealOptions: false,
    meals: [],
    mealOptions: ['Almoço', 'Jantar'],
    lunchCount: 1,
    dinnerCount: 1,
    lunchPrice: undefined,
    lunchMemberPrice: undefined,
    lunchYouthPrice: undefined,
    lunchChildPrice: undefined,
    dinnerPrice: undefined,
    dinnerMemberPrice: undefined,
    dinnerYouthPrice: undefined,
    dinnerChildPrice: undefined,
    description: '',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000'
  });

  // Add Admin Modal State (for Super Admins)
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('admin');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const role = await getAdminRoleForEmail(user.email);
        if (role) {
          setCurrentUser(user);
          setAdminRole(role);
          setAuthError(null);
          loadData();
        } else {
          // User authenticated with Google but is not in authorized admin list
          setCurrentUser(null);
          setAdminRole(null);
          setAuthError(`Acesso não autorizado para "${user.email}". Apenas e-mails autorizados pela diretoria podem acessar o painel.`);
          await signOutAdmin();
        }
      } else {
        setCurrentUser(null);
        setAdminRole(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Periodic cloud sync
  useEffect(() => {
    if (currentUser && adminRole) {
      const interval = setInterval(() => {
        syncCloudData();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [currentUser, adminRole]);

  const loadData = () => {
    setRsvps(getRsvpRecords());
    setDonations(getDonationRecords());
    setEvents(getCommunityEvents());
    syncCloudData();
  };

  const syncCloudData = async () => {
    setIsSyncing(true);
    try {
      const [remoteRsvps, remoteDons, remoteEvts, remoteAdmins, remoteSubs, remoteSent] = await Promise.all([
        fetchRemoteRsvps(),
        fetchRemoteDonations(),
        fetchRemoteEvents(),
        fetchAuthorizedAdmins(),
        fetchPushSubscribers(),
        fetchSentNotifications()
      ]);
      if (Array.isArray(remoteRsvps)) setRsvps(remoteRsvps);
      if (Array.isArray(remoteDons)) setDonations(remoteDons);
      if (Array.isArray(remoteEvts)) setEvents(remoteEvts);
      if (remoteAdmins) setAdminsList(remoteAdmins);
      if (remoteSubs) setPushSubscribers(remoteSubs);
      if (remoteSent) setSentNotifications(remoteSent);
    } catch (e) {
      console.warn('Cloud sync error in admin:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Quick Templates for Push Notifications
  const handleApplyShabbatTemplate = () => {
    const template = generateShabbatNotificationTemplate();
    setNotifTitle(template.title);
    setNotifBody(template.body);
    setNotifUrl(template.url);
    showNotification('Modelo de Shabat carregado com sucesso!');
  };

  const handleApplyGeneralTemplate = () => {
    setNotifTitle('📢 Comunicado Beit Chabad');
    setNotifBody('Um aviso importante da diretoria do Beit Chabad do Paraná para toda a comunidade.');
    setNotifUrl('/#home');
    showNotification('Modelo de Comunicado carregado.');
  };

  const handleApplyMinyanTemplate = () => {
    setNotifTitle('🕍 Sinagoga & Minian');
    setNotifBody('Lembramos a todos os horários de Shacharit e Minian na Sinagoga Beit Chabad. Esperamos por você!');
    setNotifUrl('/#sinagoga');
    showNotification('Modelo de Sinagoga carregado.');
  };

  // Send Broadcast Notification
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifBody.trim()) {
      setPushFeedback({ type: 'error', message: 'Por favor, preencha o título e a mensagem da notificação.' });
      return;
    }

    setIsSendingPush(true);
    setPushFeedback(null);
    try {
      const result = await broadcastPushNotification({
        title: notifTitle,
        body: notifBody,
        url: notifUrl || '/#home',
        sentBy: currentUser?.displayName || currentUser?.email || 'Administração'
      });

      if (result.success) {
        setPushFeedback({
          type: 'success',
          message: `🎉 Notificação transmitida com sucesso para todos os ${result.count} dispositivo(s) cadastrados!`
        });
        showNotification('🎉 Notificação transmitida com sucesso para todos os dispositivos!');
      } else {
        setPushFeedback({ type: 'error', message: result.error || 'Erro ao enviar notificação.' });
      }
    } catch (err: any) {
      setPushFeedback({ type: 'error', message: err?.message || 'Erro inesperado ao transmitir notificação.' });
    } finally {
      setIsSendingPush(false);
    }
  };

  // Send Local Test Notification
  const handleSendTest = async () => {
    setIsTestingPush(true);
    setPushFeedback(null);
    try {
      const ok = await showLocalSystemNotification(
        notifTitle || '🕯️ Teste Beit Chabad',
        notifBody || 'Esta é uma notificação de teste push!',
        notifUrl || '/#home'
      );
      if (ok) {
        setPushFeedback({
          type: 'success',
          message: '🧪 Notificação de teste disparada com sucesso no seu dispositivo!'
        });
        showNotification('🧪 Notificação de teste disparada com sucesso no seu dispositivo!');
      } else {
        setPushFeedback({
          type: 'error',
          message: 'Permissão de notificação necessária. Permita notificações no seu navegador/celular.'
        });
      }
    } catch (err: any) {
      setPushFeedback({ type: 'error', message: 'Erro ao disparar teste: ' + err?.message });
    } finally {
      setIsTestingPush(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const user = await signInWithGoogle();
      if (user && user.email) {
        const role = await getAdminRoleForEmail(user.email);
        if (role) {
          setCurrentUser(user);
          setAdminRole(role);
          setAuthError(null);
          loadData();
          showNotification(`Bem-vindo, ${user.displayName || user.email}!`);
        } else {
          setAuthError(`Acesso não autorizado para "${user.email}". Apenas e-mails previamente cadastrados pela diretoria podem acessar o painel.`);
          await signOutAdmin();
        }
      }
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      if (error?.code === 'auth/configuration-not-found') {
        setAuthError('O provedor de login Google precisa ser ativado no Firebase Console (Console > Authentication > Sign-in method > Google > Ativar).');
      } else if (error?.code !== 'auth/popup-closed-by-user') {
        setAuthError(error?.message || 'Erro ao realizar login com o Google. Tente novamente.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setCurrentUser(null);
    setAdminRole(null);
  };

  const handleStatusChange = (id: string, newStatus: 'Confirmado' | 'Pendente' | 'Presente') => {
    const updated = updateRsvpStatus(id, newStatus);
    setRsvps(updated);
  };

  const handleDeleteRsvp = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta inscrição?')) {
      const updated = deleteRsvpRecord(id);
      setRsvps(updated);
      showNotification('Inscrição excluída com sucesso.');
    }
  };

  const handleDeleteDonation = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de doação?')) {
      const updated = deleteDonationRecord(id);
      setDonations(updated);
      showNotification('Registro de doação excluído com sucesso.');
    }
  };

  const handleClearAllRsvps = () => {
    if (window.confirm('ATENÇÃO: Deseja apagar TODAS as inscrições de teste/registradas? Esta ação não pode ser desfeita.')) {
      const updated = clearAllRsvps();
      setRsvps(updated);
      showNotification('Todas as inscrições foram limpas.');
    }
  };

  const handleClearAllDonations = () => {
    if (window.confirm('ATENÇÃO: Deseja apagar TODAS as doações registradas? Esta ação não pode ser desfeita.')) {
      const updated = clearAllDonations();
      setDonations(updated);
      showNotification('Todas as doações foram limpas.');
    }
  };

  const handleAddMeal = (type: 'almoco' | 'jantar' | 'outro' = 'almoco') => {
    const mealId = 'meal-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const isLunch = type === 'almoco';
    const isDinner = type === 'jantar';
    const currentMeals = newEvent.meals || [];
    const countOfType = currentMeals.filter(m => m.type === type).length + 1;
    const defaultName = isLunch 
      ? `Almoço (${countOfType}º Dia)`
      : isDinner
      ? `Jantar (${countOfType}º Dia)`
      : `Refeição Especial ${countOfType}`;

    const newMeal: EventMealItem = {
      id: mealId,
      name: defaultName,
      dayOrDate: newEvent.date || '',
      time: isLunch ? '12:30' : isDinner ? '20:00' : '18:00',
      type,
      price: newEvent.price || 0,
      youthPrice: undefined,
      childPrice: undefined,
      memberPrice: undefined
    };

    setNewEvent(prev => ({
      ...prev,
      hasMealOptions: true,
      meals: [...(prev.meals || []), newMeal]
    }));
  };

  const handleAddShabbatPreset = () => {
    const dinnerId = 'meal-' + Date.now() + '-1';
    const lunchId = 'meal-' + Date.now() + '-2';
    const dinnerMeal: EventMealItem = {
      id: dinnerId,
      name: 'Jantar de Shabat (Sexta à Noite)',
      dayOrDate: newEvent.date || 'Sexta-feira',
      time: '20:00',
      type: 'jantar',
      price: 80,
      youthPrice: 50,
      childPrice: 35,
      memberPrice: 70
    };
    const lunchMeal: EventMealItem = {
      id: lunchId,
      name: 'Almoço de Shabat (Sábado ao Meio-Dia)',
      dayOrDate: 'Sábado',
      time: '12:30',
      type: 'almoco',
      price: 60,
      youthPrice: 40,
      childPrice: 25,
      memberPrice: 50
    };

    setNewEvent(prev => ({
      ...prev,
      hasMealOptions: true,
      meals: [...(prev.meals || []), dinnerMeal, lunchMeal]
    }));
  };

  const handleRemoveMeal = (mealId: string) => {
    setNewEvent(prev => ({
      ...prev,
      meals: (prev.meals || []).filter(m => m.id !== mealId)
    }));
  };

  const handleUpdateMeal = (mealId: string, fields: Partial<EventMealItem>) => {
    setNewEvent(prev => ({
      ...prev,
      meals: (prev.meals || []).map(m => m.id === mealId ? { ...m, ...fields } : m)
    }));
  };

  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setNewEvent({
      title: '',
      subtitle: '',
      category: 'Festa & Chag',
      date: '',
      time: '',
      location: 'Beit Chabad Curitiba - Rua Alferes Ângelo Sampaio, 370 (Água Verde)',
      price: 0,
      memberPrice: undefined,
      youthPrice: undefined,
      childPrice: undefined,
      hasMealOptions: false,
      meals: [],
      mealOptions: ['Almoço', 'Jantar'],
      lunchCount: 1,
      dinnerCount: 1,
      lunchPrice: undefined,
      lunchMemberPrice: undefined,
      lunchYouthPrice: undefined,
      lunchChildPrice: undefined,
      dinnerPrice: undefined,
      dinnerMemberPrice: undefined,
      dinnerYouthPrice: undefined,
      dinnerChildPrice: undefined,
      description: '',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000'
    });
    setShowAddEventModal(true);
  };

  const handleOpenEditEvent = (evt: CommunityEvent) => {
    setEditingEventId(evt.id);

    // Normalize meals array if present, or convert legacy meal settings
    let loadedMeals: EventMealItem[] = [];
    if (evt.meals && evt.meals.length > 0) {
      loadedMeals = evt.meals;
    } else if (evt.hasMealOptions) {
      if ((evt.mealOptions || []).includes('Almoço') || evt.lunchPrice !== undefined) {
        const count = evt.lunchCount || 1;
        for (let i = 1; i <= count; i++) {
          loadedMeals.push({
            id: 'legacy-lunch-' + i,
            name: count > 1 ? `Almoço ${i}` : 'Almoço',
            dayOrDate: evt.date || '',
            time: '12:30',
            type: 'almoco',
            price: evt.lunchPrice || 0,
            youthPrice: evt.lunchYouthPrice,
            childPrice: evt.lunchChildPrice,
            memberPrice: evt.lunchMemberPrice
          });
        }
      }
      if ((evt.mealOptions || []).includes('Jantar') || evt.dinnerPrice !== undefined) {
        const count = evt.dinnerCount || 1;
        for (let i = 1; i <= count; i++) {
          loadedMeals.push({
            id: 'legacy-dinner-' + i,
            name: count > 1 ? `Jantar ${i}` : 'Jantar',
            dayOrDate: evt.date || '',
            time: '20:00',
            type: 'jantar',
            price: evt.dinnerPrice || 0,
            youthPrice: evt.dinnerYouthPrice,
            childPrice: evt.dinnerChildPrice,
            memberPrice: evt.dinnerMemberPrice
          });
        }
      }
    }

    setNewEvent({
      title: evt.title,
      subtitle: evt.subtitle || '',
      category: evt.category as any,
      date: evt.date,
      time: evt.time,
      location: evt.location,
      price: evt.price,
      memberPrice: evt.memberPrice !== undefined && evt.memberPrice !== null ? evt.memberPrice : undefined,
      youthPrice: evt.youthPrice !== undefined && evt.youthPrice !== null ? evt.youthPrice : undefined,
      childPrice: evt.childPrice !== undefined && evt.childPrice !== null ? evt.childPrice : undefined,
      hasMealOptions: !!evt.hasMealOptions,
      meals: loadedMeals,
      mealOptions: evt.mealOptions && evt.mealOptions.length > 0 ? evt.mealOptions : ['Almoço', 'Jantar'],
      lunchCount: evt.lunchCount || 1,
      dinnerCount: evt.dinnerCount || 1,
      lunchPrice: evt.lunchPrice !== undefined && evt.lunchPrice !== null ? evt.lunchPrice : undefined,
      lunchMemberPrice: evt.lunchMemberPrice !== undefined && evt.lunchMemberPrice !== null ? evt.lunchMemberPrice : undefined,
      lunchYouthPrice: evt.lunchYouthPrice !== undefined && evt.lunchYouthPrice !== null ? evt.lunchYouthPrice : undefined,
      lunchChildPrice: evt.lunchChildPrice !== undefined && evt.lunchChildPrice !== null ? evt.lunchChildPrice : undefined,
      dinnerPrice: evt.dinnerPrice !== undefined && evt.dinnerPrice !== null ? evt.dinnerPrice : undefined,
      dinnerMemberPrice: evt.dinnerMemberPrice !== undefined && evt.dinnerMemberPrice !== null ? evt.dinnerMemberPrice : undefined,
      dinnerYouthPrice: evt.dinnerYouthPrice !== undefined && evt.dinnerYouthPrice !== null ? evt.dinnerYouthPrice : undefined,
      dinnerChildPrice: evt.dinnerChildPrice !== undefined && evt.dinnerChildPrice !== null ? evt.dinnerChildPrice : undefined,
      description: evt.description || '',
      image: evt.image
    });
    setShowAddEventModal(true);
  };

  const handleCreateOrUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert('Por favor, preencha os campos obrigatórios do evento.');
      return;
    }

    const memberPriceVal = (newEvent.memberPrice !== undefined && newEvent.memberPrice !== null && (newEvent.memberPrice as any) !== '') ? Number(newEvent.memberPrice) : undefined;
    const youthPriceVal = (newEvent.youthPrice !== undefined && newEvent.youthPrice !== null && (newEvent.youthPrice as any) !== '') ? Number(newEvent.youthPrice) : undefined;
    const childPriceVal = (newEvent.childPrice !== undefined && newEvent.childPrice !== null && (newEvent.childPrice as any) !== '') ? Number(newEvent.childPrice) : undefined;
    
    const lunchCountVal = newEvent.lunchCount ? Number(newEvent.lunchCount) : 1;
    const dinnerCountVal = newEvent.dinnerCount ? Number(newEvent.dinnerCount) : 1;

    const lunchPriceVal = (newEvent.lunchPrice !== undefined && newEvent.lunchPrice !== null && (newEvent.lunchPrice as any) !== '') ? Number(newEvent.lunchPrice) : undefined;
    const lunchMemberPriceVal = (newEvent.lunchMemberPrice !== undefined && newEvent.lunchMemberPrice !== null && (newEvent.lunchMemberPrice as any) !== '') ? Number(newEvent.lunchMemberPrice) : undefined;
    const lunchYouthPriceVal = (newEvent.lunchYouthPrice !== undefined && newEvent.lunchYouthPrice !== null && (newEvent.lunchYouthPrice as any) !== '') ? Number(newEvent.lunchYouthPrice) : undefined;
    const lunchChildPriceVal = (newEvent.lunchChildPrice !== undefined && newEvent.lunchChildPrice !== null && (newEvent.lunchChildPrice as any) !== '') ? Number(newEvent.lunchChildPrice) : undefined;

    const dinnerPriceVal = (newEvent.dinnerPrice !== undefined && newEvent.dinnerPrice !== null && (newEvent.dinnerPrice as any) !== '') ? Number(newEvent.dinnerPrice) : undefined;
    const dinnerMemberPriceVal = (newEvent.dinnerMemberPrice !== undefined && newEvent.dinnerMemberPrice !== null && (newEvent.dinnerMemberPrice as any) !== '') ? Number(newEvent.dinnerMemberPrice) : undefined;
    const dinnerYouthPriceVal = (newEvent.dinnerYouthPrice !== undefined && newEvent.dinnerYouthPrice !== null && (newEvent.dinnerYouthPrice as any) !== '') ? Number(newEvent.dinnerYouthPrice) : undefined;
    const dinnerChildPriceVal = (newEvent.dinnerChildPrice !== undefined && newEvent.dinnerChildPrice !== null && (newEvent.dinnerChildPrice as any) !== '') ? Number(newEvent.dinnerChildPrice) : undefined;

    const eventPayload: Partial<CommunityEvent> = {
      title: newEvent.title,
      subtitle: newEvent.subtitle || 'Evento Comunitário Beit Chabad',
      category: newEvent.category,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      price: Number(newEvent.price) || 0,
      memberPrice: memberPriceVal,
      youthPrice: youthPriceVal,
      childPrice: childPriceVal,
      hasMealOptions: newEvent.hasMealOptions,
      meals: newEvent.hasMealOptions ? (newEvent.meals || []) : undefined,
      mealOptions: newEvent.hasMealOptions ? newEvent.mealOptions : undefined,
      lunchCount: newEvent.hasMealOptions ? lunchCountVal : undefined,
      dinnerCount: newEvent.hasMealOptions ? dinnerCountVal : undefined,
      lunchPrice: newEvent.hasMealOptions ? lunchPriceVal : undefined,
      lunchMemberPrice: newEvent.hasMealOptions ? lunchMemberPriceVal : undefined,
      lunchYouthPrice: newEvent.hasMealOptions ? lunchYouthPriceVal : undefined,
      lunchChildPrice: newEvent.hasMealOptions ? lunchChildPriceVal : undefined,
      dinnerPrice: newEvent.hasMealOptions ? dinnerPriceVal : undefined,
      dinnerMemberPrice: newEvent.hasMealOptions ? dinnerMemberPriceVal : undefined,
      dinnerYouthPrice: newEvent.hasMealOptions ? dinnerYouthPriceVal : undefined,
      dinnerChildPrice: newEvent.hasMealOptions ? dinnerChildPriceVal : undefined,
      description: newEvent.description || newEvent.subtitle || newEvent.title,
      image: newEvent.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000'
    };

    if (editingEventId) {
      updateCommunityEvent(editingEventId, eventPayload);
      showNotification(`Evento "${newEvent.title}" atualizado com sucesso no site!`);
    } else {
      saveCommunityEvent(eventPayload as CommunityEvent);
      showNotification('Novo evento criado com sucesso e publicado no site!');
    }

    setEvents(getCommunityEvents());
    setShowAddEventModal(false);
    setEditingEventId(null);
    setNewEvent({
      title: '',
      subtitle: '',
      category: 'Festa & Chag',
      date: '',
      time: '',
      location: 'Beit Chabad Curitiba - Rua Alferes Ângelo Sampaio, 370 (Água Verde)',
      price: 0,
      memberPrice: undefined,
      youthPrice: undefined,
      childPrice: undefined,
      hasMealOptions: false,
      meals: [],
      mealOptions: ['Almoço', 'Jantar'],
      lunchCount: 1,
      dinnerCount: 1,
      lunchPrice: undefined,
      lunchMemberPrice: undefined,
      lunchYouthPrice: undefined,
      lunchChildPrice: undefined,
      dinnerPrice: undefined,
      dinnerMemberPrice: undefined,
      dinnerYouthPrice: undefined,
      dinnerChildPrice: undefined,
      description: '',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000'
    });
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja remover o evento "${title}"?`)) {
      const updated = deleteCommunityEvent(id);
      setEvents(updated);
      showNotification(`Evento "${title}" removido com sucesso.`);
    }
  };

  // Super Admin: Add new authorized admin
  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      alert('Por favor, digite um e-mail válido.');
      return;
    }

    try {
      await saveAuthorizedAdmin({
        email: newAdminEmail.trim(),
        name: newAdminName.trim() || newAdminEmail.split('@')[0],
        role: newAdminRole,
        addedBy: currentUser?.email || 'Super Admin'
      });

      const updated = await fetchAuthorizedAdmins();
      setAdminsList(updated);
      setShowAddAdminModal(false);
      setNewAdminEmail('');
      setNewAdminName('');
      showNotification(`Administrador ${newAdminEmail} adicionado com sucesso!`);
    } catch (err: any) {
      alert(err?.message || 'Erro ao adicionar administrador.');
    }
  };

  // Super Admin: Delete admin
  const handleDeleteAdmin = async (email: string) => {
    if (window.confirm(`Tem certeza que deseja revogar o acesso de ${email}?`)) {
      try {
        await deleteAuthorizedAdmin(email);
        const updated = await fetchAuthorizedAdmins();
        setAdminsList(updated);
        showNotification(`Acesso de ${email} revogado.`);
      } catch (err: any) {
        alert(err?.message || 'Erro ao remover administrador.');
      }
    }
  };

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter(item => {
    const matchesSearch = 
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesEvent = eventFilter === 'all' || item.eventTitle === eventFilter;

    return matchesSearch && matchesStatus && matchesEvent;
  });

  // Filtered Donations
  const filteredDonations = donations.filter(item => {
    return (
      item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hebrewName && item.hebrewName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filtered Events
  const filteredEvents = events.filter(evt => {
    return (
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculations
  const totalRsvpRevenue = rsvps.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const totalRsvpAttendees = rsvps.reduce((acc, curr) => acc + (curr.ticketCount || 1), 0);
  const totalDonationAmount = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Unique Events List
  const uniqueEvents = Array.from(new Set(rsvps.map(r => r.eventTitle)));

  // Helper to trigger file download
  const triggerDownload = (fileName: string, content: string, mimeType = 'text/csv;charset=utf-8;') => {
    const blob = new Blob(['\uFEFF' + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export CSV for RSVPs
  const exportRsvpsToCSV = () => {
    const headers = ['Voucher', 'Evento', 'Nome Completo', 'E-mail', 'Telefone', 'Qtd Ingressos', 'Tipo', 'Refeicoes', 'Valor Total (R$)', 'Status', 'Data/Hora', 'Restricoes Alimentares'];
    const rows = filteredRsvps.map(r => {
      const mealsStr = r.selectedMeals && r.selectedMeals.length > 0 ? r.selectedMeals.join(', ') : 'Geral';
      return [
        `"${(r.ticketCode || '').replace(/"/g, '""')}"`,
        `"${(r.eventTitle || '').replace(/"/g, '""')}"`,
        `"${(r.fullName || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        r.ticketCount,
        `"${(r.ticketType || '').replace(/"/g, '""')}"`,
        `"${mealsStr.replace(/"/g, '""')}"`,
        r.totalPrice.toFixed(2),
        `"${(r.status || '').replace(/"/g, '""')}"`,
        `"${(r.createdAt || '').replace(/"/g, '""')}"`,
        `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const fileName = `inscricoes_chabad_curitiba_${new Date().toISOString().slice(0, 10)}.csv`;
    triggerDownload(fileName, csvContent);
    showNotification('Arquivo CSV baixado com sucesso!');
  };

  // Export CSV for Donations
  const exportDonationsToCSV = () => {
    const headers = ['Doador', 'Nome Hebraico', 'E-mail', 'Valor (R$)', 'Destinacao', 'Status', 'Data/Hora'];
    const rows = filteredDonations.map(d => [
      `"${(d.donorName || '').replace(/"/g, '""')}"`,
      `"${(d.hebrewName || '').replace(/"/g, '""')}"`,
      `"${(d.email || '').replace(/"/g, '""')}"`,
      d.amount.toFixed(2),
      `"${(d.purpose || '').replace(/"/g, '""')}"`,
      `"${(d.status || '').replace(/"/g, '""')}"`,
      `"${(d.createdAt || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const fileName = `doacoes_chabad_curitiba_${new Date().toISOString().slice(0, 10)}.csv`;
    triggerDownload(fileName, csvContent);
    showNotification('Arquivo CSV de doações baixado com sucesso!');
  };

  // ================================================================
  // LOGIN SCREEN (GOOGLE AUTH)
  // ================================================================
  if (!currentUser || !adminRole) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-luxury text-center space-y-6">
          
          <div className="w-16 h-16 rounded-2xl bg-chabad text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-chabad-gold" />
          </div>
          
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-chabad-gold/15 text-chabad-pine border border-chabad-gold/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Autenticação Oficial Google Firebase</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Painel Administrativo
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Beit Chabad do Paraná (Curitiba)
            </p>
          </div>

          {authError && (
            <div className="text-xs text-red-700 bg-red-50 p-3.5 rounded-2xl border border-red-200 text-left flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Acesso Negado</strong>
                <span>{authError}</span>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAuthLoading}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-chabad py-3.5 px-4 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isAuthLoading ? 'Verificando Conta Google...' : 'Continuar com o Google'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center space-x-1.5 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acesso restrito exclusivamente à diretoria e equipe autorizada.</span>
          </div>

        </div>
      </div>
    );
  }

  // Helper for role badge
  const renderRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
            Super Administrador
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
            Administrador Geral
          </span>
        );
      case 'receptionist':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <Ticket className="w-3 h-3 mr-1 text-purple-600" />
            Recepcionista / Portaria
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Bar with User Profile */}
      <div className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-chabad-gold/20 text-chabad-gold border border-chabad-gold/30">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Painel Oficial Beit Chabad Curitiba
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <span>{isSyncing ? 'Sincronizando Nuvem...' : 'Supabase Cloud Ativo'}</span>
            </div>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold">
            Gestão de Eventos, Inscrições & Doações
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Notificações de Inscrições enviadas para: <strong className="text-white underline">{RSVP_ADMIN_EMAIL}</strong> & <strong className="text-white underline">{CHABAD_OFFICIAL_EMAIL}</strong>
          </p>
        </div>

        {/* User Info & Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-sm">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-chabad-gold object-cover shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-chabad-gold text-slate-900 font-bold flex items-center justify-center">
              {currentUser.email?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-left">
            <div className="text-xs font-bold text-white truncate max-w-[180px]">
              {currentUser.displayName || currentUser.email}
            </div>
            <div className="text-[10px] text-emerald-200 truncate max-w-[180px]">
              {currentUser.email}
            </div>
            <div className="mt-0.5">
              {renderRoleBadge(adminRole)}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 pl-2 border-l border-white/20">
            <button
              onClick={loadData}
              disabled={isSyncing}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              title="Atualizar Dados da Nuvem"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-chabad-gold' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center space-x-1"
              title="Sair da Conta Google"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Total Inscrições</div>
            <div className="text-2xl font-extrabold text-slate-900">{rsvps.length}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">{totalRsvpAttendees} participantes</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-chabad-light text-chabad flex items-center justify-center shrink-0">
            <span className="font-bold text-lg">R$</span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Arrecadação Eventos</div>
            <div className="text-2xl font-extrabold text-slate-900">R$ {totalRsvpRevenue.toFixed(2)}</div>
            <div className="text-[11px] text-slate-500 font-medium">PIX Instantâneo</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-amber-700" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Doações Registradas</div>
            <div className="text-2xl font-extrabold text-slate-900">{donations.length}</div>
            <div className="text-[11px] text-amber-700 font-semibold">R$ {totalDonationAmount.toFixed(2)} total</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Eventos Ativos</div>
            <div className="text-2xl font-extrabold text-slate-900">{events.length}</div>
            <div className="text-[11px] text-purple-700 font-semibold">Publicados no site</div>
          </div>
        </div>

      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 px-6 pt-4 bg-slate-50/70 gap-2">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`pb-4 px-4 font-bold text-sm flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'rsvps'
                ? 'border-chabad text-chabad bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Inscrições & Participantes ({rsvps.length})</span>
          </button>

          {adminRole !== 'receptionist' && (
            <>
              <button
                onClick={() => setActiveTab('donations')}
                className={`pb-4 px-4 font-bold text-sm flex items-center space-x-2 border-b-2 transition-all ${
                  activeTab === 'donations'
                    ? 'border-chabad text-chabad bg-white rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Doações Recebidas ({donations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`pb-4 px-4 font-bold text-sm flex items-center space-x-2 border-b-2 transition-all ${
                  activeTab === 'events'
                    ? 'border-chabad text-chabad bg-white rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Gerenciar Eventos ({events.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`pb-4 px-4 font-bold text-sm flex items-center space-x-2 border-b-2 transition-all ${
                  activeTab === 'notifications'
                    ? 'border-amber-500 text-amber-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Notificações Push {pushSubscribers.length > 0 && `(${pushSubscribers.length})`}</span>
              </button>
            </>
          )}

          {adminRole === 'super_admin' && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`pb-4 px-4 font-bold text-sm flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'admins'
                  ? 'border-amber-600 text-amber-900 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-amber-600" />
              <span>Administradores & Cargos</span>
            </button>
          )}
        </div>

        {/* Toolbar: Search, Filters & Export (for RSVPs, Donations, Events, Admins) */}
        {activeTab !== 'notifications' && (
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por termo..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-chabad"
                />
              </div>

              {/* Event Filter (RSVP Tab only) */}
              {activeTab === 'rsvps' && (
                <select
                  value={eventFilter}
                  onChange={e => setEventFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 max-w-xs"
                >
                  <option value="all">Todos os Eventos</option>
                  {uniqueEvents.map((evt, idx) => (
                    <option key={idx} value={evt}>{evt}</option>
                  ))}
                </select>
              )}

              {/* Status Filter */}
              {activeTab === 'rsvps' && (
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
                >
                  <option value="all">Todos os Status</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Presente">Presente (Check-in)</option>
                </select>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto justify-end">
              
              {activeTab === 'admins' && adminRole === 'super_admin' && (
                <button
                  onClick={() => setShowAddAdminModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Administrador</span>
                </button>
              )}

              {activeTab === 'events' && (
                <button
                  onClick={handleOpenCreateEvent}
                  className="bg-chabad hover:bg-chabad-pine text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Novo Evento</span>
                </button>
              )}

              {activeTab === 'rsvps' && (
                <>
                  {adminRole === 'super_admin' && (
                    <button
                      onClick={handleClearAllRsvps}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center space-x-1 transition-all"
                      title="Limpar todos os registros de inscrições"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Limpar Inscrições</span>
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir</span>
                  </button>
                  <button
                    onClick={exportRsvpsToCSV}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                    title="Exportar arquivo CSV compatível com Excel e Google Sheets"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Exportar CSV</span>
                  </button>
                </>
              )}

              {activeTab === 'donations' && (
                <>
                  {adminRole === 'super_admin' && (
                    <button
                      onClick={handleClearAllDonations}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center space-x-1 transition-all"
                      title="Limpar todos os registros de doações"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Limpar Doações</span>
                    </button>
                  )}
                  <button
                    onClick={exportDonationsToCSV}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                    title="Exportar arquivo CSV compatível com Excel e Google Sheets"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Exportar CSV</span>
                  </button>
                </>
              )}

            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 1: RSVPS / INSCRIÇÕES */}
        {/* ================================================================ */}
        {activeTab === 'rsvps' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Voucher</th>
                  <th className="py-3.5 px-4">Inscrito</th>
                  <th className="py-3.5 px-4">Evento</th>
                  <th className="py-3.5 px-4">Ingressos</th>
                  <th className="py-3.5 px-4">Valor PIX</th>
                  <th className="py-3.5 px-4">Comprovante</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRsvps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      Nenhuma inscrição encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredRsvps.map(rsvp => (
                    <tr key={rsvp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-chabad">
                        #{rsvp.ticketCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{rsvp.fullName}</div>
                        <div className="text-[11px] text-slate-500">{rsvp.email}</div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{rsvp.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[200px] truncate">
                        {rsvp.eventTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">{rsvp.ticketCount}x</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[150px]" title={rsvp.ticketType}>
                          ({rsvp.ticketType})
                        </span>
                        {rsvp.selectedMeals && rsvp.selectedMeals.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rsvp.selectedMeals.map((m, idx) => (
                              <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                {m === 'Almoço' ? '☀️ Almoço' : m === 'Jantar' ? '🌙 Jantar' : m}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-700">R$ {rsvp.totalPrice.toFixed(2)}</span>
                      </td>
                      
                      {/* COMPROVANTE VIEWER */}
                      <td className="py-3.5 px-4">
                        {rsvp.receiptUrl ? (
                          <button
                            type="button"
                            onClick={() => setViewingReceipt(rsvp)}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-all shadow-xs"
                            title="Visualizar Comprovante do PIX"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Ver Anexo</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Sem comprovante</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          rsvp.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' :
                          rsvp.status === 'Presente' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {rsvp.status === 'Confirmado' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {rsvp.status === 'Presente' && <Check className="w-3 h-3 mr-1" />}
                          {rsvp.status === 'Pendente' && <Clock className="w-3 h-3 mr-1" />}
                          {rsvp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {rsvp.status !== 'Confirmado' && (
                            <button
                              onClick={() => handleStatusChange(rsvp.id, 'Confirmado')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                              title="Marcar como Confirmado"
                            >
                              Confirmar
                            </button>
                          )}
                          {rsvp.status !== 'Presente' && (
                            <button
                              onClick={() => handleStatusChange(rsvp.id, 'Presente')}
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold"
                              title="Marcar presença no evento (Check-in)"
                            >
                              Presente
                            </button>
                          )}
                          {adminRole !== 'receptionist' && (
                            <button
                              onClick={() => handleDeleteRsvp(rsvp.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              title="Excluir Inscrição"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: DOACES */}
        {/* ================================================================ */}
        {activeTab === 'donations' && adminRole !== 'receptionist' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Doador</th>
                  <th className="py-3.5 px-4">Nome Hebraico</th>
                  <th className="py-3.5 px-4">Destinação / Campanha</th>
                  <th className="py-3.5 px-4">Valor</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Nenhuma doação encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map(don => (
                    <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{don.donorName}</div>
                        <div className="text-[11px] text-slate-500">{don.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-serif text-slate-700">
                        {don.hebrewName || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {don.purpose}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        R$ {don.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {don.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {don.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteDonation(don.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Excluir Doação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: GERENCIAR EVENTOS */}
        {/* ================================================================ */}
        {activeTab === 'events' && adminRole !== 'receptionist' && (
          <div className="p-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50/70 rounded-3xl border border-dashed border-slate-300">
                <div className="w-14 h-14 rounded-2xl bg-chabad/10 text-chabad flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Nenhum evento cadastrado</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                  Não há eventos ativos no momento. Clique no botão abaixo para cadastrar um novo evento com formulário de inscrições e PIX no site oficial.
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreateEvent}
                  className="bg-chabad hover:bg-chabad-pine text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Novo Evento</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(evt => (
                  <div key={evt.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                    <div>
                      <div className="relative">
                        <img src={evt.image} alt={evt.title} className="w-full h-44 object-cover" />
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-emerald-800 shadow-sm">
                          {evt.price === 0 ? 'Gratuito' : `R$ ${evt.price.toFixed(2)}`}
                        </span>
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-chabad text-white shadow-sm">
                          {evt.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{evt.title}</h4>
                        {evt.subtitle && (
                          <p className="text-xs text-chabad font-medium line-clamp-1">{evt.subtitle}</p>
                        )}
                        <p className="text-xs text-slate-500 line-clamp-2">{evt.description}</p>
                        
                        <div className="pt-2.5 text-[11px] text-slate-600 space-y-1.5 border-t border-slate-200">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-chabad shrink-0" />
                            <span className="font-medium">{evt.date} às {evt.time}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-chabad shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>No Ar</span>
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditEvent(evt)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-chabad hover:text-chabad-dark bg-chabad/10 hover:bg-chabad/20 rounded-lg transition-colors flex items-center space-x-1"
                          title="Editar detalhes do evento"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(evt.id, evt.title)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-1"
                          title="Excluir evento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: ADMINISTRADORES & CARGOS (SUPER ADMIN ONLY) */}
        {/* ================================================================ */}
        {activeTab === 'admins' && adminRole === 'super_admin' && (
          <div className="p-6 space-y-6">
            
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Gestão de Permissões e Acessos Google</strong>
                Apenas e-mails Google (@gmail.com ou Google Workspace) cadastrados abaixo têm permissão para entrar neste Painel Administrativo.
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Administrador</th>
                    <th className="py-3.5 px-4">E-mail Google</th>
                    <th className="py-3.5 px-4">Cargo / Nível</th>
                    <th className="py-3.5 px-4">Origem / Adicionado Por</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  
                  {/* Permanent Super Admins */}
                  {HARDCODED_SUPER_ADMINS.map((email, idx) => (
                    <tr key={`perm-${idx}`} className="bg-amber-50/30">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>{email.split('@')[0]}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {email}
                      </td>
                      <td className="py-3.5 px-4">
                        {renderRoleBadge('super_admin')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
                          Principal (Permanente)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400 text-[11px] italic">
                        Protegido
                      </td>
                    </tr>
                  ))}

                  {/* Dynamic Admins */}
                  {adminsList
                    .filter(a => !HARDCODED_SUPER_ADMINS.map(e => e.toLowerCase()).includes(a.email.toLowerCase()))
                    .map(adm => (
                      <tr key={adm.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {adm.name || adm.email.split('@')[0]}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-800">
                          {adm.email}
                        </td>
                        <td className="py-3.5 px-4">
                          {renderRoleBadge(adm.role)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          Adicionado por {adm.addedBy || 'Super Admin'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(adm.email)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Revogar Permissão"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: NOTIFICAÇÕES PUSH (FCM & WEB PUSH BROADCAST) */}
        {/* ================================================================ */}
        {activeTab === 'notifications' && (
          <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            
            {/* Top Overview Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white p-6 rounded-3xl border border-amber-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Radio className="w-3.5 h-3.5 mr-1.5 animate-pulse text-amber-400" />
                    Transmissão Push em Tempo Real
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Smartphone className="w-3 h-3 mr-1" />
                    Android App (TWA) + Web Browsers
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
                  Central de Avisos & Horários de Shabat
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Envie alertas instantâneos que tocam e vibram nos celulares dos membros da comunidade, mesmo com o aplicativo fechado ou a tela bloqueada. 100% gratuito via Firebase Cloud Messaging & Web Push.
                </p>
              </div>

              {/* Live Subscribers Counter Badge */}
              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-center shrink-0 w-full sm:w-auto">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Dispositivos Conectados
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1 flex items-center justify-center gap-2">
                  <BellRing className="w-6 h-6 text-amber-400" />
                  <span>{Math.max(pushSubscribers.length, 1)}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Receptores ativos na nuvem
                </div>
              </div>
            </div>

            {/* Quick Templates Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Modelos Rápidos de Notificação (1-Clique)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleApplyShabbatTemplate}
                  className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-left transition-all group flex flex-col justify-between space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-600" />
                      🕯️ Alerta de Shabat
                    </span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      Automático
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 line-clamp-2">
                    Carrega automaticamente o horário de velas da semana de Curitiba.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={handleApplyMinyanTemplate}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group flex flex-col justify-between space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      🕍 Sinagoga & Minian
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                      Tefilot
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    Lembrete de horários de Shacharit e orações na Sinagoga.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={handleApplyGeneralTemplate}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group flex flex-col justify-between space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-purple-600" />
                      📢 Comunicado Geral
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                      Diretoria
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    Aviso institucional ou mensagem especial para a comunidade.
                  </p>
                </button>
              </div>
            </div>

            {/* Main Form & Live Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Notification Creator Form */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    Compor Notificação Push
                  </h4>
                  <span className="text-xs text-slate-400">Campos personalizáveis</span>
                </div>

                <form onSubmit={handleSendBroadcast} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Título da Notificação *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 🕯️ Shabat Shalom! Horário das Velas"
                      value={notifTitle}
                      onChange={e => setNotifTitle(e.target.value)}
                      maxLength={65}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Aparece em negrito no topo da notificação</span>
                      <span>{notifTitle.length}/65 caracteres</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Mensagem / Conteúdo *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Ex: Acendimento das velas hoje em Curitiba às 17:49. Shabat Shalom a todos!"
                      value={notifBody}
                      onChange={e => setNotifBody(e.target.value)}
                      maxLength={200}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Corpo da notificação exibido no celular</span>
                      <span>{notifBody.length}/200 caracteres</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Link ao Clicar (Destino)
                    </label>
                    <select
                      value={notifUrl}
                      onChange={e => setNotifUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="/#home">Página Inicial / Horários de Shabat (/#home)</option>
                      <option value="/#sinagoga">Sinagoga & Horários de Tefilá (/#sinagoga)</option>
                      <option value="/#kitov">KiTov Culinária Casher (/#kitov)</option>
                      <option value="/#ganenu">Ganênu Educação Infantil (/#ganenu)</option>
                      <option value="/#biblioteca">Biblioteca Judaica (/#biblioteca)</option>
                      <option value="/#fale-conosco">Fale Conosco / WhatsApp (/#fale-conosco)</option>
                    </select>
                  </div>

                  {/* Inline Status Feedback Banner */}
                  {pushFeedback && (
                    <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200 ${
                      pushFeedback.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                        : 'bg-red-50 text-red-800 border border-red-300'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {pushFeedback.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span>{pushFeedback.message}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setPushFeedback(null)} 
                        className="text-slate-400 hover:text-slate-700 ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleSendTest}
                      disabled={isTestingPush}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
                      title="Dispara um teste real neste navegador agora"
                    >
                      <Volume2 className="w-4 h-4 text-slate-600" />
                      <span>{isTestingPush ? 'Testando...' : '🧪 Testar no Meu Dispositivo'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSendingPush}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg hover:shadow-amber-500/25 transition-all flex items-center space-x-2 active:scale-95 disabled:opacity-50"
                    >
                      {isSendingPush ? (
                        <span className="inline-block animate-spin mr-1">⏳</span>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Transmitir para Todos os Dispositivos</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Android / Web Phone Preview */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      Pré-visualização no Celular
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Tela de Bloqueio
                    </span>
                  </div>

                  {/* Smartphone Frame Mockup */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
                    
                    {/* Screen Speaker / Camera notch */}
                    <div className="w-24 h-4 bg-black rounded-full mx-auto mb-4"></div>

                    {/* Lock Screen Time */}
                    <div className="text-center text-white/90 my-3">
                      <div className="text-3xl font-light font-sans tracking-tight">
                        {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                    </div>

                    {/* Android Push Notification Card Mockup */}
                    <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/80 shadow-lg text-white space-y-2 mt-4 animate-in fade-in duration-300">
                      
                      {/* Notification Header */}
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <img
                            src="/icons/icon-192.png"
                            alt="Logo"
                            className="w-4 h-4 rounded-md object-contain bg-chabad-dark"
                          />
                          <span className="font-bold text-amber-400">Chabad PR</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[10px]">agora</span>
                        </div>
                        <Bell className="w-3 h-3 text-slate-400" />
                      </div>

                      {/* Notification Title & Body */}
                      <div className="space-y-0.5 pl-0.5">
                        <div className="font-bold text-xs text-white line-clamp-1">
                          {notifTitle || '🕯️ Título da Notificação'}
                        </div>
                        <div className="text-[11px] text-slate-200 leading-relaxed line-clamp-3">
                          {notifBody || 'Sua mensagem aparecerá aqui em tempo real...'}
                        </div>
                      </div>

                      {/* Action Pill */}
                      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-end">
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          Toque para abrir no App
                        </span>
                      </div>
                    </div>

                    {/* Home bar indicator */}
                    <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-6 mb-1"></div>

                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ================================================================ */}
      {/* MODAL: ADD ADMIN (SUPER ADMIN ONLY) */}
      {/* ================================================================ */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Adicionar Novo Administrador</h3>
              </div>
              <button 
                onClick={() => setShowAddAdminModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  E-mail Google da Pessoa *
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@gmail.com"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  A pessoa usará este e-mail para fazer login pelo botão Google.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nome / Identificação
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rabino Mendy, Secretaria Chabad..."
                  value={newAdminName}
                  onChange={e => setNewAdminName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Cargo & Permissão *
                </label>
                <select
                  value={newAdminRole}
                  onChange={e => setNewAdminRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad bg-white"
                >
                  <option value="admin">Administrador Geral (Eventos, Inscrições, Doações)</option>
                  <option value="super_admin">Super Administrador (Acesso Total + Gestão de Admins)</option>
                  <option value="receptionist">Recepcionista / Portaria (Check-in de Ingressos)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Autorizar Acesso</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: ADD / EDIT EVENT */}
      {/* ================================================================ */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-chabad/10 text-chabad flex items-center justify-center">
                  {editingEventId ? <Edit3 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingEventId ? 'Editar Evento Comunitário' : 'Criar Novo Evento Comunitário'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setShowAddEventModal(false);
                  setEditingEventId(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Título do Evento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Grande Seder Comunitário de Pessach 5786"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Subtítulo / Chamada
                </label>
                <input
                  type="text"
                  placeholder="Ex: Uma noite inesquecível de libertação, tradição e alegria"
                  value={newEvent.subtitle}
                  onChange={e => setNewEvent({ ...newEvent, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad bg-white"
                  >
                    <option value="Festa & Chag">Festa & Chag</option>
                    <option value="Shabat">Shabat</option>
                    <option value="Palestra & Curso">Palestra & Curso</option>
                    <option value="Juventude">Juventude</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Data *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 14 de Nissan (Quarta-feira)"
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Horário *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 19:30"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Salão Social Beit Chabad"
                    value={newEvent.location}
                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Geral (R$) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newEvent.price}
                    onChange={e => setNewEvent({ ...newEvent, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Membro (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Sem opção"
                    value={newEvent.memberPrice !== undefined && newEvent.memberPrice !== null ? newEvent.memberPrice : ''}
                    onChange={e => setNewEvent({ 
                      ...newEvent, 
                      memberPrice: e.target.value === '' ? undefined : Number(e.target.value) 
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Jovem (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Sem opção"
                    value={newEvent.youthPrice !== undefined && newEvent.youthPrice !== null ? newEvent.youthPrice : ''}
                    onChange={e => setNewEvent({ 
                      ...newEvent, 
                      youthPrice: e.target.value === '' ? undefined : Number(e.target.value) 
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Criança (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Sem opção"
                    value={newEvent.childPrice !== undefined && newEvent.childPrice !== null ? newEvent.childPrice : ''}
                    onChange={e => setNewEvent({ 
                      ...newEvent, 
                      childPrice: e.target.value === '' ? undefined : Number(e.target.value) 
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>
              </div>

              {/* Custom Multi-Day / Scheduled Meals Configuration */}
              <div className="p-4 sm:p-5 bg-amber-50/70 rounded-3xl border border-amber-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!newEvent.hasMealOptions}
                      onChange={e => {
                        const checked = e.target.checked;
                        setNewEvent(prev => ({
                          ...prev,
                          hasMealOptions: checked,
                          meals: checked 
                            ? ((prev.meals && prev.meals.length > 0) 
                                ? prev.meals 
                                : [
                                    {
                                      id: 'meal-' + Date.now() + '-1',
                                      name: 'Jantar Comunitário',
                                      dayOrDate: prev.date || '',
                                      time: '20:00',
                                      type: 'jantar',
                                      price: prev.price || 0
                                    }
                                  ])
                            : []
                        }));
                      }}
                      className="w-4 h-4 text-chabad rounded border-slate-300 focus:ring-chabad accent-chabad"
                    />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      🍽️ Este evento inclui programação de refeições (Almoço / Jantar por dia e valor)
                    </span>
                  </label>
                  {newEvent.hasMealOptions && (
                    <span className="text-xs font-bold text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                      {(newEvent.meals || []).length} refeição(ões)
                    </span>
                  )}
                </div>

                {newEvent.hasMealOptions && (
                  <div className="space-y-4 pt-1">
                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60">
                      <span className="text-[11px] font-bold text-slate-600 mr-1">
                        + Adicionar Rápido:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddMeal('jantar')}
                        className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1"
                      >
                        <span>🌙 + Jantar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddMeal('almoco')}
                        className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1"
                      >
                        <span>☀️ + Almoço</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAddShabbatPreset}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1"
                      >
                        <span>🕯️ + Shabat Completo (Jantar + Almoço)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddMeal('outro')}
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all"
                      >
                        <span>🍽️ + Outra Refeição</span>
                      </button>
                    </div>

                    {/* Meal Cards List */}
                    <div className="space-y-3.5">
                      {(newEvent.meals || []).map((meal, index) => (
                        <div
                          key={meal.id || index}
                          className="bg-white p-4 rounded-2xl border border-amber-300/80 shadow-xs space-y-3 relative transition-all"
                        >
                          {/* Top Row: Title, Type & Delete */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2 flex-1 w-full sm:w-auto">
                              <select
                                value={meal.type || 'almoco'}
                                onChange={e => handleUpdateMeal(meal.id, { type: e.target.value as any })}
                                className="text-xs font-bold px-2 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 focus:ring-2 focus:ring-chabad"
                              >
                                <option value="almoco">☀️ Almoço</option>
                                <option value="jantar">🌙 Jantar</option>
                                <option value="outro">🍽️ Especial / Outro</option>
                              </select>

                              <input
                                type="text"
                                required
                                placeholder="Nome da Refeição (ex: 1º Jantar de Shabat, Almoço de Sábado...)"
                                value={meal.name}
                                onChange={e => handleUpdateMeal(meal.id, { name: e.target.value })}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-chabad"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveMeal(meal.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center"
                              title="Remover refeição"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Middle Row: Day/Date & Time */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Dia / Data da Refeição *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Ex: Sexta-feira, 22/09 ou 22/09/2026"
                                value={meal.dayOrDate}
                                onChange={e => handleUpdateMeal(meal.id, { dayOrDate: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-chabad"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Horário Previsto
                              </label>
                              <input
                                type="text"
                                placeholder="Ex: 20:00 ou 12:30"
                                value={meal.time || ''}
                                onChange={e => handleUpdateMeal(meal.id, { time: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-chabad"
                              />
                            </div>
                          </div>

                          {/* Bottom Row: Tiered Prices */}
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1.5">
                              Valores desta Refeição (R$ por pessoa)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Geral / Adulto *
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  required
                                  placeholder="0 (Grátis)"
                                  value={meal.price !== undefined && meal.price !== null ? meal.price : ''}
                                  onChange={e => handleUpdateMeal(meal.id, {
                                    price: e.target.value === '' ? 0 : Number(e.target.value)
                                  })}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-chabad font-bold text-slate-900"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Jovem (Opcional)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Igual geral"
                                  value={meal.youthPrice !== undefined && meal.youthPrice !== null ? meal.youthPrice : ''}
                                  onChange={e => handleUpdateMeal(meal.id, {
                                    youthPrice: e.target.value === '' ? undefined : Number(e.target.value)
                                  })}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-chabad text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Kids / Criança
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Igual geral"
                                  value={meal.childPrice !== undefined && meal.childPrice !== null ? meal.childPrice : ''}
                                  onChange={e => handleUpdateMeal(meal.id, {
                                    childPrice: e.target.value === '' ? undefined : Number(e.target.value)
                                  })}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-chabad text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Membro (Opcional)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Sem desconto"
                                  value={meal.memberPrice !== undefined && meal.memberPrice !== null ? meal.memberPrice : ''}
                                  onChange={e => handleUpdateMeal(meal.id, {
                                    memberPrice: e.target.value === '' ? undefined : Number(e.target.value)
                                  })}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-chabad text-slate-800"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!newEvent.meals || newEvent.meals.length === 0) && (
                        <div className="p-4 bg-white/70 rounded-2xl border border-dashed border-amber-300 text-center space-y-2">
                          <p className="text-xs text-amber-900 font-semibold">
                            Nenhuma refeição cadastrada ainda.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAddMeal('jantar')}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                          >
                            + Adicionar Primeira Refeição
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  URL da Imagem de Capa
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newEvent.image}
                  onChange={e => setNewEvent({ ...newEvent, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Descrição Completa
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalhes sobre a programação, palestrantes, buffet kasher, etc."
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEventModal(false);
                    setEditingEventId(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-chabad hover:bg-chabad-pine text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingEventId ? 'Salvar Alterações' : 'Salvar e Publicar Evento'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: RECEIPT VIEWER LIGHTBOX */}
      {/* ================================================================ */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Comprovante de PIX • Voucher #{viewingReceipt.ticketCode}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {viewingReceipt.eventTitle} • {viewingReceipt.fullName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-center">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Inscrito:</span>
                  <span className="font-semibold text-slate-900 truncate block">{viewingReceipt.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Ingressos:</span>
                  <span className="font-semibold text-slate-900 truncate block">{viewingReceipt.ticketCount}x ({viewingReceipt.ticketType})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Valor PIX:</span>
                  <span className="font-black text-emerald-700">R$ {viewingReceipt.totalPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Data do Registro:</span>
                  <span className="font-medium text-slate-700">{viewingReceipt.createdAt}</span>
                </div>
              </div>

              {viewingReceipt.selectedMeals && viewingReceipt.selectedMeals.length > 0 && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-left flex items-center space-x-2">
                  <span className="font-bold text-amber-900 text-[11px] uppercase">Refeições Selecionadas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingReceipt.selectedMeals.map((m, idx) => (
                      <span key={idx} className="bg-white text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-300 text-[11px]">
                        {m === 'Almoço' ? '☀️ Almoço' : m === 'Jantar' ? '🌙 Jantar' : m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewingReceipt.receiptUrl ? (
                <div className="bg-slate-900/5 p-3 rounded-2xl border border-slate-200 inline-block max-w-full">
                  {viewingReceipt.receiptUrl.startsWith('data:image') || viewingReceipt.receiptUrl.startsWith('http') ? (
                    <img
                      src={viewingReceipt.receiptUrl}
                      alt="Comprovante de Transferência"
                      className="max-h-[50vh] max-w-full rounded-xl mx-auto object-contain shadow-md"
                    />
                  ) : (
                    <div className="p-8 text-center space-y-3">
                      <FileText className="w-16 h-16 text-slate-400 mx-auto" />
                      <div className="text-sm font-semibold text-slate-700">Documento PDF / Arquivo Anexado</div>
                      <a
                        href={viewingReceipt.receiptUrl}
                        download={`comprovante-${viewingReceipt.ticketCode}.pdf`}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-800"
                      >
                        <Download className="w-4 h-4" />
                        <span>Baixar Documento</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-slate-400 text-xs italic">
                  Nenhum comprovante anexado.
                </div>
              )}

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <a
                href={`https://wa.me/${viewingReceipt.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${viewingReceipt.fullName}, recebemos o seu comprovante para a inscrição no evento "${viewingReceipt.eventTitle}" no Beit Chabad Curitiba (Voucher #${viewingReceipt.ticketCode}).`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Conversar no WhatsApp</span>
              </a>

              <div className="flex items-center space-x-2">
                {viewingReceipt.status !== 'Confirmado' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(viewingReceipt.id, 'Confirmado');
                      setViewingReceipt({ ...viewingReceipt, status: 'Confirmado' });
                      showNotification(`Voucher #${viewingReceipt.ticketCode} marcado como Confirmado!`);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aprovar & Confirmar Voucher</span>
                  </button>
                )}

                {viewingReceipt.status !== 'Presente' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(viewingReceipt.id, 'Presente');
                      setViewingReceipt({ ...viewingReceipt, status: 'Presente' });
                      showNotification(`Voucher #${viewingReceipt.ticketCode} - Presença confirmada no evento!`);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Fazer Check-in (Presente)</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
