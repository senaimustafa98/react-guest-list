import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClickDelete = async (id) => {
    try {
      const response = await fetch(`https://ml6htv-4000.csb.app/guests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting guest:', errorData);
        return; // Exit if there's an error
      }

      // Update local state
      const newGuests = guests.filter((guest) => guest.id !== id);
      setGuests(newGuests);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickAttend = async (id) => {
    // Find the current guest
    const currentGuest = guests.find((guest) => guest.id === id);
    const newAttendanceStatus = !currentGuest.attending; // Toggle attendance status

    // Immediately update the local state
    const updatedGuests = guests.map((guest) => {
      if (guest.id === id) {
        return { ...guest, attending: newAttendanceStatus }; // Update local state
      }
      return guest;
    });

    setGuests(updatedGuests);

    try {
      const response = await fetch(`https://ml6htv-4000.csb.app/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending: newAttendanceStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating attending status:', errorData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const newGuest = {
        attending: false,
        firstName: firstName,
        lastName: lastName,
      };

      try {
        const response = await fetch('https://ml6htv-4000.csb.app/guests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(newGuest), // Send newGuest data as JSON
        });

        if (!response.ok) {
          const errorData = await response.json(); // Catch error from API
          console.error('Error:', errorData);
          return;
        }

        const addedGuest = await response.json();
        setGuests([...guests, addedGuest]); // Add the new guest to state

        setFirstName(''); // Clear input fields
        setLastName('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    async function firstRenderFetch() {
      const response = await fetch('https://ml6htv-4000.csb.app/guests', {
        method: 'GET',
      });
      const data = await response.json();

      setGuests(data);
      setIsLoading(false);
    }

    firstRenderFetch().catch((error) => {
      console.log(error);
    });
  }, []);

  if (isLoading) {
    // early return
    return 'Loading...';
  }

  return (
    <>
      <h1>Guestd List</h1>
      <div>
        <label htmlFor="FirstName">First name</label>
        <input
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />{' '}
        <br />
        <label htmlFor="LastName">Last name</label>
        <input
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />{' '}
        <br />
        <div>
          {guests.map((guest) => {
            return (
              <div key={`guest-${guest.id}`} data-test-id="guest">
                {guest.firstName} {guest.lastName}
                <button
                  aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                  onClick={() => handleClickDelete(guest.id)}
                  disabled={isLoading}
                >
                  Remove{' '}
                </button>
                <input
                  type="checkbox"
                  id="attending"
                  aria-label={`Remove ${guest.firstName} ${guest.lastName} attending status`}
                  checked={guest.attending}
                  onChange={() => handleClickAttend(guest.id)}
                  disabled={isLoading}
                />
                <label htmlFor="attending">attending</label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
