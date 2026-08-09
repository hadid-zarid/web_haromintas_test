import React, { createContext, useContext, useState } from 'react';
import { INITIAL_PERATURAN, DOCUMENT_TYPES, STATUS_PERATURAN } from '../mock/mockPeraturan';
import { INITIAL_ACTIVITIES } from '../mock/mockActivity';

const PeraturanContext = createContext(null);

export const PeraturanProvider = ({ children }) => {
  const [peraturanList, setPeraturanList] = useState(INITIAL_PERATURAN);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITIES);
  const [readIds, setReadIds] = useState(['REG-2024-001', 'REG-2024-004']); // Sample already read items

  // Mark regulation as read
  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id]);
    }
  };

  // Add activity helper
  const addActivity = (user, role, action, regulationId, regulationTitle, detail) => {
    const newActivity = {
      id: `ACT-${Date.now()}`,
      user: user || 'Sistem',
      role: role || 'Kanwil',
      action,
      regulationId,
      regulationTitle,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      detail
    };
    setActivityLogs(prev => [newActivity, ...prev]);
  };

  // Add new regulation
  const addPeraturan = (data, user, role) => {
    const newId = `REG-2024-${String(peraturanList.length + 1).padStart(3, '0')}`;
    const newReg = {
      id: newId,
      nomor: data.nomor || `${String(peraturanList.length + 1).padStart(2, '0')}/${data.jenis.toUpperCase()}/2024`,
      judul: data.judul,
      kabupaten: data.kabupaten,
      jenis: data.jenis,
      proja: data.proja,
      status: STATUS_PERATURAN.DRAFT,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      uploadedBy: user || 'User',
      keterangan: data.keterangan || 'Draft peraturan baru diinput.',
      documents: [
        data.initialFile ? {
          typeIndex: 1,
          title: 'Draft Rancangan',
          fileName: data.initialFile.name,
          fileSize: `${(data.initialFile.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          uploadedBy: role || 'Proja',
          fileUrl: '#'
        } : null,
        null, null, null, null, null
      ]
    };

    setPeraturanList(prev => [newReg, ...prev]);
    markAsRead(newId);
    addActivity(user, role, 'Menambahkan Peraturan Baru', newId, data.judul, `Peraturan baru diinput untuk ${data.kabupaten} oleh tim ${data.proja}`);
    return newReg;
  };

  // Update status of regulation
  const updatePeraturanStatus = (regId, newStatus, note, user, role) => {
    let targetTitle = '';
    setPeraturanList(prev => prev.map(item => {
      if (item.id === regId) {
        targetTitle = item.judul;
        return {
          ...item,
          status: newStatus,
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          keterangan: note || item.keterangan
        };
      }
      return item;
    }));

    addActivity(user, role, 'Mengubah Status Peraturan', regId, targetTitle, `Status diubah menjadi "${newStatus}". ${note ? 'Catatan: ' + note : ''}`);
  };

  // Upload or Replace document
  const uploadDocument = (regId, typeIndex, fileObj, user, role) => {
    let targetTitle = '';
    let docTitle = DOCUMENT_TYPES.find(d => d.typeIndex === typeIndex)?.title || 'Dokumen';

    setPeraturanList(prev => prev.map(item => {
      if (item.id === regId) {
        targetTitle = item.judul;
        const newDocs = [...item.documents];
        const formattedSize = fileObj ? `${(fileObj.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB';
        const docName = fileObj ? fileObj.name : `${docTitle.replace(/\s+/g, '_')}_${item.kabupaten.replace(/\s+/g, '')}.pdf`;

        newDocs[typeIndex - 1] = {
          typeIndex,
          title: docTitle,
          fileName: docName,
          fileSize: formattedSize,
          uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          uploadedBy: user || role,
          fileUrl: '#'
        };

        // Automatically advance status if document 5 or 6 uploaded
        let updatedStatus = item.status;
        if (typeIndex === 5 && item.status === STATUS_PERATURAN.HARMONISASI) {
          updatedStatus = STATUS_PERATURAN.FASILITASI;
        } else if (typeIndex === 6) {
          updatedStatus = STATUS_PERATURAN.SELESAI;
        }

        return {
          ...item,
          status: updatedStatus,
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          documents: newDocs
        };
      }
      return item;
    }));

    addActivity(user, role, `Mengunggah ${docTitle}`, regId, targetTitle, `Dokumen ${docTitle} berhasil diunggah.`);
  };

  // Delete regulation
  const deletePeraturan = (regId, user, role) => {
    let targetTitle = '';
    setPeraturanList(prev => {
      const found = prev.find(item => item.id === regId);
      if (found) targetTitle = found.judul;
      return prev.filter(item => item.id !== regId);
    });

    addActivity(user, role, 'Menghapus Peraturan', regId, targetTitle, `Peraturan [${regId}] ${targetTitle} telah dihapus dari sistem.`);
  };

  return (
    <PeraturanContext.Provider value={{
      peraturanList,
      activityLogs,
      readIds,
      markAsRead,
      addPeraturan,
      updatePeraturanStatus,
      uploadDocument,
      deletePeraturan
    }}>
      {children}
    </PeraturanContext.Provider>
  );
};

export const usePeraturan = () => {
  const context = useContext(PeraturanContext);
  if (!context) {
    throw new Error('usePeraturan must be used within a PeraturanProvider');
  }
  return context;
};
