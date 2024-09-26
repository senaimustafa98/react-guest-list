import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';


export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] =useState('');
  const [guests, setGuests] = useState([])
  const [isLoading, setIsLoading] = useState(true);

const handleClickDelete = (id) => {
  const newGuests = guests.filter((guest) => guest.id !== id);
  setGuests(newGuests);
}

const handleClickAttend = (id) => {
  const newGuests = guests.map((guest) => {
    if (guest.id === id) {
      return { ...guest, attending: !guest.attending };  // Toggle attending status
    }
    return guest;
  });
  setGuests(newGuests);
};


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

    const newGuest = {
      attending: false,
      id: Date.now(),
      firstName: firstName,
      lastName: lastName,
      }
      setGuests([...guests, newGuest]);

      setFirstName('');
      setLastName('');
    }
  };

  useEffect(() => {
    async function firstRenderFetch() {
      const response = await fetch('http://localhost:4000/guests', {
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



  return (
    <>
    <h1>Guest List</h1>
    <div>
      <label htmlFor='FirstName'>First name</label>
      <input value={firstName}
       onChange={(event) => setFirstName(event.currentTarget.value)}
       onKeyDown={handleKeyDown}


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


              <input type="checkbox" id="attending"
              aria-label={`Remove ${guest.firstName} ${guest.lastName} attending gstatus`}
              checked = {guest.attending}
              onClick={() => handleClickAttend(guest.id)} />
              <label for="attending">attending</label>
            </div>
          )

        }
        )}
      </div>

    </div>
    </>
  );
}
