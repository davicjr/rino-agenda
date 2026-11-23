// Consultas e mutações da agenda pública. Atualiza a cada 15 s e quando o app volta para a tela.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type Reserva } from '@/lib/api'
import { diaSemana, somarDias } from '@/lib/datas'

export const useInicio = () => useQuery({ queryKey: ['inicio'], queryFn: api.inicio, staleTime: 60_000 })

export const useDia = (data: string | null) =>
  useQuery({
    queryKey: ['dia', data],
    queryFn: () => api.dia(data!),
    enabled: !!data,
    refetchInterval: 15_000,
    placeholderData: (anterior) => anterior,
  })

/** Uso do plano por aluno na semana (domingo a sábado) da data. */
export const useSemana = (data: string | null) =>
  useQuery({
    queryKey: ['semana', data ? somarDias(data, -diaSemana(data)) : null],
    queryFn: () => api.semana(data!),
    enabled: !!data,
    staleTime: 15_000,
  })

export function useAgendar(data: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { reserva: Reserva; gradeId: number }) => api.agendar(v.reserva, v.gradeId, data),
    onSettled: () => Promise.all([qc.invalidateQueries({ queryKey: ['dia', data] }), qc.invalidateQueries({ queryKey: ['semana'] })]),
  })
}

export function useRetirar(data: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.retirar(id),
    onSettled: () => Promise.all([qc.invalidateQueries({ queryKey: ['dia', data] }), qc.invalidateQueries({ queryKey: ['semana'] })]),
  })
}
