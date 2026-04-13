import CONFIG from '../config';


export async function login ({email, password}) {
  const response = await fetch (`${CONFIG.BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({email, password}),
  });

  return response.json();
}

export async function register({ name, email, password}) {
  const response = await fetch(`${CONFIG.BASE_URL}/register`, {
   method: 'POST',
   headers: {
    'Content-Type' : 'application/json',
   },
   body: JSON.stringify({ name, email, password}), 
  });

  return response.json();
}

export async function getStories(token) {
  const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}