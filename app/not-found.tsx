import Link from 'next/link';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import IconLogo from '@/components/logo/eksutra-logo-icon.svg';

export default function NotFound() {
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.3, marginBottom: '2rem' }}>
          <Image src={IconLogo} alt="Not Found" style={{ width: 56, height: 'auto' }} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Could not find requested resource</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
