import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';


export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] =useState('');
  const [guests, setGuests] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const handleClickDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/guests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting guest:', errorData);
        return; // Exit if there's an error
      }

      // If successful, update local state
      const newGuests = guests.filter((guest) => guest.id !== id);
      setGuests(newGuests);
    } catch (error) {
      console.log(error);
    }
  };

const handleClickAttend = (id) => {
  const newGuests = guests.map((guest) => {
    if (guest.id === id) {
      return { ...guest, attending: !guest.attending };  // Toggle attending status
    }
    return guest;
  });
  setGuests(newGuests);
};


const handleKeyDown = async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();

    const newGuest = {
      attending: false,
      firstName: firstName,
      lastName: lastName,
    };

    if (!newGuest.firstName || !newGuest.lastName) {
      console.error("First name and last name are required.");
      return; // Exit early if names are empty
    }

    try {
      const response = await fetch('http://localhost:4000/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGuest), // Send newGuest data as JSON
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get the error message from the API
        console.error('Error:', errorData);
        return; // Exit if the response is not OK
      }

      const addedGuest = await response.json(); // Read the response only once
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
      const response = await fetch('http://localhost:4000/guests', {
        method: 'GET',
      });
      const data = await response.json();
      console.log("Fetched guests:", data);

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
      <label htmlFor='FirstName'>First name</label>
      <input value={firstName}
       onChange={(event) => setFirstName(event.currentTarget.value)}
       onKeyDown={handleKeyDown}
       disabled={isLoading}

      ></input> <br />
      <label htmlFor='LastName'>Last name</label>
      <input
      value={lastName}
      onChange={(event) => setLastName(event.currentTarget.value)} onKeyDown={handleKeyDown} disabled={isLoading}

      ></input> <br />
      <div>
        {guests.map((guest) =>{
          return (
            <div key={guest.id} data-test-id="guest">
              {guest.firstName} {guest.lastName}
              <button aria-label={`Remove ${guest.firstName} ${guest.lastName}`} onClick={() => handleClickDelete(guest.id)} disabled={isLoading}>Remove </button>


              <input type="checkbox" id="attending"
              aria-label={`Remove ${guest.firstName} ${guest.lastName} attending status`}
              checked = {guest.attending}
              onChange={() => handleClickAttend(guest.id)} disabled={isLoading} />
              <label htmlFor="attending">attending</label>
            </div>
          )

        }
        )}
      </div>

    </div>
    </>
  );
}
