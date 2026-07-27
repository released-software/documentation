import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { filterSidebarForPath } from './data/sidebar';

export const onRequest = defineRouteMiddleware(async (context, next) => {
  const route = context.locals.starlightRoute;

  route.sidebar = filterSidebarForPath(context.url.pathname, route.sidebar);
  route.hasSidebar = route.sidebar.length > 0;

  await next();
});
