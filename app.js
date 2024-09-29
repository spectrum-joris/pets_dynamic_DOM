import express from 'express'; // Import express voor het opzetten van de webserver
import mysql from 'mysql2/promise'; // Import mysql2/promise om async database queries uit te voeren
import fs from 'fs'; // Import fs om SQL-bestanden in te lezen
import path from 'path'; // Import path voor het werken met bestandsnamen
import { fileURLToPath } from 'url';

// Creëer een ES6-vriendelijke manier om het equivalent van __dirname te maken
const __filename = fileURLToPath(import.meta.url); // Verkrijg het huidige bestands-URL en converteer naar een pad
const __dirname = path.dirname(__filename); // Verkrijg de directorynaam van het huidige bestand

// Nu kunnen we __dirname gebruiken zoals in CommonJS-modules.
/*Gebruik van import.meta.url: Dit geeft ons de URL van het huidige bestand, die we vervolgens omzetten naar een pad met fileURLToPath.
Maak __dirname beschikbaar in ES6-modules: Door __dirname zelf te definiëren, kunnen we paden naar bestanden correct berekenen, zoals in CommonJS.*/

/*
import express, mysql, fs, path: Deze imports laden de benodigde modules. express maakt de server, mysql2/promise zorgt voor async databaseverbindingen, fs leest SQL-bestanden in, en path helpt bij het opbouwen van bestandsnamen.
app.use(express.static('public')): Dit zorgt ervoor dat statische bestanden zoals HTML, CSS en JavaScript kunnen worden bediend.
*/

const app = express(); // Initialiseer de express-app
const PORT = process.env.PORT || 3000; // Bepaal de poort waarop de server draait

app.use(express.static('public')); // Zorg ervoor dat alle bestanden in de map 'public' toegankelijk zijn voor de browser

// Database configuratie
const dbConfig = {
    host: "spectrum__organization",
    user: "xxx",
    database: "bbn7ekypqukj7rbdub1i",
    password: "xxx"
};

// Functie om SQL-bestanden uit te voeren
const executeQuery = async (queryFile) => {
    console.log(`Query bestand: ${queryFile} wordt uitgevoerd`);
    try {
      const connection = await mysql.createConnection(dbConfig);
      const query = fs.readFileSync(path.join(__dirname, 'queries', queryFile), 'utf-8'); // Gebruik het aangepaste __dirname
      console.log("SQL Query:", query); // Log de SQL-query die wordt uitgevoerd
      const [rows] = await connection.execute(query);
      console.log("Query resultaat:", rows); // Log het resultaat van de query
      return rows;
    } catch (error) {
      console.error("Fout bij het uitvoeren van de query:", error.message);
      throw error;
    }
  };  

// API route voor het ophalen van dieren
app.get('/api/pets', async (req, res) => {
    const sortBy = req.query.sort || 'name';
    let queryFile;
  
    if (sortBy === 'name') {
      queryFile = 'getPetsByName.sql';
    } else if (sortBy === 'age') {
      queryFile = 'getPetsByAge.sql';
    } else if (sortBy === 'owner') {
      queryFile = 'getPetsByOwner.sql';
    }
  
    try {
      const pets = await executeQuery(queryFile); // Voer de query uit
      res.json(pets); // Stuur de data terug naar de frontend als JSON
    } catch (error) {
      console.error("Er is een fout opgetreden:", error.message); // Log de exacte fout naar de server terminal
      res.status(500).json({ error: `Fout bij het ophalen van data: ${error.message}` }); // Stuur de fout als JSON terug naar de frontend
    }
  });  

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
