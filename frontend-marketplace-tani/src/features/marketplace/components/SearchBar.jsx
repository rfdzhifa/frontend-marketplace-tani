import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';
import { cn } from '../../../utils/cn';

export function SearchBar({ defaultValue = '', onSearch, className }) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <div className="relative flex-1">
        <Search
          className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Cari produk..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-11 pr-10"
          aria-label="Cari produk"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            aria-label="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" variant="primary" size="md">
        Cari
      </Button>
    </form>
  );
}
