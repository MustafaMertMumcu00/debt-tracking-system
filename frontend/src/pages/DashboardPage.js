import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import * as api from '../services/api';
import CustomerTable from '../components/CustomerTable';
import MessageModal from '../components/MessageModal';
import CustomSelect from '../components/CustomSelect';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaCheckCircle } from 'react-icons/fa';

const ITEMS_PER_PAGE = 15;

function DashboardPage() {
  const { user } = useAuth(); // Giriş yapan kullanıcı bilgisi alındı
  const [allCustomers, setAllCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [statusFilter, setStatusFilter] = useState('all');

  const sortKeyOptions = [
    { value: 'name', label: 'İsim' },
    { value: 'balance', label: 'Bakiye' },
    { value: 'status', label: 'Yanıt Durumu' },
    { value: 'lastPaymentDate', label: 'Son Tahsilat' },
    { value: 'lastInvoiceDate', label: 'Son Fatura' },
    { value: 'accountCode', label: 'Hesap Kodu' },
  ];

  const sortDirectionOptions = [
    { value: 'ascending', label: 'Artan' },
    { value: 'descending', label: 'Azalan' },
  ];

  const statusFilterOptions = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'confirmed', label: 'Onaylandı' },
    { value: 'pending', label: 'Beklemede' },
    { value: 'rejected', label: 'Reddedildi' },
  ];

  // API'dan veri çekme bloğu
  useEffect(() => {
    const loadCustomers = async () => {
      // Sadece kullanıcı bilgisi varsa veri çek
      if (!user || !user.id) {
          setIsLoading(false);
          return;
      }
      setError(null);
      setIsLoading(true);
      try {
        // API'a user.id gönder
        const data = await api.fetchCustomers();
        const sanitizedData = data.map(customer => ({
          ...customer,
          // parseFloat, ondalıklı sayıları doğru bir şekilde metinden sayıya çevirir
          balance: parseFloat(customer.balance) 
        }));
        setAllCustomers(sanitizedData);
      } catch (err) {
        const errorMessage = 'Müşteri verileri alınamadı.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomers();
  }, [user]); 

  // Daha iyi performans için useMemo
  const processedCustomers = useMemo(() => {
    let items = [...allCustomers];
    if (statusFilter !== 'all') {
      items = items.filter(customer => customer.status === statusFilter);
    }
    if (searchTerm) {
      items = items.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.accountCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      items.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        }

        const strA = String(aValue || '');
        const strB = String(bValue || '');

        if (sortConfig.direction === 'ascending') {
            return strA.localeCompare(strB, 'tr');
        } else {
            return strB.localeCompare(strA, 'tr');
        }
      });
    }
    return items;
  }, [allCustomers, searchTerm, sortConfig, statusFilter]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedCustomers, currentPage]);

  const totalPages = Math.ceil(processedCustomers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setSelectedCustomerIds([]); // Filtre değiştiğinde seçimleri sıfırla
    }, [statusFilter, searchTerm, sortConfig]);

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerIds(prevIds =>
      prevIds.includes(customerId)
        ? prevIds.filter(id => id !== customerId)
        : [...prevIds, customerId]
    );
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = processedCustomers.map(c => c.id);
    if (selectedCustomerIds.length === allFilteredIds.length && allFilteredIds.length > 0) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(allFilteredIds);
    }
  };
  
  const handleOpenSendModal = () => {
    if (selectedCustomerIds.length > 0) {
      setIsModalOpen(true);
    } else {
      toast.warn("Lütfen mesaj göndermek için en az bir müşteri seçin.");
    }
  };
  
  //API'a mesaj göndermek için blok
  const handleConfirmSend = async (message) => {
    setIsSending(true);
    try {
      // Seçili müşterilere mesaj gönder (API aracılığıyla)
      const response = await api.sendToSelectedCustomers(selectedCustomerIds, message);
      
      toast.success(response.message, {
        icon: <FaCheckCircle className="text-blue-500" />
      });

      // İşlem başarılı olunca, tablodaki veriyi tazelemek için müşterileri yeniden çek.
      const updatedData = await api.fetchCustomers();
      const sanitizedData = updatedData.map(customer => ({
        ...customer,
        balance: parseFloat(customer.balance) 
      }));
      setAllCustomers(sanitizedData);

      setIsModalOpen(false);
      setSelectedCustomerIds([]);
    } catch (err)      {
      // apiRequest'ten gelen hatayı direkt göster
      toast.error(err.message || 'Talepler gönderilemedi.');
    } finally {
      setIsSending(false);
    }
  };

  // Tabloyu sun
  return (
    <>
      {isModalOpen && (
        <MessageModal
          onClose={() => setIsModalOpen(false)}
          onSend={handleConfirmSend}
          isSending={isSending}
          selectedCount={selectedCustomerIds.length}
        />
      )}

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-white">Borç Mutabakat Paneli</h1>
            <p className="mt-2 text-md text-gray-400">
              Hoş geldiniz, <span className="font-bold text-white">{user?.name}</span>. 
              Toplam <span className="font-bold text-white">{processedCustomers.length}</span> müşteriden <span className="font-bold text-white">{paginatedCustomers.length}</span> tanesi gösteriliyor.
            </p>
          </div>
          
          {error && <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded-lg">{error}</div>}
          
          <div className="bg-gray-800 p-4 rounded-t-lg flex items-center justify-between gap-4 flex-wrap border-b border-gray-700">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FaSearch /></span>
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-52 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-400">Filtrele:</label>
                <CustomSelect
                  options={statusFilterOptions}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-400">Sırala:</label>
                <CustomSelect
                  options={sortKeyOptions}
                  value={sortConfig.key}
                  onChange={(value) => setSortConfig({ ...sortConfig, key: value })}
                />
                <CustomSelect
                  options={sortDirectionOptions}
                  value={sortConfig.direction}
                  onChange={(value) => setSortConfig({ ...sortConfig, direction: value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button 
                onClick={handleSelectAllFiltered}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
              >
                {processedCustomers.length > 0 && selectedCustomerIds.length === processedCustomers.length ? 'Tüm Seçimi Kaldır' : 'Tümünü Seç'}
              </button>
              <button
                onClick={handleOpenSendModal}
                disabled={selectedCustomerIds.length === 0 || isSending}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                {`Gönder (${selectedCustomerIds.length})`}
              </button>
            </div>
          </div>

          <div>
            <CustomerTable
              customers={paginatedCustomers}
              selectedIds={selectedCustomerIds}
              isLoading={isLoading}
              onSelectCustomer={handleSelectCustomer}
            />
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default DashboardPage;