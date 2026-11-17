import { useQuery } from '@tanstack/react-query'
import { admin } from '@/lib/apiAdmin'

export const useProfessores = () => useQuery({ queryKey: ['professores'], queryFn: admin.professores, staleTime: 60_000 })
