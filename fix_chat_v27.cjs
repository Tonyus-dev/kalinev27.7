const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

file = file.replace(
  /const \[kalineVersion, setKalineVersion\] = useState<'V27' \| 'V27b'>\(\(\) => \{\s*return \(localStorage\.getItem\('kaline_version'\) as 'V27' \| 'V27b'\) \|\| 'V27';\s*\}\);/g,
  `const [kalineVersion, setKalineVersion] = useState<'V27' | 'V27b'>(() => {
    return (localStorage.getItem('kaline_version') as 'V27' | 'V27b') || 'V27';
  });

  useEffect(() => {
    const handleVersionChange = (e: any) => {
      setKalineVersion(e.detail);
    };
    window.addEventListener('kalineVersionChanged', handleVersionChange);
    return () => window.removeEventListener('kalineVersionChanged', handleVersionChange);
  }, []);`
);

// We need to match exactly this part:
const btnRegex = /\s*\{\/\* Toggle V27\/V27b Button \*\/\}\s*<button\s*onClick=\{[^\}]*\}\s*className="[^"]*"\s*title=\{[^\}]*\}\s*>\s*\{kalineVersion\}\s*<\/button>/g;
file = file.replace(btnRegex, "");

fs.writeFileSync('src/components/KalineChat.tsx', file);
