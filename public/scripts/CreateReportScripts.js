document.getElementById('reportForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const query = document.getElementById('query').value;
  const pdfFile = document.getElementById('pdfFile').files[0];
  const reportFile = document.getElementById('reportFile').files[0];
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('query', query);
  formData.append('pdfFile', pdfFile);
  formData.append('reportFile', reportFile);

  fetch('http://192.168.5.23:3333/api/reports', {
      method: 'POST',
      body: formData,
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erro na requisição: ' + response.statusText);
      }
      return response.json();
  })
  .then(data => {
      alert('Relatório criado com sucesso.')
      document.getElementById('reportForm').reset();
  })
  .catch(error => {
      console.error('Erro ao criar relatório:', error);
  });
});
