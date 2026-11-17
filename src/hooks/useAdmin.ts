// Mutação do admin com toast e recarga. Sessão vencida (401) devolve para a tela de senha.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useAcao<A>(fn: (a: A) => Promise<unknown>, chaves: string[][], sucesso?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => sucesso && toast.success(sucesso),
    onError: (e) => {
      toast.error(e.message)
      if (e.message === 'Área restrita.') qc.invalidateQueries({ queryKey: ['sessao'] })
    },
    onSettled: () => Promise.all(chaves.map((k) => qc.invalidateQueries({ queryKey: k }))),
  })
}
