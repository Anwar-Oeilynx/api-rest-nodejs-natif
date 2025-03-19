const http = require('http');

let data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
];

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
  // Récupérer la méthode HTTP et l'URL de la requête
  const { method, url } = req;

  // Définir le type de contenu comme JSON
  res.setHeader('Content-Type', 'application/json');

  // Routes pour l'API
  if (url === '/api/items' && method === 'GET') {
    // Retourner tous les éléments
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  } else if (url.match(/^\/api\/items\/\d+$/) && method === 'GET') {
    // Retourner un élément spécifique par ID
    const id = parseInt(url.split('/')[3], 10);
    const item = data.find(i => i.id === id);

    if (item) {
      res.statusCode = 200;
      res.end(JSON.stringify(item));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Item not found' }));
    }
  } else if (url === '/api/items' && method === 'POST') {
    // Ajouter un nouvel élément
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const newItem = JSON.parse(body);
      newItem.id = data.length + 1; // Attribution d'un nouvel ID
      data.push(newItem);

      res.statusCode = 201;
      res.end(JSON.stringify(newItem));
    });
  } else if (url.match(/^\/api\/items\/\d+$/) && method === 'DELETE') {
    // Supprimer un élément par ID
    const id = parseInt(url.split('/')[3], 10);
    const index = data.findIndex(i => i.id === id);

    if (index !== -1) {
      data.splice(index, 1);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'Item deleted' }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Item not found' }));
    }
  } else {
    // Route non trouvée
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Démarrer le serveur
const port = 3000;
server.listen(port, () => {
  console.log(`API REST lancée sur http://localhost:${port}`);
});
