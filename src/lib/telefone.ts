// 5577912345678 → (77) 91234-5678, para mostrar e editar sem o DDI.
export function telefoneLegivel(w: string) {
  const d = w.startsWith('55') ? w.slice(2) : w
  return d.length >= 10 ? `(${d.slice(0, 2)}) ${d.slice(2, -4)}-${d.slice(-4)}` : d
}
