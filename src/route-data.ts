import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getSpace, getSpaceFromPath } from './data/spaces';

export const onRequest = defineRouteMiddleware(async (context, next) => {
  const space = getSpaceFromPath(context.url.pathname);
  const route = context.locals.starlightRoute;

  route.sidebar =
    space === 'all' || space === 'partners'
      ? []
      : route.sidebar.filter((entry) => entry.type === 'group' && entry.label === getSpace(space).name);
  route.hasSidebar = route.sidebar.length > 0;

  await next();
});
