const fs = require('fs');
const path = require('path');

const files = [
  'components/DemoNav.tsx',
  'components/ConsentCard.tsx',
  'app/not-found.tsx',
  'app/layout.tsx',
  'app/department/scholarship/page.tsx',
  'app/department/agriculture/page.tsx',
  'app/admin/[department]/DepartmentAdminClient.tsx',
  'app/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace imports
  content = content.replace(/import PrimaryLogo from "[^"]+eksutra-logo-primary\.svg";/g, 'import PrimaryLogo from "@/components/logo/hero_logo.png";');
  content = content.replace(/import IconLogo from "[^"]+eksutra-logo-icon\.svg";/g, 'import IconLogo from "@/components/logo/hero_logo.png";');
  content = content.replace(/import CardLogo from "[^"]+eksutra-logo-card\.svg";/g, 'import CardLogo from "@/components/logo/hero_logo.png";');

  // For DemoNav relative paths
  content = content.replace(/import PrimaryLogo from "\.\/logo\/eksutra-logo-primary\.svg";/g, 'import PrimaryLogo from "./logo/hero_logo.png";');
  content = content.replace(/import IconLogo from "\.\/logo\/eksutra-logo-icon\.svg";/g, 'import IconLogo from "./logo/hero_logo.png";');

  // Update object property if needed (None right now, next/image handles static imports)

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Replaced imports in all files.');
