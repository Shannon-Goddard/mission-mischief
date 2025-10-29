// Quick endpoint test
fetch('https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape')
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', [...response.headers.entries()]);
    return response.text();
  })
  .then(data => console.log('Response:', data))
  .catch(error => console.error('Error:', error));