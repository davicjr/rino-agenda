// Consulta + mutação com toast e recarga, padrão de todas as abas do admin.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useAcao<A>(fn: (a: A) => Promise<unknown>, chaves: string[][], sucesso?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => sucesso && toast.success(sucesso),
    onError: (e) => toast.error(e.message),
    onSettled: () => Promise.all(chaves.map((k) => qc.invalidateQueries({ queryKey: k }))),
  })
}
