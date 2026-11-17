// Consultas e mutações da agenda pública. Atualiza a cada 15 s e quando o app volta para a tela.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useInicio = () => useQuery({ queryKey: ['inicio'], queryFn: api.inicio, staleTime: 60_000 })

export const useDia = (data: string | null) =>
  useQuery({
    queryKey: ['dia', data],
    queryFn: () => api.dia(data!),
    enabled: !!data,
    refetchInterval: 15_000,
    placeholderData: (anterior) => anterior,
  })

export function useAgendar(data: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { alunoId: number; gradeId: number }) => api.agendar(v.alunoId, v.gradeId, data),
    onSettled: () => qc.invalidateQueries({ queryKey: ['dia', data] }),
  })
}

export function useRetirar(data: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.retirar(id),
    onSettled: () => qc.invalidateQueries({ queryKey: ['dia', data] }),
  })
}
