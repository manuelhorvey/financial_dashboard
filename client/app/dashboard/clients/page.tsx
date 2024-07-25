'use client'
import React, { useEffect, useState } from 'react';
import styles from './clients.module.css';
import ClientsCard from '@/app/components/client/card/ClientsCard';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/sidebar/Sidebar';

interface Clients {
  _id: string;
  name: string;
  phone: string;
  location: string;
  grossCommission: number;
  winsCommission: number;
  isActive: boolean;
}

const Clients = () => {
  const [clients, setClients] = useState<Clients[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/dashboard/clients/add');
  };

  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await fetch('http://localhost:3000/clients/');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
        }
        const clientsData: Clients[] = await response.json();
        setClients(clientsData);
      } catch (error:any) {
        setError(`Error fetching clients: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getClients();
  }, []);

  const clientsSummary = {
    totalClients: clients.length,
    activeClients: clients.filter(client => client.isActive).length,
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (error) {
    return <p>Error: {error}</p>; 
  }

  return (
    <div className={styles.pageContainer}>
      <Sidebar clientsSummary={clientsSummary} />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.info}>
            <h3>Manage all clients in one place</h3>
            <p>Detailed info about managing clients</p>
          </div>
          <div className={styles.button}>
            <button onClick={handleButtonClick}>New Client</button>
          </div>
        </div>
        <div className={styles.cardContainer}>
          {clients.length === 0 ? (
            <p>No clients found.</p>
          ) : (
            clients.map((client) => (
              <ClientsCard
                key={client._id}
                _id={client._id}
                name={client.name}
                phone={client.phone}
                location={client.location}
                grosscommission={client.grossCommission}
                winscommission={client.winsCommission}
                imageSrc=""
                isActive={client.isActive}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
