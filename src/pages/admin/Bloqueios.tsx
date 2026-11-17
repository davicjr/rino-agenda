// Próximos bloqueios, com opção de desfazer.
import { useQuery } from '@tanstack/react-query'
import { useAcao } from '@/hooks/useAdmin'
import { admin } from '@/lib/apiAdmin'
import { diaDoMes, mesCurto, nomeDia } from '@/lib/datas'

export function Bloqueios() {
  const lista = useQuery({ queryKey: ['bloqueios'], queryFn: admin.bloqueios })
  const desfazer = useAcao(admin.desbloquear, [['bloqueios'], ['dia']], 'Bloqueio desfeito.')
  if (!lista.data?.length) return null
  return (
    <div className="pt-4">
      <h2 className="font-display text-xl tracking-wide uppercase">Próximos bloqueios</h2>
      <ul className="mt-2 space-y-1.5">
        {lista.data.map((b) => (
          <li key={b.id} className="flex items-center gap-2 rounded-[var(--radius)] bg-carvao-2 p-3">
            <span className="flex-1">
              {nomeDia(b.data).slice(0, 3)} {diaDoMes(b.data)} {mesCurto(b.data)} · {b.hora ?? 'dia todo'}
              {b.motivo && <span className="text-carvao-10"> · {b.motivo}</span>}
            </span>
            <button onClick={() => desfazer.mutate(b.id)} className="h-9 text-sm font-semibold text-sangue-11">Desfazer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
