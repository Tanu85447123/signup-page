const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;  // Changed port to 4000

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static signup HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Handle form submission
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Create user object
    const newUser = {
        username,
        email,
        password
    };

    // Read existing users from file (if any)
    fs.readFile('users.json', 'utf8', (err, data) => {
        let users = [];

        if (!err && data) {
            users = JSON.parse(data);
        }

        // Add new user to the array
        users.push(newUser);

        // Save the updated user array back to the file
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send('Signup successful! User data has been saved.');
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
