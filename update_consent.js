const fs = require('fs');

let consentCard = fs.readFileSync('components/ConsentCard.tsx', 'utf8');

// Replace heading
consentCard = consentCard.replace(/<h3.*?>.*?<\/h3>/, '<h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>Allow EkSutra to create a secure digital signature</h3>');

// Remove subtitle under heading
consentCard = consentCard.replace(/<p style=\{\{ margin: 0, fontSize: "0.875rem", color: "var\(--text-secondary\)", marginTop: 4 \}\}>\s*Allow other departments to see these verified documents\s*<\/p>/, '');

// Replace Body text (between hr and permissions)
consentCard = consentCard.replace(/<p\s*style=\{\{\s*fontSize: "1rem",[\s\S]*?<\/p>/, '<p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-primary)", margin: "0 0 1.25rem" }}>EkSutra never stores your documents. It only verifies them and creates an encrypted digital signature — valid for 12 months — so other departments can confirm it\\'s genuine without asking you to upload again. Everything stays fully encrypted and isn\\'t accessible to anyone. Your privacy matters.</p>');

// Remove bullets and note since the prompt gave exact text for heading and body
consentCard = consentCard.replace(/\{\/\* Permissions \*\/\}[\s\S]*?\{\/\* Important note \*\/\}/, '');
consentCard = consentCard.replace(/<p style=\{\{ fontSize: "0.875rem"[\s\S]*?<\/p>/, '');

// Update Button text
consentCard = consentCard.replace(/Allow Access &amp; Continue/, 'I Agree & Continue');

fs.writeFileSync('components/ConsentCard.tsx', consentCard);
console.log('ConsentCard updated');
