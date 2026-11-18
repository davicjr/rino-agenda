// Gaveta inferior (vaul): as ações ficam na zona do polegar.
import type { ReactNode } from 'react'
import { Drawer } from 'vaul'

type Props = { aberta: boolean; onFechar: () => void; titulo: ReactNode; descricao?: ReactNode; children: ReactNode }

export function Gaveta({ aberta, onFechar, titulo, descricao, children }: Props) {
  return (
    <Drawer.Root open={aberta} onOpenChange={(v) => !v && onFechar()} repositionInputs={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-preto/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-[var(--radius)] bg-carvao-2 outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-carvao-6" />
          <div className="shrink-0 px-5 pt-4 pb-3">
            <Drawer.Title className="font-display text-3xl leading-none tracking-wide uppercase">{titulo}</Drawer.Title>
            {descricao && <Drawer.Description className="mt-2 text-carvao-11">{descricao}</Drawer.Description>}
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pt-1 pb-[max(env(safe-area-inset-bottom),1.25rem)]">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
