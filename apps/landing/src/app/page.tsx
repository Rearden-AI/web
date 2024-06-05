import { Ecosystem } from '../components/ecosystem';
import { Hero } from '../components/hero';
import { Opportunities } from '../components/opportunities';

export default function Home() {
  return (
    <div className='flex flex-col w-full'>
      <Hero />
      <Opportunities />
      <Ecosystem />
    </div>
  );
}
