import { RenderMode, ServerRoute } from '@angular/ssr';

/**
* Configuração de rotas para Server-Side Rendering (SSR)
*
* Define estratégias de renderização para diferentes rotas da aplicação
*/
export const serverRoutes: ServerRoute[] = [
{
path: '',
renderMode: RenderMode.Prerender,
// cache: { // Opcional: configuração de cache para páginas estáticas
//   enabled: true,
//   maxAge: 3600 // 1 hora
// }
},
{
path: 'home',
renderMode: RenderMode.Prerender
},
{
path: 'about',
renderMode: RenderMode.Prerender
},
{
path: 'products/:id',
renderMode: RenderMode.Ssr // Renderização dinâmica no servidor para páginas de produtos
},
{
path: '**', // Fallback para todas as outras rotas
renderMode: RenderMode.Ssr // Renderização dinâmica no servidor como padrão
}
];

/**
* Estratégias de renderização disponíveis:
*
* - RenderMode.Prerender: Gera conteúdo estático durante o build (melhor performance)
* - RenderMode.Ssr: Renderiza dinamicamente no servidor a cada requisição (para conteúdo dinâmico)
*
* Boas práticas:
* 1. Use Prerender para páginas estáticas ou que mudam raramente
* 2. Use SSR para páginas com conteúdo dinâmico ou personalizado
* 3. Rotas com parâmetros devem geralmente usar SSR
*/
