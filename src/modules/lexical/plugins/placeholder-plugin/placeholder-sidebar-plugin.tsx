import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

import { usePlaceholderContext } from './placeholder-provider';

export function PlaceholderSidebarPlugin() {
  const { placeholders, updatePlaceholder } = usePlaceholderContext();

  return (
    <div className='mt-10 rounded-md border bg-card p-3'>
      <h4 className='mb-2 font-bold'>Placeholder Values</h4>
      {Object.entries(placeholders).map(([id, value]) => (
        <div key={id} className='mb-2' onSubmit={(e) => e.preventDefault()}>
          <Label className='capitalize'>{id.replaceAll('-', ' ')}</Label>
          <Input defaultValue={value} onBlur={(e) => updatePlaceholder(id, e.target.value)} />
        </div>
      ))}
    </div>
  );
}
