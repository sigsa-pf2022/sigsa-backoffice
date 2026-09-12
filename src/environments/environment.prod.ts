export const environment = {
  production: true,
  // Relativo a propósito: funciona detrás de cualquier proxy y no fija un host.
  // Sin esto, el build de producción dejaba todas las URLs en "undefined/...".
  apiUrl: '/api',
};
