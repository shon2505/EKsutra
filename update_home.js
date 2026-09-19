const fs = require('fs');
let content = fs.readFileSync('app/HomePageClient.tsx', 'utf8');

// Remove metadata export
content = content.replace(/export const metadata: Metadata = \{[\s\S]*?\};\n/g, '');
content = content.replace(/import type \{ Metadata \} from "next";\n/g, '');

// Add use client and state
content = '"use client";\n\n' + content;
content = content.replace(/import Link from "next\/link";/, 'import Link from "next/link";\nimport { useState } from "react";\nimport DepartmentTransition from "@/components/DepartmentTransition";');

// Add state to component
content = content.replace(/export default function HomePage\(\) \{/, 'export default function HomePageClient() {\n  const [isRedirecting, setRedirecting] = useState(false);\n');

// Replace Start Demo and Begin Journey Links with Buttons
content = content.replace(/<Link href="\/department\/agriculture" style=\{\{ textDecoration: "none" \}\} id="start-demo-btn">\s*<Button size="lg">\s*Start Demo\s*<ArrowRight size=\{18\} \/>\s*<\/Button>\s*<\/Link>/g, '<Button size="lg" onClick={() => setRedirecting(true)} id="start-demo-btn">Start Demo<ArrowRight size={18} /></Button>');
content = content.replace(/<Link href="\/department\/agriculture" style=\{\{ textDecoration: "none" \}\} id="begin-journey-btn">\s*<Button size="lg">\s*Begin Journey\s*<ArrowRight size=\{18\} \/>\s*<\/Button>\s*<\/Link>/g, '<Button size="lg" onClick={() => setRedirecting(true)} id="begin-journey-btn">Begin Journey<ArrowRight size={18} /></Button>');

// Add the transition component
content = content.replace(/\{\/\* ── 4-Step Citizen Visual ── \*\/\}/g, '{isRedirecting && <DepartmentTransition targetDept="Department of Agriculture" targetUrl="/department/agriculture" />}\n\n      {/* ── 4-Step Citizen Visual ── */}');

fs.writeFileSync('app/HomePageClient.tsx', content);
console.log('HomePageClient updated');
