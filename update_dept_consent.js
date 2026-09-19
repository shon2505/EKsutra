const fs = require('fs');

['app/department/agriculture/page.tsx', 'app/department/revenue/page.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  const oldConsentBlockRegex = /\{step === "consent" && \([\s\S]*?<\/Card>\s*\)\}/;
  
  const newConsentBlock = `{step === "consent" && (
          <ConsentCard
            subjectName={personalDetails.name}
            departmentName=""
            onAccept={handleConsent}
            isLoading={consentLoading}
          />
        )}`;
        
  content = content.replace(oldConsentBlockRegex, newConsentBlock);
  fs.writeFileSync(file, content);
});
console.log('Departments updated');
