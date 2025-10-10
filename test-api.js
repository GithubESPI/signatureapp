// Utiliser fetch natif de Node.js

async function testGenerate() {
  try {
    const response = await fetch('http://localhost:3000/api/test-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateName: "model_signature.docx",
        userData: {
          prenom: "Test",
          nom: "User",
          fonction: "Employé ESPI",
          telephone: "01 23 45 67 89",
          adresse: "123 Rue de la Paix",
          ville: "Paris",
          email: "test@example.com"
        }
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    if (response.ok) {
      const buffer = await response.buffer();
      console.log('Success! Generated file size:', buffer.length, 'bytes');
    } else {
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testGenerate();
