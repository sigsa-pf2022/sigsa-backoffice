export const MODULES = [
  {
    name: 'Dashboard',
    value: 'dashboard',
  },
  {
    name: 'Medicamentos',
    value: 'meds',
    submodules: [
      {
        name: 'Listado',
        value: 'meds_list',
        route: 'modules/meds/list',
      },
      {
        name: 'Tipos',
        value: 'meds_type',
        route: 'modules/meds/type',
      },
    ],
  },
  {
    name: 'Profesionales',
    value: 'professionals',
    submodules: [
      {
        name: 'Listado',
        value: 'professionals_list',
        route: 'modules/professionals/list',
      },
      {
        name: 'Especializaciones',
        value: 'professionals_specializations',
        route: 'modules/professionals/specializations/list',
      },
    ],
  },
  {
    name: 'Usuarios',
    value: 'users',
    submodules: [
      {
        name: 'Listado',
        value: 'users_list',
        route: 'modules/users/list',
      },
    ],
  },
];
