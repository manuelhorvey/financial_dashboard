'use client';
import React, { useEffect, useState } from 'react';
import styles from './editclient.module.css';
import { useRouter } from 'next/navigation';


interface ClientsCardProps {
  name: string;
  phone: string;
  location: string;
  grossCommission: number;
  winsCommission: number;
  isActive: boolean;
}

interface Props {
  params: {
    id: string;
  };
}

const SingleClient: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [client, setClient] = useState<ClientsCardProps | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getClient = async () => {
      try {
        const response = await fetch(`http://localhost:3000/clients/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch client: ${response.status} ${response.statusText}`);
        }
        const clientData = await response.json();
        setClient(clientData);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };
    getClient();
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (client) {
      setClient(prevClient => {
        if (!prevClient) return prevClient;
        return {
          ...prevClient,
          [name]: name === 'isActive' ? value === 'true' : value,
        } as ClientsCardProps;
      });
    }
  };

  const updateClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client) return;

    try {
      const response = await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      router.push('/dashboard/clients');
    } catch (error) {
      console.error('Failed to update client', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Edit Client Details</h3>
      </div>
      {client ? (
        <div className={styles.content}>
          <form onSubmit={updateClient}>
            <div className={styles.formGroup}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={client.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={client.phone}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                Location
                <input
                  type="text"
                  name="location"
                  value={client.location}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Is Active?
                <select
                  name="isActive"
                  value={client.isActive.toString()}
                  onChange={handleInputChange}
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                Gross Commission
                <input
                  type="number"
                  name="grossCommission"
                  value={client.grossCommission}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Wins Commission
                <input
                  type="number"
                  name="winsCommission"
                  value={client.winsCommission}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <button className={styles.button} type="submit">Update Client</button>
          </form>
        </div>
      ) : (
        <p>Loading client data...</p>
      )}
    </div>
  );
};

export default SingleClient;
