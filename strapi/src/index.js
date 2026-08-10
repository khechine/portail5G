'use strict';

const enablePermissions = async (strapi) => {
  try {
    const roleService = strapi.service('plugin::users-permissions.role');
    if (!roleService) return;

    const roles = await roleService.find();
    const publicRole = (roles || []).find((role) => role.type === 'public');
    if (!publicRole) return;

    const actionIds = [
      'api::home-page.home-page.find',
      'api::site-config.site-config.find',
      'api::lead.lead.create',
    ];

    const permQuery = strapi.db.query('plugin::users-permissions.permission');
    const existing = await permQuery.findMany({ where: { role: publicRole.id } });
    const existingActions = new Set((existing || []).map((perm) => perm.action));

    let created = 0;
    for (const action of actionIds) {
      if (existingActions.has(action)) continue;
      await permQuery.create({ data: { action, role: publicRole.id } });
      created += 1;
    }

    if (created > 0) {
      strapi.log.info(
        `[bootstrap] Permissions publiques activées (${created} nouvelle(s)) : ${actionIds.join(', ')}`
      );
    }
  } catch (err) {
    strapi.log.warn(`[bootstrap] Impossible d'activer les permissions : ${err.message}`);
  }
};

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await enablePermissions(strapi);
  },
};
