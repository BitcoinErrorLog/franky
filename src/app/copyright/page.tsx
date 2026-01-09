import * as Molecules from '@/molecules';
import * as Templates from '@/templates';

export const metadata = Molecules.Metadata({
  title: 'Copyright | Pubky App',
  description: 'Copyright information and legal notices for Pubky App',
});

export default function CopyrightPage() {
  return <Templates.Copyright />;
}
