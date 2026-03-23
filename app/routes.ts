import { type RouteConfig, index } from '@react-router/dev/routes';

/**
 * React Router 7 route configuration.
 *
 * All routes are defined here and referenced by the framework
 * via react-router.config.ts.
 */
export default [
  index('routes/home.tsx'),
] satisfies RouteConfig;
