import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';


export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] =useState('');
  const [guests, setGuests] = useState([])

const handleClickDelete = (id) => {
  const newGuests = guests.filter((guest) => guest.id !== id);
  setGuests(newGuests);
}


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

    const newGuest = {
      id: Date.now(),
      firstName: firstName,
      lastName: lastName,
      }
      setGuests([...guests, newGuest]);

      setFirstName('');
      setLastName('');
    }
  };



  return (
    <>
    <h1>Guest List</h1>
    <div>
      <label htmlFor='FirstName'>First name</label>
      <input value={firstName}
       onChange={(event) => setFirstName(event.currentTarget.value)} onKeyDown={handleKeyDown}

      ></input> <br />
      <label htmlFor='LastName'>Last name</label>
      <input
      value={lastName}
      onChange={(event) => setLastName(event.currentTarget.value)} onKeyDown={handleKeyDown}

      ></input> <br />
      <div>
        {guests.map((guest) =>{
          return (
            <div key={guest.id} data-test-id="guest">
              {guest.firstName} {guest.lastName}
              <button aria-label={`Remove ${guest.firstName} ${guest.lastName}`} onClick={() => handleClickDelete(guest.id)}>Remove </button>
            </div>
          )

        }
        )}
      </div>

    </div>
    </>
  );
}
