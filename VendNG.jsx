import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle, Package, Users, TrendingUp, Send, Search, Filter, Eye, Camera, Upload, X, Wifi, WifiOff, Settings, CheckCircle, ArrowRight, Smartphone, Store, Zap, BarChart3, Shield, Phone, Lock } from 'lucide-react';

const VendNG = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [activeTab, setActiveTab] = useState('orders');
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [whatsappDetected, setWhatsappDetected] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState(null);
  const [verificationStep, setVerificationStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [businessProfile, setBusinessProfile] = useState(null);
  const [onboardingData, setOnboardingData] = useState({
    businessName: '',
    phoneNumber: '',
    category: '',
    description: '',
    profileImage: ''
  });
  const [apiConfig, setApiConfig] = useState({
    phoneNumberId: '',
    accessToken: '',
    webhookToken: '',
    businessAccountId: ''
  });
  const [showApiSetup, setShowApiSetup] = useState(false);
  
  const [orders, setOrders] = useState([
    {
      id: '001',
      customer: 'Adunni Okafor',
      phone: '+234 801 234 5678',
      items: [{ name: 'Ankara Fabric', quantity: 3, price: 2500 }],
      total: 7500,
      status: 'pending',
      timestamp: '2 hours ago',
      lastMessage: 'Please confirm the delivery address'
    },
    {
      id: '002',
      customer: 'Emeka Johnson',
      phone: '+234 803 987 6543',
      items: [{ name: 'Leather Bag', quantity: 1, price: 8000 }, { name: 'Wallet', quantity: 2, price: 3000 }],
      total: 14000,
      status: 'confirmed',
      timestamp: '5 hours ago',
      lastMessage: 'Payment confirmed via transfer'
    },
    {
      id: '003',
      customer: 'Fatima Ibrahim',
      phone: '+234 807 555 1234',
      items: [{ name: 'Traditional Beads', quantity: 5, price: 1200 }],
      total: 6000,
      status: 'delivered',
      timestamp: '1 day ago',
      lastMessage: 'Thank you! Very beautiful beads'
    }
  ]);

  const [products, setProducts] = useState([
    { id: 1, name: 'Ankara Fabric', price: 2500, stock: 15, category: 'Textiles', image: '🧵' },
    { id: 2, name: 'Leather Bag', price: 8000, stock: 8, category: 'Accessories', image: '👜' },
    { id: 3, name: 'Traditional Beads', price: 1200, stock: 25, category: 'Jewelry', image: '📿' },
    { id: 4, name: 'Kente Scarf', price: 3500, stock: 12, category: 'Textiles', image: '🧣' },
    { id: 5, name: 'Wooden Sculpture', price: 15000, stock: 3, category: 'Art', image: '🗿' }
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', image: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const detectWhatsAppBusiness = async () => {
    try {
      const webDetected = await checkWhatsAppWeb();
      const appDetected = await checkWhatsAppBusinessApp();
      
      if (webDetected || appDetected) {
        setWhatsappDetected(true);
        setDetectionMethod('auto');
        if (webDetected) {
          await fetchBusinessProfileFromWeb();
        }
      } else {
        setDetectionMethod('manual');
      }
    } catch (error) {
      console.log('WhatsApp detection failed:', error);
      setDetectionMethod('manual');
    }
  };

  const checkWhatsAppWeb = async () => {
    try {
      return new Promise((resolve) => {
        const hasWebSession = localStorage.getItem('whatsapp-web-session') || 
                             document.cookie.includes('whatsapp_web') ||
                             window.navigator.userAgent.includes('WhatsApp');
        setTimeout(() => resolve(hasWebSession), 1000);
      });
    } catch (error) {
      return false;
    }
  };

  const checkWhatsAppBusinessApp = async () => {
    try {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) return false;
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(false), 2000);
        const link = document.createElement('a');
        link.href = 'whatsapp-business://';
        link.style.display = 'none';
        document.body.appendChild(link);
        
        const handleVisibilityChange = () => {
          if (document.hidden) {
            clearTimeout(timeout);
            resolve(true);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      return false;
    }
  };

  const fetchBusinessProfileFromWeb = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockProfile = {
      name: 'Lagos Fashion Hub',
      phone: '+234 803 123 4567',
      category: 'Fashion & Style',
      description: 'Premium African fashion and accessories. Quality fabrics, custom designs, nationwide delivery.',
      profileImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiMyMmM1NWUiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TEY8L3RleHQ+Cjwvc3ZnPgo=',
      verified: true,
      followers: 2847
    };

    setBusinessProfile(mockProfile);
    setPhoneNumber(mockProfile.phone);
  };

  const sendVerificationCode = async (phone) => {
    try {
      const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
      if (!cleanPhone.match(/^234[0-9]{10}$/)) {
        alert('Please enter a valid Nigerian phone number (+234xxxxxxxxxx)');
        return false;
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      console.log(`Verification code for ${phone}: ${code}`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Verification code sent to ${phone}. Check your messages! (Demo code: ${code})`);
      setVerificationStep('code');
      return true;
    } catch (error) {
      alert('Failed to send verification code. Please try again.');
      return false;
    }
  };

  const verifyCode = async () => {
    if (verificationCode === generatedCode) {
      setVerificationStep('confirmed');
      await fetchBusinessProfile();
      setTimeout(() => {
        setCurrentStep('setup');
      }, 1500);
      return true;
    } else {
      alert('Invalid verification code. Please try again.');
      return false;
    }
  };

  const fetchBusinessProfile = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockProfile = {
        name: `Business ${phoneNumber.slice(-4)}`,
        phone: phoneNumber,
        category: 'General',
        description: 'Welcome to our business! We provide quality products and services.',
        profileImage: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiMyMmM1NWUiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VE48L3RleHQ+Cjwvc3ZnPgo=`,
        verified: false,
        followers: 0
      };

      setBusinessProfile(mockProfile);
      setOnboardingData({
        businessName: mockProfile.name,
        phoneNumber: mockProfile.phone,
        category: mockProfile.category,
        description: mockProfile.description,
        profileImage: mockProfile.profileImage
      });
    } catch (error) {
      console.error('Failed to fetch business profile:', error);
    }
  };

  const completeOnboarding = () => {
    setCurrentStep('dashboard');
    setWhatsappConnected(true);
  };

  useEffect(() => {
    if (currentStep === 'welcome') {
      detectWhatsAppBusiness();
    }
  }, [currentStep]);

  const connectWhatsApp = async () => {
    try {
      if (!apiConfig.phoneNumberId || !apiConfig.accessToken) {
        alert('Please provide Phone Number ID and Access Token');
        return;
      }

      const response = await fetch(`https://graph.facebook.com/v18.0/${apiConfig.phoneNumberId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiConfig.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setWhatsappConnected(true);
        setShowApiSetup(false);
        alert('WhatsApp Business API connected successfully!');
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      alert('Connection failed. Please check your credentials.');
      console.error('WhatsApp API connection error:', error);
    }
  };

  const sendWhatsAppMessage = async (phoneNumber, message, productData = null) => {
    if (!whatsappConnected) {
      alert('Please connect WhatsApp Business API first');
      return;
    }

    try {
      const messagePayload = {
        messaging_product: "whatsapp",
        to: phoneNumber.replace('+', ''),
        type: productData ? "template" : "text",
      };

      if (productData) {
        messagePayload.template = {
          name: "product_showcase",
          language: { code: "en" },
          components: [{
            type: "body",
            parameters: [
              { type: "text", text: productData.name },
              { type: "text", text: `₦${productData.price.toLocaleString()}` }
            ]
          }]
        };
      } else {
        messagePayload.text = { body: message };
      }

      const response = await fetch(`https://graph.facebook.com/v18.0/${apiConfig.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagePayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Message sent successfully:', result);
        return result;
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      alert('Failed to send message');
    }
  };

  const shareProductOnWhatsApp = async (product) => {
    const message = `🛍️ *${product.name}*\n\n💰 Price: ₦${product.price.toLocaleString()}\n📦 In Stock: ${product.stock} units\n🏷️ Category: ${product.category}\n\n📱 Order now via WhatsApp!`;
    
    if (whatsappConnected) {
      alert('Product shared to WhatsApp broadcast list!');
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      setProducts([...products, {
        id: products.length + 1,
        ...newProduct,
        price: parseInt(newProduct.price),
        stock: parseInt(newProduct.stock),
        image: previewImage || '📦'
      }]);
      setNewProduct({ name: '', price: '', stock: '', category: '', image: '' });
      setPreviewImage(null);
      setShowAddProduct(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
        setNewProduct({...newProduct, image: event.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setNewProduct({...newProduct, image: ''});
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const lowStockItems = products.filter(product => product.stock < 5).length;

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Vend NG
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your WhatsApp into a powerful business tool. Manage orders, track inventory, 
              and grow your Nigerian business with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Smartphone className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Integration</h3>
              <p className="text-gray-600 text-sm">Connect your existing WhatsApp Business and sync all your conversations</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Store className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Management</h3>
              <p className="text-gray-600 text-sm">Organize your inventory, upload photos, and share products instantly</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sales Analytics</h3>
              <p className="text-gray-600 text-sm">Track your revenue, monitor orders, and grow your business</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border max-w-md mx-auto">
            <div className="mb-6">
              {whatsappDetected ? (
                <div className="flex items-center justify-center gap-3 text-green-600 mb-4">
                  <CheckCircle size={24} />
                  <span className="font-medium">WhatsApp Business Detected!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 text-blue-600 mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="font-medium">Scanning for WhatsApp Business...</span>
                </div>
              )}

              {businessProfile && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={businessProfile.profileImage} 
                      alt="Business Profile" 
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">{businessProfile.name}</h4>
                      <p className="text-sm text-gray-600">{businessProfile.phone}</p>
                      {businessProfile.verified && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle size={14} className="text-blue-500" />
                          <span className="text-xs text-blue-600">Verified Business</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{businessProfile.description}</p>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>{businessProfile.category}</span>
                    <span>{businessProfile.followers} followers</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {whatsappDetected && businessProfile ? (
                <button
                  onClick={() => setCurrentStep('verify')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Zap size={20} />
                  Connect & Setup Vend NG
                  <ArrowRight size={16} />
                </button>
              ) : whatsappDetected ? (
                <button
                  onClick={() => setCurrentStep('verify')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Verify & Setup
                  <ArrowRight size={16} />
                </button>
              ) : detectionMethod === 'manual' ? (
                <button
                  onClick={() => setCurrentStep('verify')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Phone size={20} />
                  Add WhatsApp Number
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                >
                  Scanning for WhatsApp Business...
                </button>
              )}

              <button
                onClick={() => setCurrentStep('verify')}
                className="w-full py-2 px-6 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Manual Setup
              </button>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>🇳🇬 Built specifically for Nigerian entrepreneurs</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'verify') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-4">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your WhatsApp Business</h1>
            <p className="text-gray-600">We need to verify your WhatsApp Business number to prevent unauthorized access</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-6">
            {verificationStep === 'phone' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <Shield size={20} />
                    <span className="font-medium">Security First</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    We'll send a verification code to your WhatsApp Business number to ensure you own this account.
                  </p>
                </div>

                {businessProfile && detectionMethod === 'auto' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <img 
                        src={businessProfile.profileImage} 
                        alt="Business Profile" 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-green-800">{businessProfile.name}</h4>
                        <p className="text-sm text-green-600">{businessProfile.phone}</p>
                      </div>
                    </div>
                    <p className="text-green-700 text-sm">
                      We detected your WhatsApp Business profile. Verify to continue.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Business Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be a Nigerian number (+234). We'll send a verification code via SMS.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => sendVerificationCode(phoneNumber)}
                    disabled={!phoneNumber}
                    className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Send Verification Code
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep('welcome')}
                    className="w-full py-2 px-6 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {verificationStep === 'code' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Code Sent!</h3>
                  <p className="text-gray-600 text-sm">
                    We sent a 6-digit code to <strong>{phoneNumber}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={verifyCode}
                    disabled={verificationCode.length !== 6}
                    className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Verify Code
                  </button>
                  
                  <button
                    onClick={() => sendVerificationCode(phoneNumber)}
                    className="w-full py-2 px-6 text-blue-600 border border-blue-300 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Resend Code
                  </button>
                  
                  <button
                    onClick={() => setVerificationStep('phone')}
                    className="w-full py-2 px-6 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Change Number
                  </button>
                </div>
              </div>
            )}

            {verificationStep === 'confirmed' && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Verified Successfully!</h3>
                  <p className="text-gray-600 text-sm">
                    Your WhatsApp Business number has been verified. Setting up your Vend NG workspace...
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  <span className="font-medium">Loading your business profile...</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your number is secure and will only be used for business verification
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-4">
              <Settings size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Setup</h1>
            <p className="text-gray-600">Let's configure your Vend NG workspace</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-8">
            <div className="space-y-6">
              {businessProfile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle size={20} />
                    <span className="font-medium">Profile Auto-Detected</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    We've automatically filled your business details from WhatsApp. You can edit them below if needed.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={onboardingData.businessName}
                    onChange={(e) => setOnboardingData({...onboardingData, businessName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={onboardingData.phoneNumber}
                    onChange={(e) => setOnboardingData({...onboardingData, phoneNumber: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Category
                  </label>
                  <select
                    value={onboardingData.category}
                    onChange={(e) => setOnboardingData({...onboardingData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Fashion & Style">Fashion & Style</option>
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Arts & Crafts">Arts & Crafts</option>
                    <option value="Services">Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    {onboardingData.profileImage ? (
                      <img 
                        src={onboardingData.profileImage} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Camera size={20} className="text-gray-500" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setOnboardingData({...onboardingData, profileImage: event.target.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  value={onboardingData.description}
                  onChange={(e) => setOnboardingData({...onboardingData, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell customers about your business..."
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setCurrentStep('welcome')}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={completeOnboarding}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <Zap size={20} />
                Launch Vend NG
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle size={24} />
            <div>
              <h1 className="text-xl font-semibold">Vend NG</h1>
              <p className="text-green-100 text-sm">Nigeria's #1 WhatsApp Business Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              whatsappConnected ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {whatsappConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
              {whatsappConnected ? 'Connected' : 'Disconnected'}
            </div>
            <button 
              onClick={() => setShowApiSetup(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-700 rounded-lg hover:bg-green-800"
            >
              <Settings size={16} />
              Setup
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={20} />
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <Package className="text-blue-600" size={20} />
            <div>
              <p className="text-gray-600 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-blue-600">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <Users className="text-purple-600" size={20} />
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-purple-600">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <Package className="text-red-600" size={20} />
            <div>
              <p className="text-gray-600 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex">
            {[
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 ${
                    activeTab === tab.id 
                      ? 'bg-green-50 text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">WhatsApp Orders</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <Search size={16} />
                  Search
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <Filter size={16} />
                  Filter
                </button>
              </div>
            </div>

            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{order.customer}</h3>
                    <p className="text-gray-600 text-sm">{order.phone}</p>
                    <p className="text-gray-500 text-xs">{order.timestamp}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Items:</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      {item.name} × {item.quantity} = ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  ))}
                  <p className="text-sm font-semibold mt-1">Total: ₦{order.total.toLocaleString()}</p>
                </div>

                <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                  <strong>Last message:</strong> {order.lastMessage}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => sendWhatsAppMessage(order.phone, `Hello ${order.customer}, thank you for your order! We're processing your items: ${order.items.map(item => item.name).join(', ')}. Total: ₦${order.total.toLocaleString()}. We'll update you soon!`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <MessageCircle size={14} />
                    Reply on WhatsApp
                  </button>
                  
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Confirm Order
                    </button>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Product Catalog</h2>
              <button 
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            {showAddProduct && (
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium mb-3">Add New Product</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Photo</label>
                  <div className="flex items-start gap-4">
                    {previewImage ? (
                      <div className="relative">
                        <img 
                          src={previewImage} 
                          alt="Product preview" 
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <Camera size={24} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="product-image"
                      />
                      <label 
                        htmlFor="product-image"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 border border-blue-200 w-fit"
                      >
                        <Upload size={16} />
                        Upload Photo
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG up to 5MB. Recommended: 500x500px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Price (₦)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Stock quantity"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="">Select category</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Food">Food</option>
                    <option value="Home">Home & Living</option>
                    <option value="Crafts">Arts & Crafts</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={addProduct}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add Product
                  </button>
                  <button 
                    onClick={() => {
                      setShowAddProduct(false);
                      setPreviewImage(null);
                      setNewProduct({ name: '', price: '', stock: '', category: '', image: '' });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="mb-3">
                    {product.image.startsWith('data:') ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                        <span className="text-4xl">{product.image}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-green-600 font-semibold">₦{product.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className={`text-sm mt-1 ${product.stock < 5 ? 'text-red-600' : 'text-gray-600'}`}>
                    Stock: {product.stock} {product.stock < 5 ? '(Low!)' : ''}
                  </p>
                  <button 
                    onClick={() => shareProductOnWhatsApp(product)}
                    className="w-full mt-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Share on WhatsApp
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Customer Management</h3>
            <p className="text-gray-600 mb-4">Track customer interactions, purchase history, and preferences</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Coming Soon
            </button>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Business Analytics</h3>
            <p className="text-gray-600 mb-4">Revenue trends, popular products, and growth insights</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Coming Soon
            </button>
          </div>
        )}
      </div>

      {/* WhatsApp API Setup Modal */}
      {showApiSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">WhatsApp Business API Setup</h3>
              <button 
                onClick={() => setShowApiSetup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  placeholder="From Meta Business Manager"
                  value={apiConfig.phoneNumberId}
                  onChange={(e) => setApiConfig({...apiConfig, phoneNumberId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token
                </label>
                <input
                  type="password"
                  placeholder="Permanent access token"
                  value={apiConfig.accessToken}
                  onChange={(e) => setApiConfig({...apiConfig, accessToken: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook Token (Optional)
                </label>
                <input
                  type="text"
                  placeholder="For receiving messages"
                  value={apiConfig.webhookToken}
                  onChange={(e) => setApiConfig({...apiConfig, webhookToken: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Account ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Your business account ID"
                  value={apiConfig.businessAccountId}
                  onChange={(e) => setApiConfig({...apiConfig, businessAccountId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button 
                onClick={connectWhatsApp}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Connect WhatsApp
              </button>
              <button 
                onClick={() => setShowApiSetup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-600">
              <p className="mb-2"><strong>Setup Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a Meta Business Account</li>
                <li>Set up WhatsApp Business API</li>
                <li>Get your Phone Number ID and Access Token</li>
                <li>Configure webhook for receiving messages</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Integration Notice */}
      <div className="p-4">
        <div className={`${whatsappConnected ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
          <div className="flex items-start gap-3">
            <MessageCircle className={`${whatsappConnected ? 'text-green-600' : 'text-blue-600'} mt-1`} size={20} />
            <div>
              {whatsappConnected ? (
                <>
                  <h4 className="font-medium text-green-800">WhatsApp Business Connected! 🎉</h4>
                  <p className="text-green-700 text-sm mt-1">
                    You can now send messages directly to customers, share products, and manage conversations 
                    from this dashboard. All messages are synced with your WhatsApp Business account.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-blue-800">Connect WhatsApp Business API</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Connect your WhatsApp Business account to automatically sync messages, send product catalogs, 
                    and manage customer conversations directly from this dashboard.
                  </p>
                  <button 
                    onClick={() => setShowApiSetup(true)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Setup WhatsApp Integration
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendNG;