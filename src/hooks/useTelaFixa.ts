// Prende a página à área visível enquanto a tela estiver aberta: a barra do navegador no
// celular não pode empurrar o conteúdo nem criar rolagem. Ao sair, a rolagem volta ao normal.
import { useLayoutEffect } from 'react'

export function useTelaFixa() {
  useLayoutEffect(() => {
    const raiz = document.documentElement
    raiz.classList.add('tela-fixa')
    return () => raiz.classList.remove('tela-fixa')
  }, [])
}
