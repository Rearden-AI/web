import { Ecosystem } from '../components/ecosystem';
import { Hero } from '../components/hero';
import { JoinUs } from '../components/join-us';
import { Opportunities } from '../components/opportunities';
import { Partners } from '../components/partners';

export default function Home() {
  return (
    <div className='flex w-full flex-col'>
      <Hero />
      <Opportunities />
      <Ecosystem />
      <Partners />
      <JoinUs />
    </div>
  );
}
