import { categories, type CategoryId } from './data'

export function CategoryMenu({ onSelect }: { onSelect: (id: CategoryId) => void }) {
  return (
    <section aria-labelledby="kategori-title" className="px-4">
      <h2 id="kategori-title" className="sr-only">Kategori</h2>
      <ul className="grid grid-cols-4 gap-2 rounded-2xl bg-card p-3 shadow-sm">
        {categories.map(({ id, label, icon: Icon, tone }) => (
          <li key={id}>
            <button type="button" onClick={() => onSelect(id)} className="group flex w-full flex-col items-center gap-1.5">
              <span className={`flex size-13 items-center justify-center rounded-full ${tone} transition-transform group-hover:scale-105 group-active:scale-95`}>
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="text-center text-[11px] font-semibold leading-tight text-foreground">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
