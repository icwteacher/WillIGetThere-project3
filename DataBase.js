let xmlDoc = null;
let serializer = new XMLSerializer();

fetch("DataBase.xml")
  .then(response => response.text())
  .then(str => {
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(str, "text/xml");
    console.log("XML geladen");
    displayUsers();
  })
  .catch(err => console.error("Fout bij laden van XML:", err));

// Voeg een gebruiker toe aan de XML
function addUser(id, name, email) {
  if (!xmlDoc) return;

  const user = xmlDoc.createElement("user");
  user.setAttribute("id", id);

  const nameElem = xmlDoc.createElement("name");
  nameElem.textContent = name;

  const emailElem = xmlDoc.createElement("email");
  emailElem.textContent = email;

  user.appendChild(nameElem);
  user.appendChild(emailElem);

  xmlDoc.querySelector("users").appendChild(user);
}

// Haal alle gebruikers op
function getUsers() {
  if (!xmlDoc) return [];

  const users = xmlDoc.querySelectorAll("user");
  return Array.from(users).map(user => ({
    id: user.getAttribute("id"),
    name: user.querySelector("name").textContent,
    email: user.querySelector("email").textContent
  }));
}

// Toon gebruikers in het <pre>-element
function displayUsers() {
  const users = getUsers();
  document.getElementById("output").textContent = JSON.stringify(users, null, 2);
}

// Voorbeeld: knop voegt een nieuwe gebruiker toe
function addSampleUser() {
  const id = Date.now().toString(); // unieker ID
  addUser(id, "Nieuwe Gebruiker", "nieuw@example.com");
  displayUsers();
}
