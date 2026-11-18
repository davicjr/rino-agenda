// Mutação do admin com aviso e recarga. Sessão vencida (401) devolve para a tela de senha.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { avisar } from '@/lib/avisar'

export function useAcao<A>(fn: (a: A) => Promise<unknown>, chaves: string[][], sucesso?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => sucesso && avisar.sucesso(sucesso),
    onError: (e) => {
      avisar.erro(e.message)
      if (e.message === 'Área restrita.') qc.invalidateQueries({ queryKey: ['sessao'] })
    },
    onSettled: () => Promise.all(chaves.map((k) => qc.invalidateQueries({ queryKey: k }))),
  })
}
