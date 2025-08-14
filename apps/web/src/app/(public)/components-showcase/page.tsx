import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';

export default function ComponentsShowcasePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <section>
        <h2 className="text-xl font-semibold">Button</h2>
        <div className="mt-3 flex gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Input</h2>
        <div className="mt-3 max-w-sm">
          <Input placeholder="Type here" />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Checkbox</h2>
        <div className="mt-3">
          <Checkbox label="I agree" />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Select</h2>
        <div className="mt-3 max-w-sm">
          <Select options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]} />
        </div>
      </section>
    </div>
  );
}

